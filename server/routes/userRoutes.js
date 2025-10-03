import express from "express";
import {
  updateStatus,
  getUsers,
  deleteUsers,
} from "../controllers/userControllers.js";
import { verifyToken, checkAdmin } from "../authMiddleware.js";

const router = express.Router();
router.get("/", verifyToken, getUsers);
router.patch("/status", verifyToken, checkAdmin, updateStatus);
router.delete("/delete", verifyToken, checkAdmin, deleteUsers);

export default router;
