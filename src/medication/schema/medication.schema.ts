import { timeStamp } from 'console';
import mongoose from 'mongoose';

export const MedicationSchema = new mongoose.Schema(
  {
    drone_id: String,
    name: String,
    weight: Number,
    code: String,
    image_url: String,
  },
  {
    timestamps: true,
  },
);
