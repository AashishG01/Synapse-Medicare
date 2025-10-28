import mongoose from 'mongoose';

const HealthReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportName: {
    type: String,
    required: [true, 'Please provide a name for the report'],
  },
  // We will store the file on a cloud service like AWS S3 or Cloudinary
  // and save the URL here.
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String, // e.g., 'PDF', 'JPEG'
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

const HealthReport = mongoose.model('HealthReport', HealthReportSchema);
export default HealthReport;
