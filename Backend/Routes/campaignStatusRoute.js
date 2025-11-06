import express from "express";
import CampaignStatus from "../Models/CampaignStatus.js";

const Campaignrouter = express.Router();

// GET current status
Campaignrouter.get("/status", async (req, res) => {
  try {
    let statusDoc = await CampaignStatus.findOne();
    if (!statusDoc) {
      statusDoc = new CampaignStatus(); // default false
      await statusDoc.save();
    }
    res.status(200).json({ notifyLeads: statusDoc.notifyLeads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch campaign status" });
  }
});

// PUT update status
Campaignrouter.put("/update", async (req, res) => {
  try {
    const { notifyLeads } = req.body;

    let statusDoc = await CampaignStatus.findOne();
    if (!statusDoc) {
      statusDoc = new CampaignStatus({ notifyLeads });
    } else {
      statusDoc.notifyLeads = notifyLeads;
    }

    await statusDoc.save();
    res.status(200).json({ success: true, notifyLeads: statusDoc.notifyLeads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update campaign status" });
  }
});

export default Campaignrouter;
