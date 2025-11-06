import SnackOrder from "../Models/snackOrderModel.js";


export const placeSnackOrder = async (req, res) => {
  try {
    const { userName, userEmail, bookingId, items, totalAmount } = req.body;

    if (!userName || !userEmail || !bookingId || !items?.length)
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });

    const order = new SnackOrder({
      userName,
      userEmail,
      bookingId,
      items,
      totalAmount,
    });

    await order.save();
    res
      .status(201)
      .json({ success: true, message: "Snack order placed successfully!", order });
  } catch (error) {
    console.error("Error placing snack order:", error);
    res
      .status(500)
      .json({ success: false, message: "Error placing order", error: error.message });
  }
};


// ✅ Get all snack orders (for admin)
export const getAllSnackOrders = async (req, res) => {
  try {
    const orders = await SnackOrder.find()
      .populate("items.snackId", "name category image") // optional
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};






// payment for snacks

// ✅ 1️⃣ Get snack orders by bookingId
export const getSnacksByBookingId = async (req, res) => {
  try {
    const { bookingid } = req.params;

    if (!bookingid)
      return res.status(400).json({ success: false, message: "Booking ID is required" });

    const orders = await SnackOrder.find({ bookingId: bookingid });

    if (!orders || orders.length === 0)
      return res.status(404).json({ success: false, message: "No snack orders found for this booking" });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching snacks by bookingId:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ 2️⃣ Update payment status from pending → paid
export const updateSnackPaymentStatus = async (req, res) => {
  try {
    const { bookingid } = req.params;
    const { collectorType, collectorId } = req.body; // ✅ get from frontend

    if (!bookingid)
      return res.status(400).json({ success: false, message: "Booking ID is required" });

    const updatedOrder = await SnackOrder.findOneAndUpdate(
      { bookingId: bookingid },
      {
        paymentStatus: "paid",
        collectorType: collectorType || "", // set collector type
        collectorId: collectorId || "",     // set collector id
      },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ success: false, message: "Snack order not found" });

    res.status(200).json({
      success: true,
      message: "Payment status updated to paid with collector info",
      updatedOrder,
    });
  } catch (err) {
    console.error("Error updating snack payment status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

