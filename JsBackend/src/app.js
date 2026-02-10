import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import donorRoutes from "./routes/donor.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";
import reportRoutes from "./routes/report.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";

const app = express();

// 1. Security Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));

// 2. Rate Limiting (Prevents DDoS/Brute force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, slow down!",
});
app.use("/api/", limiter);

// 3. Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/donors", donorRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/hospitals", hospitalRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/appointments", appointmentRoutes);

// 4. Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// 5. Global Error Handler (MUST BE LAST)
app.use(errorHandler);

export { app };