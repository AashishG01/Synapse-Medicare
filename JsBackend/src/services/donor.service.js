import User from "../models/user.model.js";

export const findNearbyDonors = async (lng, lat, bloodGroup) => {
    return await User.find({
        bloodGroup,
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [lng, lat] },
                $maxDistance: 10000 // 10km
            }
        }
    }).select("fullName bloodGroup");
};