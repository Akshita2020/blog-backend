const { authService } = require("../services/authService");

const cleanupExpiredTokens = async () => {
  try {
    const cleanedCount = await authService.cleanupExpiredTokens();

    return cleanedCount;
  } catch (error) {
    console.error(" Token cleanup failed:", error);
    throw error;
  }
};

if (require.main === module) {
  cleanupExpiredTokens()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { cleanupExpiredTokens };
