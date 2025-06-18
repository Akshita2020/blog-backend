const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const error = new Error(
      "JWT_SECRET is not defined in environment variables"
    );
    console.error("JWT_SECRET missing error:", error);
    throw error;
  }

  try {
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    return token;
  } catch (jwtError) {
    console.error("JWT signing error:", jwtError);
    throw jwtError;
  }
};

const generateRefreshToken = (payload) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    const error = new Error(
      "JWT_REFRESH_SECRET is not defined in environment variables"
    );
    console.error("JWT_REFRESH_SECRET missing error:", error);
    throw error;
  }

  try {
    const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });
    console.log(
      "Refresh token generated successfully, length:",
      refreshToken.length
    );
    return refreshToken;
  } catch (jwtError) {
    console.error("JWT refresh token signing error:", jwtError);
    throw jwtError;
  }
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
};
