// import express from "express";
// import Blockedseats from "../Models/blocked.js";

// const blockRouter = express.Router();

// // POST /block
// blockRouter.post("/block", async (req, res) => {
//   try {
//     const { blockedseats } = req.body;

//     if (!blockedseats || !Array.isArray(blockedseats) || blockedseats.length === 0) {
//       return res.status(400).json({ message: "Blocked seats are required" });
//     }

//     // Check if a document already exists
//     let blockDoc = await Blockedseats.findOne();

//     if (!blockDoc) {
//       // Create new document if none exists
//       blockDoc = new Blockedseats({ blockedseats });
//     } else {
//       // Merge with existing blocked seats, remove duplicates
//       const mergedSeats = Array.from(new Set([...blockDoc.blockedseats, ...blockedseats]));
//       blockDoc.blockedseats = mergedSeats;
//     }

//     await blockDoc.save();

//     res.status(200).json({ message: "Seats blocked successfully", data: blockDoc });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err });
//   }
// });



// // ---------------- GET /blocked ----------------
// // Get all blocked seats
// blockRouter.get("/blocked", async (req, res) => {
//   try {
//     const allBlockedSeats = await Blockedseats.find().sort({ createdAt: -1 }); // latest first
//     res.status(200).json({ data: allBlockedSeats });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err });
//   }
// });

// // PUT /seats/unblock
// blockRouter.put('/unblock', async (req, res) => {
//   const { seatNumber } = req.body;

//   try {
//     // Find all documents that have this seat blocked
//     const result = await Blockedseats.updateMany(
//       { blockedseats: seatNumber },
//       { $pull: { blockedseats: seatNumber } } // remove seat from array
//     );

//     res.json({ success: true, modifiedCount: result.modifiedCount });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });


// export default blockRouter;




import express from "express";
import Blockedseats from "../Models/blocked.js";

const blockRouter = express.Router();

// ---------------- POST /block ----------------
blockRouter.post("/block", async (req, res) => {
  try {
    const { blockedseats } = req.body;

    if (!blockedseats || !Array.isArray(blockedseats) || blockedseats.length === 0) {
      return res.status(400).json({ message: "Blocked seats are required" });
    }

    // Get the single blocked seats document
    let blockDoc = await Blockedseats.findOne();

    if (!blockDoc) {
      blockDoc = new Blockedseats({ blockedseats });
    } else {
      // Merge new seats with existing ones, remove duplicates
      const mergedSeats = Array.from(new Set([...blockDoc.blockedseats, ...blockedseats]));
      blockDoc.blockedseats = mergedSeats;
    }

    await blockDoc.save();

    res.status(200).json({ message: "Seats blocked successfully", data: blockDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ---------------- GET /blocked ----------------
blockRouter.get("/blocked", async (req, res) => {
  try {
    // Always return the single blocked seats document
    let blockDoc = await Blockedseats.findOne();
    if (!blockDoc) blockDoc = { blockedseats: [] };

    res.status(200).json({ data: [blockDoc] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ---------------- PUT /unblock ----------------
blockRouter.put("/unblock", async (req, res) => {
  try {
    const { seatNumber } = req.body;

    if (typeof seatNumber !== "number") {
      return res.status(400).json({ message: "seatNumber must be a number" });
    }

    const blockDoc = await Blockedseats.findOne();
    if (!blockDoc) return res.status(404).json({ message: "No blocked seats found" });

    // Remove seat from array
    blockDoc.blockedseats = blockDoc.blockedseats.filter(seat => seat !== seatNumber);
    await blockDoc.save();

    res.status(200).json({ message: "Seat unblocked successfully", data: blockDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

export default blockRouter;
