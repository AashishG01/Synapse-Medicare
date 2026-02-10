import express from "express";
import multer from "multer";
import { analyzeReport } from "../controllers/report.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/analyze", protect, upload.single("report"), analyzeReport);

export default router;

