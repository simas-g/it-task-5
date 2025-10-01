import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Malformed token format." });
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
