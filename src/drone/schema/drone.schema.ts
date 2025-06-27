import { timeStamp } from 'console';
import mongoose from 'mongoose';

export const DroneSchema = new mongoose.Schema(
  {
    serial_number: String,
    model: String,
    weight_limit: Number,
    no_of_medications: Number,
    current_load_weight: Number,
    battery_level: Number,
    state: STATE,
  },
  {
    timestamps: true,
  },
);
