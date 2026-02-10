import { asyncHandler } from "../utils/asyncHandler.js";
import * as donorService from "../services/donor.service.js";
import { ApiError } from "../utils/ApiError.js";

export const getDonors = asyncHandler(async (req, res) => {
  const { lng, lat, bloodGroup } = req.query;

  if (!lng || !lat || !bloodGroup) {
    throw new ApiError(
      400,
      "lng, lat and bloodGroup query params are required"
    );
  }

  const longitude = parseFloat(lng);
  const latitude = parseFloat(lat);

  if (Number.isNaN(longitude) || Number.isNaN(latitude)) {
    throw new ApiError(400, "lng and lat must be valid numbers");
  }

  const donors = await donorService.findNearbyDonors(
    longitude,
    latitude,
    bloodGroup
  );

  res.status(200).json({ success: true, data: donors });
});