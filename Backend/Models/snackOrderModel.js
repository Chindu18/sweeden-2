import mongoose from "mongoose";

const snackOrderSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    bookingId: { type: String, required: true, trim: true },
    items: [
      {
        snackId: { type: mongoose.Schema.Types.ObjectId, ref: "Snack", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        lineTotal: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    collectorType: { type: String, default: "" },
    collectorId: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("SnackOrder", snackOrderSchema);
