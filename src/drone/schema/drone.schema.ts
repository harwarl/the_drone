import { timeStamp } from 'console';
import mongoose from 'mongoose';

enum STATE {
  idle,
  loading,
  loaded,
  delivering,
  delivered,
  returning,
}

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



