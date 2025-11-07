import mongoose from "mongoose";

const SeatDetailSchema = new mongoose.Schema({
  row: { type: Number, required: true },
  seat: { type: Number, required: true },
});

const BookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    timing: { type: String, required: true },
    movieName: { type: String, required: true },
    movieId: { type: String, required: true },
    seatNumbers: {
  type: [
    {
      seat: { type: Number, required: true },
      row: { type: Number, required: true },
    },
  ],
  required: true,
},

    seatDetails: { type: [SeatDetailSchema], default: [] },

    adult: { type: Number, required: true },
    kids: { type: Number, required: true },
    ticketType: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    totalSeatsSelected: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    collectorChangedFrom: { type: String, default: "" },


    collectorType: { type: String, default: "" },
    collectorId: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
