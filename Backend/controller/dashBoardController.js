// controllers/bookingController.js
import Booking from "../Models/Booking.js";
import Movies from "../Models/Movies.js";
import QRCode from "qrcode";
import { Resend } from "resend";
import auth from "../Models/users.js"

const resend = new Resend(process.env.RESEND_API_KEY);

export const getTotalSeats = async (req, res) => {
  try {
    const { movieName } = req.query; // get movieName from query params

    const matchStage = movieName ? { movieName } : {}; // filter only if movieName provided

    const totalSeats = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalSeats: { $sum: "$totalSeatsSelected" }
        }
      }
    ]);

    res.json({
      success: true,
      totalSeats: totalSeats[0]?.totalSeats || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};




export const pendingMoney = async (req, res) => {
  try {
    const { paymentStatus,movieName} = req.query;
    if (!paymentStatus&&!movieName) {
      return res.status(400).json({
        success: false,
        message: "paymentStatus query parameter is required",
      });
    }

    // 1️⃣ Get all bookings with the requested payment status
    const bookings = await Booking.find({ movieName,paymentStatus, });

    // 2️⃣ Calculate total amount
    const totalAmount = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

    res.json({
      success: true,
      message: "Pending payment bookings fetched successfully",
      data: bookings,
      totalAmount, // ✅ total sum of totalAmount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching pending bookings",
    });
  }
};





   const formatTime = (timeString) => {
  const [hour, minute] = timeString.split(":");
  const dateObj = new Date();
  dateObj.setHours(Number(hour) || 0, Number(minute) || 0);
  return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateString) => {
  const options = { weekday: "short", day: "numeric", month: "short" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};


///total shows with movie name filter
export const updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus, collectorType, collectorId } = req.body;

    // ✅ 1. If collectorType is admin — directly mark as paid
    if (collectorType === "Admin") {
      const booking = await Booking.findOneAndUpdate(
        { bookingId },
        { paymentStatus: "paid" },
        { new: true }
      );
      if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

      return res.status(200).json({ success: true, message: "Marked as paid by admin", booking });
    }

    // ✅ 2. For others, do normal checks
    if (!paymentStatus || !["pending", "paid", "failed"].includes(paymentStatus.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid payment status" });
    }

    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      { paymentStatus, collectorType, collectorId },
      { new: true }
    );

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    res.status(200).json({ success: true, message: "Payment status updated", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getTotalShows = async (req, res) => {
  try {
    const { movieName } = req.query; //
    if (!movieName) {
      return res.status(400).json({ success: false, message: "movieName is required" });
    }

    // Find movie by name
    const movie = await Movies.findOne({ title: movieName });

    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    // Count total shows
    const totalShows = movie.shows?.length || 0;

    res.json({
      success: true,
      movieName: movie.title,
      totalShows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};








export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "bookingId parameter is required",
      });
    }

    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

   
    res.json({
      success: true,
      message: "Booking fetched and QR sent to email successfully",
      data: booking,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
