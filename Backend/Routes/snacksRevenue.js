import express from "express";
import {
  getTotalRevenue,
  getRevenueByCollector,
} from "../controller/snackRevenueController.js"; // import your controller

const snackRevenuerouter = express.Router();

// Route 1: Total revenue
snackRevenuerouter.get("/total-revenue", getTotalRevenue);

// Route 2: Revenue by collector
// Optional query param: ?collectorId=12345
snackRevenuerouter.get("/revenue", getRevenueByCollector);

export default snackRevenuerouter;
