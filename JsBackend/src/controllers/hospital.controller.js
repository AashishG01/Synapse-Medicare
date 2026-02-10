import axios from "axios";
import Hospital from "../models/hospital.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const updateBeds = asyncHandler(async (req, res) => {
  const { category, type } = req.body; // type: 'inc' or 'dec'

  if (!category || !["icu", "general", "emergency"].includes(category)) {
    throw new ApiError(400, "category must be icu, general or emergency");
  }

  if (!type || !["inc", "dec"].includes(type)) {
    throw new ApiError(400, "type must be inc or dec");
  }

  const updateField = `beds.${category}.occupied`;
  const increment = type === "inc" ? 1 : -1;

  // Find the hospital managed by the logged-in admin
  const hospital = await Hospital.findOne({ admin: req.user?.id });
  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  const currentOccupied = hospital.beds?.[category]?.occupied ?? 0;
  const total = hospital.beds?.[category]?.total ?? 0;
  const nextOccupied = currentOccupied + increment;

  if (nextOccupied < 0 || nextOccupied > total) {
    throw new ApiError(400, "Occupied beds cannot exceed available capacity");
  }

  hospital.beds[category].occupied = nextOccupied;
  await hospital.save();

  res.status(200).json(hospital);
});

export const generateHandoffSummary = asyncHandler(async (req, res) => {
  const { reports } = req.body;

  if (!reports || !Array.isArray(reports)) {
    throw new ApiError(400, "Reports array is required");
  }

  try {
    const response = await axios.post(`${process.env.PYTHON_BACKEND_URL}/smart-handoff-summary`, {
      reports
    });

    res.status(200).json(response.data);
  } catch (error) {
    throw new ApiError(500, "Failed to generate summary from AI service");
  }
});