import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Hospital from "../models/hospital.model.js";
import Doctor from "../models/doctor.model.js";
import { UserRoles } from "../constants/roles.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper function to generate JWT token
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

// @desc    Register a new user (patient)
// @route   POST /api/v1/auth/register/user
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "fullName, email and password are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role: UserRoles.PATIENT,
  });

  const token = generateToken(user._id, user.role);
  res.status(201).json({ token, role: user.role });
});

// @desc    Register a new hospital admin
// @route   POST /api/v1/auth/register/hospital
export const registerHospital = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "fullName, email and password are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(400, "Hospital account already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role: UserRoles.HOSPITAL_ADMIN,
  });

  // Create Hospital Profile linked to this Admin
  await Hospital.create({
    name: fullName, // Default to using admin's name, can be updated later
    admin: user._id,
  });

  const token = generateToken(user._id, user.role);
  res.status(201).json({ token, role: user.role });
});

// @desc    Login user or hospital
// @route   POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  const token = generateToken(user._id, user.role);
  res.status(200).json({ token, role: user.role });
});

// @desc    Register a new doctor
// @route   POST /api/v1/auth/register/doctor
export const registerDoctor = asyncHandler(async (req, res) => {
  const { fullName, email, password, specialization, qualifications, experienceYears, hospitalId } = req.body;

  if (!fullName || !email || !password || !specialization || !qualifications || !hospitalId) {
    throw new ApiError(400, "All fields are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role: UserRoles.DOCTOR,
  });

  // Create Doctor Profile
  await Doctor.create({
    name: fullName,
    user: user._id,
    specialization,
    qualifications,
    experienceYears: experienceYears || 0,
    hospital: hospitalId
  });

  const token = generateToken(user._id, user.role);
  res.status(201).json({ token, role: user.role });
});