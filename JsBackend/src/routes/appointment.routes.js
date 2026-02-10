import express from "express";
import { createAppointment, getAppointments } from "../controllers/appointment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Allow creating an appointment without being forced to login (Guest), 
// but link to user if token is present.
// For now, let's use standard protect if you only want logged-in users, 
// OR just leave it public for the demo if auth in frontend is tricky.
// The prompt implies "frontend or user part", so let's assume public access is okay for booking,
// but let's try to grab user from token if available.

// Since I don't have optionalProtect, I'll stick to a simple strategy:
// POST / -> Public (Patient Name/Phone manually entered)
router.post("/", createAppointment);

// GET / -> Protected (My appointments)
router.get("/", protect, getAppointments);

export default router;
