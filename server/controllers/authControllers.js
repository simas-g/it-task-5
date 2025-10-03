import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import serverMessages from "../serverMessages.js";
import signCookie from "./signJwt.js";
import {
  findUserByEmail,
  createUser,
  findUserByVerificationToken,
  updateUsersStatus,
  updateUserLoginTime,
} from "../userModel.js";
import { sendVerificationEmail } from "../mailerService.js";

const SALT_ROUNDS = 10;

export async function verifyUser(req, res) {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: "Verification token is missing." });
  }
  try {
    const user = await findUserByVerificationToken(token);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid or expired verification token." });
    }
    if (user.status === "active") {
      return serverMessages(
        res,
        404,
        "Already verified",
        "Account is already verified."
      );
    }
    const success = await updateUsersStatus([user.id], "active");
    if (success) {
      return serverMessages(
        res,
        200,
        "Success",
        "Account verified and activated successfully."
      );
    } else {
      throw new Error("Activation update failed.");
    }
  } catch (error) {
    console.error("Verification error:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error during verification." });
  }
}

export async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required." });
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
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${verification_token}`;
    await sendVerificationEmail(email, name, verificationLink);
    return res.status(201).json({
      userId: newUserId,
      status: initialStatus,
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
    signCookie(user, res);
    await updateUserLoginTime(user.id);
    return res.status(200).json({
      userId: user.id,
      status: user.status,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error during login." });
  }
}
export async function checkUserStatus(req, res) {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authenticated. Token missing." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserByEmail(decoded.email);
    return res.status(200).json({
      userId: user.id,
      email: user.email,
      status: user.status,
    });
  } catch (err) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res
      .status(401)
      .json({ message: "Not authenticated. Session invalid." });
  }
}

export async function logoutUser(_req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  return res
    .status(200)
    .json({ message: "Successfully logged out and cookie deleted." });
}
