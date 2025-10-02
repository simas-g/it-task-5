import express from "express";
import {
  registerUser,
  loginUser,
  verifyUser,
  logoutUser,
  checkUserStatus,
} from "../controllers/authControllers.js";
const router = express.Router();
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.get("/verify-email", verifyUser);
router.get("/status", checkUserStatus);
export default router;
