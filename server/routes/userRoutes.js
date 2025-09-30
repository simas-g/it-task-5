import express from "express";
import {
  updateUserStatus,
  getAllUsers,
} from "../controllers/userControllers.js";
import {
  verifyToken,
  checkAdmin,
  updateUserStatus,
} from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", verifyToken, getAllUsers);
router.patch("/:id/status", verifyToken, checkAdmin, updateUserStatus);
