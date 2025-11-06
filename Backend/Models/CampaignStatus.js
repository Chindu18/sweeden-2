import mongoose from "mongoose";

const campaignStatusSchema = new mongoose.Schema(
  {
    notifyLeads: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("CampaignStatus", campaignStatusSchema);
