import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The hospital where the appointment is booked
    required: true,
  },
  appointmentTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Pending'],
    default: 'Scheduled',
  },
  notes: {
    type: String, // Any notes patient wants to add
  },
}, {
  timestamps: true
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);
export default Appointment;
