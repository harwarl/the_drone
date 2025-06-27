import { timeStamp } from 'console';
import mongoose from 'mongoose';

export const MedicationSchema = new mongoose.Schema(
  {
    droneId: String,
    name: String,
    weight: Number,
    code: String,
    image_url: String,
    destination: String,
    status: MEDICATION_STATUS,
  },
  {
    timestamps: true,
  },
);
