import express from "express";
import {
  placeSnackOrder,
  getAllSnackOrders,
  getSnacksByBookingId,
  updateSnackPaymentStatus,
} from "../controller/snackOrderController.js";

const orderRouter = express.Router();

// Create new order
orderRouter.post("/placeorder", placeSnackOrder);

// Admin: get all orders
orderRouter.get("/all", getAllSnackOrders);

// Get snacks by bookingId
orderRouter.get("/get/:bookingid", getSnacksByBookingId);

// Update payment status
orderRouter.put("/updatepayment/:bookingid", updateSnackPaymentStatus);

export default orderRouter;
