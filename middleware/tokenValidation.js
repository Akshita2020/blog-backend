const jwt = require("jsonwebtoken");
const { User, RefreshToken } = require("../models/index");

const validateRefreshTokenForLogout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required for secure logout",
        errors: [
          {
            field: "refreshToken",
            message:
              "Refresh token not provided. Please ensure you are logged in.",
          },
        ],
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError.message);
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        errors: [
          {
            field: "refreshToken",
            message: "Token signature verification failed",
          },
        ],
      });
    }

    // Find active refresh token in database
    const tokenRecord = await RefreshToken.findOne({
      where: {
        refreshToken: refreshToken,
        userId: decoded.id,
        isActive: true, // Only check active tokens
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
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        errors: [
          {
            field: "refreshToken",
            message:
              "Token not found in database, inactive, or already invalidated",
          },
        ],
      });
    }

    // Check if token is expired
    if (new Date(tokenRecord.expiresAt) < new Date()) {
      // Mark as inactive instead of destroying
      await tokenRecord.update({ isActive: false });

      return res.status(401).json({
        success: false,
        message: "Refresh token expired",
        errors: [
          {
            field: "refreshToken",
            message: "Token has expired, please login again",
          },
        ],
      });
    }

    req.tokenUser = {
      id: tokenRecord.user.id,
      name: tokenRecord.user.name,
      email: tokenRecord.user.email,
    };
    req.validRefreshToken = refreshToken;

    next();
  } catch (error) {
    console.error("REFRESH TOKEN VALIDATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during token validation",
      errors: [
        {
          field: "server",
          message: "Internal server error during logout validation",
        },
      ],
    });
  }
};

module.exports = {
  validateRefreshTokenForLogout,
};
