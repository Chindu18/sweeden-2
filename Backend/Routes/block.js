import express from "express";
import Blockedseats from "../Models/blocked.js";

const blockRouter = express.Router();

/* ---------------------- POST /block ---------------------- */
blockRouter.post("/block", async (req, res) => {
  try {
    const { blockedseats } = req.body;

    if (!blockedseats || !Array.isArray(blockedseats) || blockedseats.length === 0) {
      return res.status(400).json({ message: "Blocked seats are required" });
    }

    let blockDoc = await Blockedseats.findOne();

    if (!blockDoc) {
      blockDoc = new Blockedseats({ blockedseats });
    } else {
      // Merge existing + new seats, remove duplicates
      const merged = Array.from(new Set([...blockDoc.blockedseats, ...blockedseats]));
      blockDoc.blockedseats = merged;
    }

    await blockDoc.save();
    res.status(200).json({ success: true, message: "Seats blocked successfully", data: blockDoc });
  } catch (err) {
    console.error("Error blocking seats:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

/* ---------------------- GET /blocked ---------------------- */
blockRouter.get("/blocked", async (req, res) => {
  try {
    let blockDoc = await Blockedseats.findOne();
    if (!blockDoc) blockDoc = { blockedseats: [] };

    res.status(200).json({ success: true, blockedseats: blockDoc.blockedseats });
  } catch (err) {
    console.error("Error fetching blocked seats:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

/* ---------------------- PUT /unblock ---------------------- */
blockRouter.put("/unblock", async (req, res) => {
  try {
    const { seatNumbers } = req.body; // ✅ expect array

    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ message: "seatNumbers must be a non-empty array" });
    }

    const blockDoc = await Blockedseats.findOne();
    if (!blockDoc) return res.status(404).json({ message: "No blocked seats found" });

    // Remove all given seats
    blockDoc.blockedseats = blockDoc.blockedseats.filter(
      (seat) => !seatNumbers.includes(seat)
    );

    await blockDoc.save();
    res.status(200).json({ success: true, message: "Seats unblocked successfully", data: blockDoc });
  } catch (err) {
    console.error("Error unblocking seats:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

export default blockRouter;
