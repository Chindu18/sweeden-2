import SnackOrder from "../Models/snackOrderModel.js";

// ✅ Place a new snack order
export const placeSnackOrder = async (req, res) => {
  try {
    const { userName, userEmail, items, totalAmount } = req.body;

    if (!userName || !userEmail || !items?.length) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const order = new SnackOrder({
      userName,
      userEmail,
      items,
      totalAmount,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message,
    });
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
