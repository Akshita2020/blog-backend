const authService = require('../services/authService');

const authController = {
  register: async (req, res) => {
    try {
      const {name, email, password} = req.body;

      const result = await authService.registerUser(
        {name, email, password},
        req,
      );

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          token: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      if (error.field === 'email') {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Server error during registration',
      });
    }
  },

  login: async (req, res) => {
    try {
      const {email, password} = req.body;
      const result = await authService.loginUser({email, password}, req);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      console.error('LOGIN ERROR:', error);

      if (error.field === 'credentials') {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Server error during login',
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const result = await authService.getUserProfile(req.user.id);

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('PROFILE ERROR:', error);

      if (error.statusCode === 404) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  },

  refreshAccessToken: async (req, res) => {
    try {
      //  Support both web and mobile
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token missing',
        });
      }

      const result = await authService.refreshAccessToken(refreshToken);

      return res.status(200).json({
        success: true,
        token: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error) {
      console.error('REFRESH TOKEN ERROR:', error);
      const statusCode = error.statusCode || 401;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Logout from current device only
  logout: async (req, res) => {
    try {
      const refreshToken = req.validRefreshToken;
      const userId = req.tokenUser.id;
      const userInfo = req.tokenUser;

      const result = await authService.secureLogout(userId, refreshToken);

      // Clear cookies for current device
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.status(200).json({
        success: true,
        message: 'Successfully logged out from current device',
        data: {
          user: {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
          },
          logoutTime: new Date().toISOString(),
          deviceInfo: result.auditInfo?.deviceInfo || 'Unknown Device',
        },
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        errors: [
          {
            field: 'logout',
            message: 'Logout failed - please try again',
          },
        ],
      });
    }
  },

  // Logout from all devices
  logoutAll: async (req, res) => {
    try {
      const userId = req.user.id;

      const result = await authService.logoutAllDevices(userId);

      // Clear cookies for current device
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.status(200).json({
        success: true,
        message: 'Successfully logged out from all devices',
        data: {
          user: result.user,
          devicesLoggedOut: result.devicesLoggedOut,
          logoutTime: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('LOGOUT ALL DEVICES ERROR:', error);

      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        errors: [
          {
            field: 'logoutAll',
            message: 'Logout from all devices failed - please try again',
          },
        ],
      });
    }
  },

  // Get active sessions (bonus endpoint for session management)
  getActiveSessions: async (req, res) => {
    try {
      const userId = req.user.id;

      const sessions = await authService.getUserActiveSessions(userId);

      return res.status(200).json({
        success: true,
        message: 'Active sessions retrieved successfully',
        data: {
          sessions,
          totalSessions: sessions.length,
        },
      });
    } catch (error) {
      console.error('GET ACTIVE SESSIONS ERROR:', error);

      return res.status(500).json({
        success: false,
        message: 'Server error retrieving active sessions',
      });
    }
  },

  // Revoke specific session (bonus endpoint for session management)
  revokeSession: async (req, res) => {
    try {
      const userId = req.user.id;
      const {sessionId} = req.params;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required',
        });
      }

      const result = await authService.revokeSession(
        userId,
        parseInt(sessionId),
      );

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          sessionId: result.sessionId,
        },
      });
    } catch (error) {
      console.error('REVOKE SESSION ERROR:', error);

      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = authController;
