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
export const addBooking = async (req, res) => {
    try {
        const { name, email, date, timing, seatNumbers, movieName, totalAmount, paymentStatus } = req.body;

        // Check for already booked seats
        const existingBookings = await Booking.find({ date, timing });
        const bookedSeats = existingBookings.flatMap(b => b.seatNumbers);
        const overlap = seatNumbers.some(seat => bookedSeats.includes(seat));

        if (overlap) {
            return res.status(400).json({ success: false, message: "Some seats are already booked" });
        }

        const bookingId = "BKG-" + uuidv4().split("-")[0];

        // Generate QR code
        const qrDataUrl = await QRCode.toDataURL(JSON.stringify({ bookingId, name, email, movieName, date, timing, seatNumbers, totalAmount, paymentStatus }));
        const base64QR = qrDataUrl.split(",")[1];

        // Save booking
        const booking = new Booking({ ...req.body, bookingId });
        await booking.save();

        // Send email
        try {
            await resend.emails.send({
                from: "MovieZone <onboarding@resend.dev>",
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
                      <img src="cid:qrcode" alt="QR Code" style="margin-top: 15px; border: 2px solid #e50914; border-radius: 10px; width: 180px;" />
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

// Get booked seats
export const getBookedSeats = async (req, res) => {
    const { date, timing } = req.query;
    try {
        const bookings = await Booking.find({ date, timing });
        const seats = bookings.flatMap(b => b.seatNumbers);
        res.json({ success: true, message: "Fetched seats successfully", data: seats });
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
