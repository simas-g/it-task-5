import express from "express";
import { updateStatus, getUsers } from "../controllers/userControllers.js";
import { verifyToken, checkAdmin } from "../authMiddleware.js";

const router = express.Router();
router.get("/", verifyToken, getUsers);
router.patch("/:id/status", verifyToken, checkAdmin, updateStatus);
export default router;
