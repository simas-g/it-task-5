import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { findUserByEmail, createUser } from "./userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required." });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long." });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const verification_token = crypto.randomBytes(32).toString("hex");
    const initialStatus = "unverified";
    const newUserId = await createUser({
      name,
      email,
      password_hash,
      verification_token,
      status: initialStatus,
    });

    return res.status(201).json({
      message: "User registered successfully. Status set to 'unverified'.",
      userId: newUserId,
      email: email,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error during registration." });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ message: "Your account is currently blocked." });
    }
    if (user.status === "unverified") {
      return res
        .status(403)
        .json({ message: "Please verify your email address to log in." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, status: user.status },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token: token,
      userId: user.id,
      status: user.status,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error during login." });
  }
}
