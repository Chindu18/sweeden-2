import Booking from "../Models/Booking.js";
import Collector from "../Models/Collector.js";

export const getCollectors = async (req, res) => {
  try {
    const collectors = await Collector.find().select("name description");
    res.status(200).json({ collectors }); // frontend expects this key
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch collectors" });
  }
};
// ✅ Add a new collector
export const addCollector = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: "Collector name required" });

    const exists = await Collector.findOne({ name });
    if (exists) return res.status(400).json({ message: "Collector already exists" });

    const newCollector = await Collector.create({ name, description });
    res.status(201).json({ message: "Collector added", collector: newCollector });
  } catch (error) {
    res.status(500).json({ message: "Error adding collector" });
  }
};

// ✏️ Update collector
export const updateCollector = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const collector = await Collector.findById(id);
    if (!collector) return res.status(404).json({ message: "Collector not found" });

    // Update fields
    collector.name = name || collector.name;
    collector.description = description || collector.description;

    await collector.save();
    res.status(200).json({ message: "Collector updated", collector });
  } catch (error) {
    res.status(500).json({ message: "Error updating collector" });
  }
};

// ❌ Delete collector
export const deleteCollector = async (req, res) => {
  try {
    const { id } = req.params;

    const collector = await Collector.findByIdAndDelete(id);
    if (!collector) return res.status(404).json({ message: "Collector not found" });

    res.status(200).json({ message: "Collector deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting collector" });
  }
};


import Movie from "../Models/Movies.js";


