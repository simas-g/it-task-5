import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

export function checkAdmin(req, res, next) {
  if (!req.user || !req.user.status) {
    return res.status(403).json({ message: "Forbidden. User status unknown." });
  }
  if (req.user.status === "active") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied. Requires administrative privileges." });
  }
}
