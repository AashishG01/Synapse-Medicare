import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Verify critical variables
const requiredEnvs = ["MONGO_URI", "JWT_SECRET"];
const missingEnvs = requiredEnvs.filter((key) => !process.env[key]);

if (missingEnvs.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvs.join(", ")}`);
  process.exit(1);
}

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  env: process.env.NODE_ENV || "development"
};
