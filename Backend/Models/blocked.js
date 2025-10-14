// Models/Booking.js
import mongoose from "mongoose";

const BlockingSchema = new mongoose.Schema(
  {
    blockedseats: { type: [Number], required: true }, // Corrected 'number' -> 'Number'
  },
  { timestamps: true }
);

export default mongoose.model("Blockedseats", BlockingSchema);
