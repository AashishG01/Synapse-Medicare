import Doctor from '../models/doctor.model.js';

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public

export const getDoctors = async (req, res) => {
  try {
    // We can add filtering later (e.g., by specialization)
    const doctors = await Doctor.find({}).populate('hospital', 'name'); // Show hospital name
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('hospital', 'name');
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private (Doctor only)
export const updateProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor profile not found' });
    }

    const { specialization, qualifications, experienceYears, availableSlots } = req.body;

    if (specialization) doctor.specialization = specialization;
    if (qualifications) doctor.qualifications = qualifications;
    if (experienceYears) doctor.experienceYears = experienceYears;
    if (availableSlots) doctor.availableSlots = availableSlots;

    await doctor.save();
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
