// routes/bookingRoute.js
import express from "express";
import Booking from "../Models/Booking.js";
const snackbookingrouter = express.Router();

// 🔹 Get booking by ID
snackbookingrouter.get("/getbooking/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// bookingRoute.js
snackbookingrouter.put("/update-snacks/:bookingId", async (req, res) => {
  try {
    const updated = await Booking.findOneAndUpdate(
      { bookingId: req.params.bookingId },
      {
        $set: {
          snackItems: req.body.snackItems,
          snackTotal: req.body.snackTotal,
          snackPaymentStatus: req.body.snackPaymentStatus,
        },
      },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, booking: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default snackbookingrouter;
