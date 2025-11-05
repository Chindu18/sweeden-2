import Booking from "../Models/Booking.js";
import Movie from "../Models/Movies.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import QRCode from "qrcode";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import MovieGroup from "../Models/currentMovie.js";
import Blockedseats from "../Models/blocked.js";
import auth from "../Models/users.js"

const resend = new Resend(process.env.RESEND_API_KEY);

// ============= Cloudinary Configuration =============
cloudinary.config({
  cloud_name: "dfom7glyl",
  api_key: process.env.api_key,
  api_secret: process.env.api_pass,
});

// ============= Multer Storage Setup (Cloudinary) =============
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === "photos") {
      return {
        folder: "movies/posters",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      };
    }
  },
});

export const uploadMovieFiles = multer({ storage }).array("photos", 3);


export const addBooking = async (req, res) => {
  try {
    let {
      name,
      email,
      date,
      timing,
      seatNumbers,
      movieName,
      kids,
      adult,
      totalAmount,
      paymentStatus,
      phone,
      totalSeatsSelected,
      ticketType,
      seatLayoutSets,
    } = req.body;

    // 🧩 Step 1: Validate required fields
    if (
      !name ||
      !email ||
      !date ||
      !timing ||
      !seatNumbers ||
      !movieName ||
      !phone ||
      !totalAmount ||
      !ticketType ||
      !seatLayoutSets
    ) {
      return res.status(400).json({
        success: false,
        message: "❌ All fields are required. Please fill every detail properly.",
      });
    }

    // 🧩 Step 2: Validate seat layout format
    if (!Array.isArray(seatLayoutSets)) {
      return res.status(400).json({
        success: false,
        message: "❌ Seat layout format invalid.",
      });
    }

    // 🧩 Step 3: Normalize ticketType ("video speed" → "videoSpeed")
    const normalizedType = ticketType.toLowerCase().replace(/\s+/g, "");
    if (normalizedType === "videospeed" || normalizedType === "video") {
      ticketType = "videoSpeed";
    } else {
      ticketType = ticketType.trim();
    }

    // 🧩 Step 4: Fetch existing bookings
    const existingBookings = await Booking.find({ date, timing });
    const bookedSeats = existingBookings.flatMap((b) => b.seatNumbers);

    // 🧩 Step 5: Get blocked seats
    const blockedDocs = await Blockedseats.find();
    const blockedSeats = blockedDocs.flatMap((doc) => doc.blockedseats);
    const unavailableSeats = [...bookedSeats, ...blockedSeats];

    // 🧩 Step 6: Normalize selected seats
    const selectedSeatNumbers = seatNumbers.map((s) =>
      typeof s === "object" ? s.seat : s
    );

    const overlap = selectedSeatNumbers.some((seat) =>
      unavailableSeats.includes(seat)
    );

    if (overlap) {
      return res.status(400).json({
        success: false,
        message:
          "❌ Booking failed — Some of your selected seats were just booked!",
      });
    }

    // 🧩 Step 7: Generate booking ID
    const bookingId = "BKG-" + uuidv4().split("-")[0].toUpperCase();

    // 🧩 Step 8: Map seat details
    let seatCounter = 1;
    const seatDetails = [];
    seatLayoutSets.forEach((row, rowIndex) => {
      const totalSeatsInRow = row[0];
      for (let i = 0; i < totalSeatsInRow; i++) {
        if (selectedSeatNumbers.includes(seatCounter)) {
          seatDetails.push({ row: rowIndex + 1, seat: seatCounter });
        }
        seatCounter++;
      }
    });

    // 🧩 Step 9: Format seats for email
    const formattedSeats = seatNumbers
      .map((s) => `R${s.row}-S${s.seat}`)
      .join(", ");

    // 🧩 Step 10: Generate QR Code
    const qrPayload = {
      bookingId,
      name,
      movieName,
      date,
      timing,
      seatDetails,
      totalAmount,
      paymentStatus,
      ticketType,
    };
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload));
    const base64QR = qrDataUrl.split(",")[1];
    const collectorChangedFrom =ticketType;
    // 🧩 Step 11: Save booking
    const booking = new Booking({
      bookingId,
      name,
      email,
      phone,
      date,
      timing,
      movieName,
      seatNumbers,
      seatDetails,
      kids,
      adult,
      totalAmount,
      totalSeatsSelected: totalSeatsSelected || selectedSeatNumbers.length,
      ticketType,
      paymentStatus,
      collectorChangedFrom
    });

    await booking.save();

    // 🧩 Step 12: Send confirmation email
    await resend.emails.send({
      from: "MovieZone <noreply@tamilmovie.no>",
      to: email,
      subject: `🎬 Your MovieZone Booking Confirmation — ${bookingId}`,
 html: `
  <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f1f3f6; padding: 30px;">
    <div style="max-width: 640px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0a1f44, #0078d7); padding: 22px 0; text-align: center;">
        <h2 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600; letter-spacing: 0.5px;">
          Booking Confirmation
        </h2>
      </div>

      <!-- Body -->
      <div style="padding: 30px 35px; color: #111; line-height: 1.6;">
        <p style="margin: 0 0 12px;">Hello <strong>${name}</strong>,</p>
        <p style="margin: 0 0 20px;">
          Your booking for the movie below has been successfully confirmed.  
          Please review your details carefully before your showtime.
        </p>

        <!-- Booking Details -->
        <div style="background: #f9fafc; border: 1px solid #e4e6eb; border-radius: 8px; padding: 20px;">
          <p><strong style="color:#0078d7;">Movie Name:</strong> ${movieName}</p>
          <p><strong style="color:#0078d7;">Date:</strong> ${date}</p>
          <p><strong style="color:#0078d7;">Time:</strong> ${timing}</p>
          <p><strong style="color:#0078d7;">Seat Numbers:</strong> ${formattedSeats}</p>
          <p><strong style="color:#0078d7;">Adults:</strong> ${adult || 0}</p>
          <p><strong style="color:#0078d7;">Kids:</strong> ${kids || 0}</p>
          <p><strong style="color:#0078d7;">Ticket Type:</strong> ${ticketType}</p>
          <p><strong style="color:#0078d7;">Total Amount:</strong> SEK ${totalAmount}</p>
          <p><strong style="color:#0078d7;">Phone:</strong> ${phone}</p>
        </div>

       

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

        <p style="font-size: 13px; color: #222; text-align: center;">
          <strong>Booking ID:</strong> ${bookingId}
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #0a1f44; text-align: center; padding: 15px 0;">
        <p style="color: #ffffff; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} MovieZone — All Rights Reserved
        </p>
      </div>

    </div>
  </div>
`



,
      attachments: [
        { filename: "qrcode.png", content: base64QR, content_id: "qrcode" },
      ],
    });

    // 🧩 Step 13: Final response
    return res.status(201).json({
      success: true,
      message: "✅ Booking successful and email sent!",
      data: booking,
      bookingId,
      qrCode: qrDataUrl,
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    return res.status(500).json({
      success: false,
      message: "❌ Booking failed — " + error.message,
    });
  }
};





