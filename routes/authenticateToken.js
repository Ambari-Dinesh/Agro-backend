const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
 
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
 

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token,process.env.JWT_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    req.user = user; // decoded token payload
    next();
  });
};

module.exports = authenticateToken;
