const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { authenticateToken } = require("../middleware/auth");
const {
  validateRefreshTokenForLogout,
} = require("../middleware/tokenValidation");
const {
  validateRegistration,
  validateLogin,
} = require("../middleware/validation");

// Test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth routes working",
  });
});

// Public routes
router.post("/refresh-token", authController.refreshAccessToken);

router.post(
  "/register",
  (req, res, next) => {
    next();
  },
  validateRegistration,
  authController.register
);

router.post(
  "/login",
  (req, res, next) => {
    next();
  },
  validateLogin,
  authController.login
);

// Logout routes
router.post("/logout", validateRefreshTokenForLogout, authController.logout);

router.post("/logout-all", authenticateToken, authController.logoutAll);

// Protected routes
router.get("/profile", authenticateToken, authController.getProfile);

// Session management routes (bonus features)
router.get("/sessions", authenticateToken, authController.getActiveSessions);
router.delete(
  "/sessions/:sessionId",
  authenticateToken,
  authController.revokeSession
);

module.exports = router;
