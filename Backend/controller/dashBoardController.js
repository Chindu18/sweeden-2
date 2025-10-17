// controllers/bookingController.js
import Booking from "../Models/Booking.js";
import Movies from "../Models/Movies.js";
import QRCode from "qrcode";
import { Resend } from "resend";

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







// Update payment status by bookingId
export const updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus, collectorType, collectorId } = req.body;

    if (!paymentStatus || !['pending', 'paid', 'failed'].includes(paymentStatus.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid paymentStatus" });
    }

    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      { 
        paymentStatus: paymentStatus.toLowerCase(),
        collectorType,
        collectorId
      },
      { new: true }
    );

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    // ✅ Generate QR code for email
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify({
      bookingId,
      movieName: booking.movieName,
      date: booking.date,
      timing: booking.timing,
      seatNumbers: booking.seatNumbers
    }));
    const base64QR = qrDataUrl.split(",")[1];

    // ✅ Send email
    await resend.emails.send({
      from: "MovieZone <noreply@tamilmovie.no>",
      to: booking.email,
      subject: `🎟️ Your Booking QR - ${bookingId}`,
      html: `<div style="font-family: Arial, sans-serif; color: #fff; background: #1c1c1c; padding: 20px;">
        <h2 style="color: #e50914;">🎬 Booking Confirmation</h2>
        <p>Hi ${booking.name},</p>
        <p>Here’s your QR code and ticket details.</p>
        <div style="background-color: #2c2c2c; padding: 15px; border-radius: 8px;">
          <p><strong>Movie:</strong> ${booking.movieName}</p>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Time:</strong> ${booking.timing}</p>
          <p><strong>Seats:</strong> ${booking.seatNumbers.join(", ")}</p>
          <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
          <p><strong>Payment:</strong> ${paymentStatus}</p>
          <p><strong>Payment mood:</strong> ${booking.ticketType}</p>
          <img src="cid:qrcode" style="width:180px; border:2px solid #e50914; border-radius:10px;" />
        </div>
      </div>`,
      attachments: [{
        filename: "qrcode.png",
        content: base64QR,
        content_id: "qrcode"
      }]
    });

    res.json({ success: true, message: `Payment updated to ${paymentStatus}`, data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};







///total shows with movie name filter



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






///id

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