// ---------------- Get Booked Seats ----------------
export const getBookedSeats = async (req, res) => {
  const { date, timing } = req.query;
  try {
    const bookings = await Booking.find({ date, timing });

    // Extract only seat numbers (not row objects)
    const bookedSeats = bookings.flatMap((b) =>
      b.seatNumbers.map((s) => s.seat)
    );

    // Include blocked seats
    const blockedDocs = await Blockedseats.find();
    const blockedSeats = blockedDocs.flatMap((doc) => doc.blockedseats);

    // Merge both
    const unavailableSeats = [...bookedSeats, ...blockedSeats];

    res.json({
      success: true,
      message: "Fetched unavailable seats successfully",
      data: unavailableSeats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ---------------- Add Movie ----------------
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
      moviePosition,
      trailer,
    } = req.body;

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ success: false, message: "Posters are required" });

    const uploadedPosters = req.files.map((file) => file.path);
    const shows = showTimings ? JSON.parse(showTimings) : [];

    const newMovie = new Movie({
      title,
      cast: { actor: hero, actress: heroine, villan: villain, supporting: supportArtists },
      crew: { director, producer, musicDirector, cinematographer },
      posters: uploadedPosters,
      trailer,
      shows,
    });

    const savedMovie = await newMovie.save();

    let movieGroup = (await MovieGroup.findOne()) || new MovieGroup();

    if (moviePosition === "1") movieGroup.movie1 = savedMovie._id;
    else if (moviePosition === "2") movieGroup.movie2 = savedMovie._id;
    else if (moviePosition === "3") movieGroup.movie3 = savedMovie._id;
    else return res.status(400).json({ success: false, message: "Invalid moviePosition" });

    const savedGroup = await movieGroup.save();

    res.status(201).json({
      success: true,
      message: "Movie saved successfully",
      data: { singleMovie: savedMovie, group: savedGroup },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Update Movie ----------------
export const updatemovie = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      hero,
      heroine,
      villain,
      supportArtists,
      director,
      producer,
      musicDirector,
      cinematographer,
      trailer,
      showTimings,
    } = req.body;

    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // ✅ Update cast, crew, trailer
    movie.cast = { actor: hero, actress: heroine, villan: villain, supporting: supportArtists };
    movie.crew = { director, producer, musicDirector, cinematographer };
    movie.trailer = trailer;

    // ✅ Add new shows only
    const newShows = JSON.parse(showTimings || "[]");
    newShows.forEach((show) => {
      if (show.isNew) movie.shows.push(show);
    });

    // ✅ Update photos if new ones uploaded
    if (req.files && req.files.length > 0) {
      const uploadedPosters = req.files.map((f) => f.path);
      movie.posters = uploadedPosters;
    }

    await movie.save();
    res.json({ success: true, message: "Movie updated successfully", movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Add Show ----------------
export const addShow = async (req, res) => {
  try {
    const { title, showTimings } = req.body;

    if (!title)
      return res.status(400).json({ success: false, message: "Movie ID is required" });

    const shows = typeof showTimings === "string" ? JSON.parse(showTimings) : showTimings;

    const movie = await Movie.findById(title);
    if (!movie)
      return res.status(404).json({ success: false, message: "Movie not found" });

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








// ✅ Update collector access (allow or deny)
export const updateCollectorAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { access } = req.body;

    if (!["allowed", "denied"].includes(access)) {
      return res.status(400).json({ success: false, message: "Invalid access type" });
    }

    const collector = await auth.findByIdAndUpdate(id, { access }, { new: true });
    if (!collector)
      return res.status(404).json({ success: false, message: "Collector not found" });

    res.status(200).json({ success: true, message: `Collector access set to ${access}`, collector });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete collector
export const deleteCollector = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await auth.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ success: false, message: "Collector not found" });

    res.status(200).json({ success: true, message: "Collector deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};