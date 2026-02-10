import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Create a new appointment
// @route   POST /api/v1/appointments
// @access  Public (or Protected if we enforce login)
export const createAppointment = asyncHandler(async (req, res) => {
    const { patientName, phone, doctorId, date, time, notes, type } = req.body;

    if (!patientName || !phone || !doctorId || !date || !time) {
        throw new ApiError(400, "All fields are required");
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        throw new ApiError(404, "Doctor not found");
    }

    // Check availability (Basic check)
    // In a real app, we'd check if the slot is already taken

    const appointment = await Appointment.create({
        patientName,
        phone,
        doctor: doctorId,
        date,
        time,
        notes,
        type,
        user: req.user ? req.user._id : null
    });

    res.status(201).json({ success: true, data: appointment });
});

// @desc    Get appointments for the logged-in user or doctor
// @route   GET /api/v1/appointments
// @access  Private
export const getAppointments = asyncHandler(async (req, res) => {
    // If user is a Doctor
    if (req.user.role === 'DOCTOR') {
        // Find doctor profile for this user
        const doctorProfile = await Doctor.findOne({ user: req.user._id });
        if (!doctorProfile) {
            return res.status(200).json({ success: true, data: [] });
        }
        const appointments = await Appointment.find({ doctor: doctorProfile._id }).populate('user', 'fullName email');
        return res.status(200).json({ success: true, data: appointments });
    }

    // If user is a Patient (or other), find appointments linked to them
    // Note: Since we are storing patientName/phone separately for guest checkout potential, 
    // we might primarily query by user ID if it exists.
    const appointments = await Appointment.find({ user: req.user._id }).populate('doctor', 'name specialization');
    res.status(200).json({ success: true, data: appointments });
});
