import Booking from "../Models/Booking.js";
import Movie from "../Models/Movies.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import QRCode from "qrcode";
import { Resend } from "resend";
import { v4 as uuidv4 } from 'uuid';

const resend = new Resend(process.env.RESEND_API_KEY);

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dfom7glyl',
    api_key: process.env.api_key,
    api_secret: process.env.api_pass,
});

// ==================== Booking Controllers ====================

// Add Booking
import Blockedseats from "../Models/blocked.js";

// ---------------- Add Booking ----------------
export const addBooking = async (req, res) => {
  try {
    const { name, email, date, timing, seatNumbers, movieName, totalAmount, paymentStatus,phone,totalSeats} = req.body;

    // 1️⃣ Check for already booked seats
    const existingBookings = await Booking.find({ date, timing });
    const bookedSeats = existingBookings.flatMap(b => b.seatNumbers);

    // 2️⃣ Get blocked seats for this show
    const blockedDocs = await Blockedseats.find(); // optionally filter by date/show if you have that field
    const blockedSeats = blockedDocs.flatMap(doc => doc.blockedseats);

    // 3️⃣ Combine booked + blocked
    const unavailableSeats = [...bookedSeats, ...blockedSeats];

    // 4️⃣ Check overlap
    const overlap = seatNumbers.some(seat => unavailableSeats.includes(seat));
    if (overlap) {
      return res.status(400).json({ success: false, message: "Some seats are already booked or blocked" });
    }

    // 5️⃣ Generate booking ID
    const bookingId = "BKG-" + uuidv4().split("-")[0];

    // 6️⃣ Generate QR code
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify({ bookingId, name, email, movieName, date, timing, seatNumbers, totalAmount, paymentStatus}));
    const base64QR = qrDataUrl.split(",")[1];

    // 7️⃣ Save booking
 const booking = new Booking({
  ...req.body,
 
  totalSeatsSelected: totalSeats, // map correctly
  bookingId
});

    await booking.save();

    // 8️⃣ Send email
    try {
      await resend.emails.send({
        from: "Sweeden Tamil Cinima <onboarding@resend.dev>",
        to: email,
        subject: `🎟️ Your Booking QR - ${bookingId}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #1c1c1c; color: #fff; padding: 20px;">
            <h2 style="color: #e50914;">🎬 Booking Confirmation</h2>
            <p>Hi ${name},</p>
            <p>Here’s your QR code and ticket details.</p>
            <div style="background-color: #2c2c2c; padding: 15px; border-radius: 8px;">
              <p><strong>Movie:</strong> ${movieName}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${timing}</p>
              <p><strong>Seats:</strong> ${seatNumbers.join(", ")}</p>
              <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
              <p><strong>Payment:</strong> ${paymentStatus}</p>
              <p><strong>Payment:</strong>video speed</p> 
            </div>
            <p style="margin-top: 20px;">Show this QR at the theater entrance 🎟️</p>
          </div>
        `,
        attachments: [{ filename: "qrcode.png", content: base64QR, content_id: "qrcode" }]
      });
    } catch (err) {
      console.error("❌ Error sending mail:", err.message);
      return res.status(500).json({ success: false, message: "Booking saved but email failed: " + err.message });
    }

    res.status(201).json({ message: "Booking saved and email sent successfully", success: true, data: booking, qrCode: qrDataUrl, bookingId });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

// ---------------- Get Booked Seats ----------------
export const getBookedSeats = async (req, res) => {
  const { date, timing } = req.query;
  try {
    const bookings = await Booking.find({ date, timing });
    const bookedSeats = bookings.flatMap(b => b.seatNumbers);

    const blockedDocs = await Blockedseats.find(); // optionally filter by date/show
    const blockedSeats = blockedDocs.flatMap(doc => doc.blockedseats);

    const unavailableSeats = [...bookedSeats, ...blockedSeats];

    res.json({ success: true, message: "Fetched unavailable seats successfully", data: unavailableSeats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==================== Movie Upload Controllers ====================

// Multer Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
        if (file.fieldname === "photos") {
            return { folder: "movies/posters", allowed_formats: ["jpg", "jpeg", "png", "webp"] };
        }
        if (file.fieldname === "trailer") {
            return { folder: "movies/trailers", resource_type: "video", allowed_formats: ["mp4", "mov", "avi"] };
        }
    }
});

export const uploadMovieFiles = multer({ storage }).fields([
    { name: "photos", maxCount: 3 },
    { name: "trailer", maxCount: 1 }
]);

// Add Movie
export const addMovie = async (req, res) => {
    try {
        const { title, hero, heroine, villain, supportArtists, director, producer, musicDirector, cinematographer, showTimings } = req.body;

        if (!req.files || !req.files.photos) return res.status(400).json({ success: false, message: "Posters are required" });
        if (!req.files.trailer) return res.status(400).json({ success: false, message: "Trailer is required" });

        const uploadedPosters = req.files.photos.map(file => file.path);
        const trailerUrl = req.files.trailer[0].path;
        const shows = showTimings ? JSON.parse(showTimings) : [];

        const newMovie = new Movie({
            title,
            cast: { actor: hero, actress: heroine, villan: villain, supporting: supportArtists },
            crew: { director, producer, musicDirector, cinematographer },
            posters: uploadedPosters,
            trailer: trailerUrl,
            shows
        });

        const savedMovie = await newMovie.save();
        res.status(201).json({ success: true, message: "Movie added successfully", data: savedMovie });
    } catch (error) {
        console.error("Error in addMovie:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addShow = async (req, res) => {
  try {
    const { title, showTimings } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "movieId is required" });
    }
    if (!showTimings) {
      return res.status(400).json({ success: false, message: "Show timings are required" });
    }

    const shows = typeof showTimings === "string" ? JSON.parse(showTimings) : showTimings;

    const movie = await Movie.findById(title);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    movie.shows = [...movie.shows, ...shows];

    const updatedMovie = await movie.save();

    res.status(200).json({
      success: true,
      message: "Show timings added successfully",
      data: updatedMovie,
    });
  } catch (error) {
    console.error("Error in addShow:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


