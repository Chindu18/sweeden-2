import Booking from "../Models/Booking.js";
import multer from "multer";
import Movie from "../Models/Movies.js";


import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name:'dfom7glyl',
    api_key:process.env.api_key,
    api_secret:process.env.api_pass,
});


// Add a booking
// Controllers/yourController.js

import { v4 as uuidv4 } from 'uuid'; 

export const addBooking = async (req, res) => {
  try {
    const { date, timing, seatNumbers } = req.body;

    // Check if seats are already booked
    const existingBookings = await Booking.find({ date, timing });
    const bookedSeats = existingBookings.flatMap(b => b.seatNumbers);

    const overlap = seatNumbers.some(seat => bookedSeats.includes(seat));
    if (overlap) {
      return res.status(400).json({ message: "Some seats are already booked", success: false });
    }

    // 👇 generate a bookingId here
    const bookingId = "BKG-" +  uuidv4().split("-")[0];


    //qr genreating
    const qrDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "H",  // highest quality
      type: "image/png",
      quality: 1,
      margin: 2,
      scale: 10,                  // higher scale = sharper image
      color: {
        dark: "#000000",          // QR color
        light: "#ffffff",         // background color
      },
    });

    // Save booking with bookingId
    const booking = new Booking({
      ...req.body,
      bookingId
    });
    await booking.save();

    res.status(201).json({ 
      message: "Booking saved successfully",
      success: true,
      data:booking,
      qrCode: qrDataUrl,
      bookingId 
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};


// Get booked seats for a date & timing
export const getBookedSeats = async (req, res) => {
  const { date, timing } = req.query;
  try {
    const bookings = await Booking.find({ date, timing });
    const seats = bookings.flatMap(b => b.seatNumbers);
    res.json({success:true,
      message:"fetchehed seat successfully",
      data:seats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






// ---------------------- Multer Storage ----------------------







// ---------------------- Add Movie Controller ----------------------

// Controllers/userDetailControl.js


// ---------------------- Multer Local Storage ----------------------


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "movies/posters",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});
export const upload = multer({ storage });


// ---------------------- Add Movie Controller ----------------------



export const addMovie = async (req, res) => {
  try {
    const {
      title,
      hero,
      heroine,
      villain,
      supportArtists,
      director,
      producer,
      musicDirector,
      cinematographer,
      showTimings,
    } = req.body;

    // ✅ Direct Cloudinary URLs from multer-storage-cloudinary
    const uploadedPosters = req.files.map((file) => file.path);

    // ✅ Parse show timings
    let shows = [];
    try {
      shows = showTimings ? JSON.parse(showTimings) : [];
    } catch {
      shows = [];
    }

    // ✅ Create and save movie
    const newMovie = new Movie({
      title,
      cast: {
        actor: hero,
        actress: heroine,
        villan: villain,
        supporting: supportArtists,
      },
      crew: {
        director,
        producer,
        musicDirector,
        cinematographer,
      },
      posters: uploadedPosters, // ✅ Cloudinary URLs auto stored
      shows,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json({ success: true, message: "Movie added successfully", data: savedMovie });
  } catch (error) {
    console.error("Error in addMovie:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
