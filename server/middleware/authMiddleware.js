// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Populate req.user with the decoded information. Our tokens contain
    // an id and name. We no longer use the email field.
    req.user = { id: decoded.id, name: decoded.name };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
