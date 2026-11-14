const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect Routes
const protect = async (req, res, next) => {
  let token;

  try {
    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token provided"
      });
    }

    // Verify Token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Get User
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    if (!req.user.isActive) {
      return res.status(403).json({
        message: "Account is inactive"
      });
    }

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed"
    });
  }
};

module.exports = { protect };