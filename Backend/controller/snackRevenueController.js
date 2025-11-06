import SnackOrder from "../Models/snackOrderModel.js";

// Get total revenue
export const getTotalRevenue = async (req, res) => {
  try {
    const result = await SnackOrder.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;

    res.status(200).json({ success: true, totalRevenue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get revenue per collector
export const getRevenueByCollector = async (req, res) => {
  try {
    const { collectorId } = req.query; // pass collectorId as query param

    const matchStage = collectorId ? { collectorId } : {}; // filter if collectorId is provided

    const result = await SnackOrder.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$collectorId",
          collectorRevenue: { $sum: "$totalAmount" },
          orders: { $push: "$$ROOT" }, // optional: include all orders for this collector
        },
      },
    ]);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
