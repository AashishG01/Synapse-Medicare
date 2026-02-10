import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const analyzeReport = asyncHandler(async (req, res) => {
    const reportFile = req.file; // From Multer
    if (!reportFile) throw new ApiError(400, "Report file is required");

    // 1. Upload to Cloudinary (Standard Practice)
    // 2. Send URL to Python Backend
    const pyResponse = await axios.post(`${process.env.PYTHON_BACKEND_URL}/analyze`, {
        fileUrl: reportFile.path 
    });

    res.status(200).json({
        success: true,
        analysis: pyResponse.data,
        message: "AI Analysis complete"
    });
});