import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  qualifications: {
    type: String,
    required: true,
  },
  experienceYears: {
    type: Number,
    default: 0,
  },
  // Link to the hospital that added this doctor
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model where role is 'hospital'
    required: true,
  },
  // To manage doctor's availability
  availableSlots: {
    type: [Date], // An array of available date-time slots
    default: [],
  },
  profileImage: {
    type: String, // URL to the image
    default: 'no-photo.jpg',
  },
}, {
  timestamps: true
});

const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;
