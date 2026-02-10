import axios from "axios";
import { ApiError } from "../utils/ApiError.js";

export const analyzeHealthReport = async (fileUrl) => {
    try {
        const response = await axios.post(`${process.env.PYTHON_BACKEND_URL}/analyze`, { url: fileUrl });
        return response.data;
    } catch (error) {
        throw new ApiError(500, "AI Analysis Service Down");
    }
};