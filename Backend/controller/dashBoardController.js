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






// 🧩 Helper functions
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}


export const updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus, collectorType, collectorId } = req.body;

    if (!bookingId)
      return res.status(400).json({ success: false, message: "Booking ID is required" });

    let collector = null;
    if (collectorId) collector = await auth.findById(collectorId).select("name email");

    // ✅ ADMIN CASE
    if (collectorType === "Admin") {
      const booking = await Booking.findOneAndUpdate(
        { bookingId },
        { paymentStatus: "paid", collectorType, collectorId },
        { new: true }
      );
      if (!booking)
        return res.status(404).json({ success: false, message: "Booking not found" });

      // Generate QR
      const qrDataUrl = await QRCode.toDataURL(
        JSON.stringify({
          bookingId,
          movieName: booking.movieName,
          date: booking.date,
          timing: booking.timing,
          seatNumbers: booking.seatNumbers,
        })
      );
      const base64QR = qrDataUrl.split(",")[1];

      // 🎨 Modern light-themed email
      await resend.emails.send({
        from: "MovieZone <noreply@tamilmovie.no>",
        to: booking.email,
        subject: `✅ Payment Successful - ${booking.movieName}`,
        html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; background: #f6f9fc; padding: 20px;">
          <div style="max-width: 620px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.08); overflow: hidden;">
            
            <div style="background: linear-gradient(135deg, #007bff, #00c6ff); padding: 20px; text-align: center;">
              <h2 style="color: #fff; margin: 0;">🎉 Payment Successful</h2>
              <p style="color: #eaf6ff; margin: 5px 0;">Your booking is confirmed!</p>
            </div>

            <div style="padding: 25px;">
              <p style="font-size: 16px; color: #333;">Hi <strong>${booking.name}</strong>,</p>
              <p style="color: #555;">We’ve received your payment for <strong>${booking.movieName}</strong>. Here are your booking details:</p>

              <div style="background-color: #f2f8ff; padding: 15px 20px; border-radius: 8px; margin: 15px 0; color: #333;">
                <p><strong>🎬 Movie:</strong> ${booking.movieName}</p>
                <p><strong>📅 Date:</strong> ${formatDate(booking.date)}</p>
                <p><strong>⏰ Time:</strong> ${formatTime(booking.timing)}</p>
                <p><strong>💺 Seats:</strong> ${
                  (booking.seatNumbers && booking.seatNumbers.length)
                    ? booking.seatNumbers
                        .map(s => (s.row ? s.row + "-" + s.seat : String(s.seat)))
                        .join(", ")
                    : 'N/A'
                }</p>
                <p><strong>💰 Total:</strong> SEK ${booking.totalAmount}</p>
                <p><strong>💳 Payment Mode:</strong> ${booking.ticketType}</p>
                <p><strong>👤 Colected By:</strong> Admin </p>
                <p><strong>✅ Status:</strong> Paid</p>
              </div>

              <p style="color: #333;">📱 Show this QR code at the theatre entrance:</p>
              <div style="text-align: center; margin-top: 10px;">
                <img src="cid:qrcode" alt="QR Code" style="width:150px; height:150px; border-radius:8px; border:1px solid #ccc;" />
              </div>

              <div style="margin-top: 25px; text-align: center;">
                <a href="http://localhost:5173/booking/${booking.bookingId}/${booking.email}/ordersnack"
                  style="display:inline-block; background: linear-gradient(90deg,#007bff,#00c6ff); color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:500;">
                  🍿 Order Your Snacks
                </a>
              </div>

              <p style="margin-top: 20px; text-align:center; color:#666;">
                Thank you for booking with <strong>MovieZone</strong>!<br>
                Enjoy your movie 🎥
              </p>
            </div>
          </div>
        </div>
        `,
        attachments: [
          { filename: "qrcode.png", content: base64QR, content_id: "qrcode" },
        ],
      });

      return res.status(200).json({
        success: true,
        message: "✅ Payment marked as paid by Admin and email sent successfully",
        booking,
      });
    }

    // ✅ For other collector types (like "videoSpeed", etc.)
    if (!paymentStatus || !["pending", "paid", "failed"].includes(paymentStatus.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid payment status" });
    }

    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      { paymentStatus, collectorType, collectorId },
      { new: true }
    );

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    // Send mail if payment done
    if (paymentStatus.toLowerCase() === "paid") {
      const qrDataUrl = await QRCode.toDataURL(JSON.stringify({ bookingId }));
      const base64QR = qrDataUrl.split(",")[1];

      await resend.emails.send({
        from: "MovieZone <noreply@tamilmovie.no>",
        to: booking.email,
        subject: `✅ Payment Successful - ${booking.movieName}`,
        html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; background: #f6f9fc; padding: 20px;">
          <div style="max-width: 620px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.08); overflow: hidden;">
            
            <div style="background: linear-gradient(135deg, #007bff, #00c6ff); padding: 20px; text-align: center;">
              <h2 style="color: #fff; margin: 0;">🎉 Payment Successful</h2>
              <p style="color: #eaf6ff; margin: 5px 0;">Your booking is confirmed!</p>
            </div>

            <div style="padding: 25px;">
              <p style="font-size: 16px; color: #333;">Hi <strong>${booking.name}</strong>,</p>
              <p style="color: #555;">We’ve received your payment for <strong>${booking.movieName}</strong>. Here are your booking details:</p>

              <div style="background-color: #f2f8ff; padding: 15px 20px; border-radius: 8px; margin: 15px 0; color: #333;">
                <p><strong>🎬 Movie:</strong> ${booking.movieName}</p>
                <p><strong>📅 Date:</strong> ${formatDate(booking.date)}</p>
                <p><strong>⏰ Time:</strong> ${formatTime(booking.timing)}</p>
                <p><strong>💺 Seats:</strong> ${
                  (booking.seatNumbers && booking.seatNumbers.length)
                    ? booking.seatNumbers
                        .map(s => (s.row ? s.row + "-" + s.seat : String(s.seat)))
                        .join(", ")
                    : 'N/A'
                }</p>
                <p><strong>💰 Total:</strong> SEK ${booking.totalAmount}</p>
                <p><strong>💳 Payment Mode:</strong> ${booking.ticketType}</p>
                <p><strong>👤 Colected By:</strong> Admin </p>
                <p><strong>✅ Status:</strong> Paid</p>
              </div>

              <p style="color: #333;">📱 Show this QR code at the theatre entrance:</p>
            

              

              <p style="margin-top: 20px; text-align:center; color:#666;">
                Thank you for booking with <strong>MovieZone</strong>!<br>
                Enjoy your movie 🎥
              </p>
            </div>
          </div>
        </div>
        `,
        attachments: [
          { filename: "qrcode.png", content: base64QR, content_id: "qrcode" },
        ],
      });
    }

    return res.status(200).json({
      success: true,
      message: "✅ Payment status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ Error in updatePaymentStatus:", error);
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