export const changecollector = async (req, res) => {
  try {
    let { bookingid, collector } = req.body;

    // ✅ 1️⃣ Validate input
    if (!bookingid || !collector) {
      return res.status(400).json({ message: "Booking ID and collector are required" });
    }

    collector = collector.trim().toLowerCase();
    if (collector === "video" || collector === "videospeed") collector = "videoSpeed"; // normalize

    // ✅ 2️⃣ Fetch booking
    const booking = await Booking.findOne({ bookingId: bookingid });
    if (!booking) {
      return res.status(404).json({ message: `Booking with ID "${bookingid}" not found` });
    }

    const previousCollector = booking.collectorType || "N/A";

    // ✅ 3️⃣ Fetch movie strictly by movieId
    if (!booking.movieId) {
      return res.status(404).json({ message: "Movie ID missing in booking" });
    }

    const movie = await Movie.findById(booking.movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found for this booking" });
    }

    // ✅ 4️⃣ Find the correct show
    const show = movie.shows?.find(
      (s) =>
        new Date(s.date).toDateString() === new Date(booking.date).toDateString() &&
        s.time === booking.timing
    );

    if (!show) {
      return res.status(404).json({ message: "Show not found for this booking" });
    }

    // ✅ 5️⃣ Determine prices
    let adultPrice = 0;
    let kidsPrice = 0;
    let collectorType = "";

    if (collector === "online" || collector === "videoSpeed") {
      if (!show.prices?.[collector]) {
        return res.status(400).json({ message: `Price info not found for "${collector}"` });
      }
      adultPrice = show.prices[collector]?.adult || 0;
      kidsPrice = show.prices[collector]?.kids || 0;
      collectorType = collector;
    } else {
      const foundCollector = show.collectors?.find(
        (c) => c.collectorName.toLowerCase() === collector
      );
      if (!foundCollector) {
        return res.status(404).json({ message: `Collector "${collector}" not found in this show` });
      }
      adultPrice = foundCollector.adult || 0;
      kidsPrice = foundCollector.kids || 0;
      collectorType = foundCollector.collectorName;
    }

    // ✅ 6️⃣ Calculate total safely
    const totalAmount =
      (Number(booking.adult) || 0) * adultPrice +
      (Number(booking.kids) || 0) * kidsPrice;

    // ✅ 7️⃣ Update booking
    booking.collectorChangedFrom = previousCollector;
    booking.collectorType = collectorType;
    booking.ticketType = collectorType;
    booking.totalAmount = totalAmount;

    await booking.save();

    // ✅ 8️⃣ Return response
    res.status(200).json({
      message: `Collector changed successfully from "${previousCollector}" to "${collectorType}"`,
      updatedBooking: {
        bookingId: booking.bookingId,
        movieId: booking.movieId,
        date: booking.date,
        time: booking.timing,
        previousCollector,
        collectorType,
        ticketType: booking.ticketType,
        adultPrice,
        kidsPrice,
        totalAmount,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Critical error in changecollector:", error);

    res.status(500).json({
      message: "Failed to change collector due to server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};










export const previewCollectorChange = async (req, res) => {
  try {
    const { bookingid, collector } = req.query; // collector = "online" | "videoSpeed" | custom collector name

    if (!bookingid || !collector) {
      return res
        .status(400)
        .json({ message: "Booking ID and collector are required" });
    }

    // 1️⃣ Find booking
    const booking = await Booking.findOne({ bookingId: bookingid });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // 2️⃣ Find movie by ID if available, fallback to name
    let movie;
    if (booking.movieId) {
      movie = await Movie.findById(booking.movieId);
    } else {
      movie = await Movie.findOne({ title: booking.movieName });
    }

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // 3️⃣ Match show
    const show = movie.shows.find(
      (s) =>
        new Date(s.date).toDateString() === new Date(booking.date).toDateString() &&
        s.time === booking.timing
    );
    if (!show) return res.status(404).json({ message: "Show not found" });

    // 🧩 Fix ticketType mismatches ("video" → "videoSpeed")
    let normalizedType = booking.ticketType?.trim().toLowerCase();
    if (normalizedType === "video") normalizedType = "videospeed";

    // 🧩 Get current collector prices
    let currentAdultPrice = 0;
    let currentKidsPrice = 0;

    if (normalizedType === "online" || normalizedType === "videospeed") {
      const key = normalizedType === "videospeed" ? "videoSpeed" : "online";
      currentAdultPrice = show.prices?.[key]?.adult || 0;
      currentKidsPrice = show.prices?.[key]?.kids || 0;
    } else {
      const currentCollector = show.collectors.find(
        (c) => c.collectorName.toLowerCase() === normalizedType
      );
      if (currentCollector) {
        currentAdultPrice = currentCollector.adult || 0;
        currentKidsPrice = currentCollector.kids || 0;
      }
    }

    // 4️⃣ Determine new collector prices
    let adultPrice = 0;
    let kidsPrice = 0;
    let newCollectorType = "";

    const normalizedCollector = collector?.trim().toLowerCase();
    if (normalizedCollector === "video") {
      adultPrice = show.prices?.videoSpeed?.adult || 0;
      kidsPrice = show.prices?.videoSpeed?.kids || 0;
      newCollectorType = "videoSpeed";
    } else if (normalizedCollector === "videospeed" || normalizedCollector === "online") {
      const key = normalizedCollector === "videospeed" ? "videoSpeed" : "online";
      adultPrice = show.prices?.[key]?.adult || 0;
      kidsPrice = show.prices?.[key]?.kids || 0;
      newCollectorType = key;
    } else {
      const foundCollector = show.collectors.find(
        (c) => c.collectorName.toLowerCase() === normalizedCollector
      );
      if (!foundCollector) {
        return res
          .status(404)
          .json({ message: "Collector not found in this show" });
      }

      adultPrice = foundCollector.adult;
      kidsPrice = foundCollector.kids;
      newCollectorType = foundCollector.collectorName;
    }

    // 5️⃣ Calculate totals
    const currentTotalAmount =
      (booking.adult || 0) * currentAdultPrice + (booking.kids || 0) * currentKidsPrice;
    const newTotalAmount =
      (booking.adult || 0) * adultPrice + (booking.kids || 0) * kidsPrice;

    // 6️⃣ Send preview
    res.status(200).json({
      success: true,
      message: "Preview generated successfully",
      preview: {
        currentTicketType: booking.ticketType,
        currentAdultPrice,
        currentKidsPrice,
        currentTotalAmount,
        newCollectorType,
        newAdultPrice: adultPrice,
        newKidsPrice: kidsPrice,
        newTotalAmount,
      },
    });
  } catch (error) {
    console.error("Error in previewCollectorChange:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

