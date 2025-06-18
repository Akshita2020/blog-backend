const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const models = require("../models/index");
const { User, RefreshToken } = models;
const { generateToken, generateRefreshToken } = require("../utils/jwt");

const authService = {
  // Helper function to extract device info
  _extractDeviceInfo: (req) => {
    const userAgent = req?.headers?.["user-agent"] || "Unknown Device";
    const ipAddress = req?.ip || req?.connection?.remoteAddress || "Unknown IP";

    return {
      deviceInfo: userAgent.substring(0, 255), // Truncate to fit DB field
      ipAddress: ipAddress.substring(0, 45), // Truncate to fit DB field
    };
  },

  // Register a new user
  registerUser: async (userData, req = null) => {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error("User already exists with this email");
      error.field = "email";
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = generateToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    // Fix: Use authService instead of this
    const deviceInfo = authService._extractDeviceInfo(req);

    await RefreshToken.create({
      userId: user.id,
      refreshToken: refreshToken,
      expiresAt: refreshTokenExpiresAt,
      deviceInfo: deviceInfo.deviceInfo,
      ipAddress: deviceInfo.ipAddress,
      isActive: true,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  },

  // Login user
  loginUser: async (credentials, req = null) => {
    const { email, password } = credentials;

    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.field = "credentials";
      throw error;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("Invalid email or password");
      error.field = "credentials";
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      error.field = "credentials";
      throw error;
    }

    const accessToken = generateToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });
    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    // Fix: Use authService instead of this
    const deviceInfo = authService._extractDeviceInfo(req);

    // Store refresh token for this device/session
    await RefreshToken.create({
      userId: user.id,
      refreshToken: refreshToken,
      expiresAt: refreshTokenExpiresAt,
      deviceInfo: deviceInfo.deviceInfo,
      ipAddress: deviceInfo.ipAddress,
      isActive: true,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  },

  // Refresh access token
  refreshAccessToken: async (refreshToken) => {
    if (!refreshToken) {
      const error = new Error("Refresh token required");
      error.statusCode = 401;
      throw error;
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const tokenRecord = await RefreshToken.findOne({
        where: {
          refreshToken: refreshToken,
          userId: decoded.id,
          isActive: true, // Only active tokens
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "email"],
          },
        ],
      });

      if (!tokenRecord) {
        const error = new Error(
          "Invalid refresh token - not found in database or inactive"
        );
        error.statusCode = 403;
        throw error;
      }

      if (new Date(tokenRecord.expiresAt) < new Date()) {
        // Mark as inactive instead of destroying
        await tokenRecord.update({ isActive: false });
        const error = new Error("Refresh token expired");
        error.statusCode = 403;
        throw error;
      }

      const newAccessToken = generateToken({
        id: tokenRecord.user.id,
        email: tokenRecord.user.email,
      });

      return {
        accessToken: newAccessToken,
      };
    } catch (jwtError) {
      if (
        jwtError.name === "JsonWebTokenError" ||
        jwtError.name === "TokenExpiredError"
      ) {
        const error = new Error("Invalid or expired refresh token");
        error.statusCode = 401;
        throw error;
      }
      throw jwtError;
    }
  },

  // Secure logout - only logout current device
  secureLogout: async (userId, refreshToken) => {
    if (!refreshToken) {
      const error = new Error("Refresh token required for secure logout");
      error.statusCode = 400;
      throw error;
    }

    const tokenRecord = await RefreshToken.findOne({
      where: {
        refreshToken: refreshToken,
        userId: userId,
        isActive: true,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!tokenRecord) {
      const error = new Error("Invalid refresh token or user mismatch");
      error.statusCode = 401;
      throw error;
    }

    const auditInfo = {
      userId: tokenRecord.user.id,
      userEmail: tokenRecord.user.email,
      userName: tokenRecord.user.name,
      deviceInfo: tokenRecord.deviceInfo,
      ipAddress: tokenRecord.ipAddress,
      logoutTime: new Date().toISOString(),
      tokenExpiresAt: tokenRecord.expiresAt,
      action: "SECURE_LOGOUT",
    };

    // Mark token as inactive instead of destroying for audit purposes
    await tokenRecord.update({ isActive: false });

    return {
      message: "Securely logged out from current device",
      auditInfo,
    };
  },

  // Logout from all devices
  logoutAllDevices: async (userId) => {
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email"],
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Mark all active tokens as inactive
    const result = await RefreshToken.update(
      { isActive: false },
      {
        where: {
          userId: userId,
          isActive: true,
        },
      }
    );

    return {
      message: "Successfully logged out from all devices",
      devicesLoggedOut: result[0],
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  },

  // Get user's active sessions
  getUserActiveSessions: async (userId) => {
    const sessions = await RefreshToken.findAll({
      where: {
        userId: userId,
        isActive: true,
        expiresAt: {
          [require("sequelize").Op.gt]: new Date(),
        },
      },
      attributes: ["id", "deviceInfo", "ipAddress", "createdAt", "expiresAt"],
      order: [["createdAt", "DESC"]],
    });

    return sessions.map((session) => ({
      id: session.id,
      deviceInfo: session.deviceInfo,
      ipAddress: session.ipAddress,
      loginTime: session.createdAt,
      expiresAt: session.expiresAt,
    }));
  },

  // Revoke specific session
  revokeSession: async (userId, sessionId) => {
    const tokenRecord = await RefreshToken.findOne({
      where: {
        id: sessionId,
        userId: userId,
        isActive: true,
      },
    });

    if (!tokenRecord) {
      const error = new Error("Session not found or already inactive");
      error.statusCode = 404;
      throw error;
    }

    await tokenRecord.update({ isActive: false });

    return {
      message: "Session revoked successfully",
      sessionId: sessionId,
    };
  },

  getUserProfile: async (userId) => {
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "createdAt", "updatedAt"],
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return { user };
  },

  cleanupExpiredTokens: async () => {
    try {
      const { Op } = require("sequelize");

      const result = await RefreshToken.update(
        { isActive: false },
        {
          where: {
            expiresAt: {
              [Op.lt]: new Date(),
            },
            isActive: true,
          },
        }
      );

      return result[0];
    } catch (error) {
      console.error("Error during security cleanup:", error);
      throw error;
    }
  },
};

module.exports = authService;
