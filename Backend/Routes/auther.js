import Booking from "../Models/Booking.js";
import auth from "../Models/users.js"

// Get summary per collector

// Example: GET /api/collector/:collectorId?movieName=MovieA
export const getCollectorSummary = async (req, res) => {
  try {
    const { collectorId } = req.params;
    const { movieName } = req.query;

    if (!collectorId) return res.status(400).json({ success: false, message: "Collector ID is required" });

    const matchObj = { collectorId, paymentStatus: "paid" };
    if (movieName) matchObj.movieName = movieName;

    const stats = await Booking.aggregate([
      { $match: matchObj },
      {
        $group: {
          _id: { movieName: "$movieName", date: "$date" },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      {
        $project: { _id: 0, movieName: "$_id.movieName", date: "$_id.date", totalAmount: 1 },
      },
      { $sort: { date: 1 } },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get all collectors and total count
export const getCollectors = async (req, res) => {
  try {
    // Fetch all collectors
    const collectors = await auth.find({ collectorType: { $exists: true } });

    // Total collectors
    const totalCollectors = collectors.length;

    res.status(200).json({
      success: true,
      totalCollectors,
      collectors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};