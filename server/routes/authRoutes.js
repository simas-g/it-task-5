import express from "express";
import {
  registerUser,
  loginUser,
  verifyUser,
} from "../controllers/authControllers.js";

const router = express.Router();
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/verify", verifyUser);
export default router;
