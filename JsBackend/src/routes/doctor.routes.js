import express from "express";
import {
  getDoctors,
  getDoctorById,
  updateProfile,
} from "../controllers/doctor.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").get(getDoctors);
router.route("/:id").get(getDoctorById);
router.route("/profile").put(protect, authorize("DOCTOR"), updateProfile);

export default router;
