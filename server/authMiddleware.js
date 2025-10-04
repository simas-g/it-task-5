import jwt from "jsonwebtoken";
import { findUserByEmail } from "./userModel.js";

export async function verifyToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserByEmail(decoded.email);
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

export function checkAdmin(req, res, next) {
  if (!req.user) {
    return res.status(403).json({ message: "Forbidden. User status unknown." });
  }
  if (req.user.status !== "blocked") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied. Requires administrative privileges." });
  }
}
