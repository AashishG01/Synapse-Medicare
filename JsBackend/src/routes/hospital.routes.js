import express from "express";
import { updateBeds, generateHandoffSummary } from "../controllers/hospital.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.patch(
  "/beds",
  protect,
  authorize("HOSPITAL_ADMIN"),
  updateBeds
);

router.post("/handoff-summary", generateHandoffSummary);

export default router;

