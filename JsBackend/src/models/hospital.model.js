import mongoose from "mongoose";

const bedShape = {
  total: { type: Number, default: 0 },
  occupied: { type: Number, default: 0 },
};

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    beds: {
      icu: bedShape,
      general: bedShape,
      emergency: bedShape,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hospital", hospitalSchema);