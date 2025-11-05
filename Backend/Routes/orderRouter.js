import express from "express";
import {
  placeSnackOrder,
  getAllSnackOrders,
} from "../controller/snackOrderController.js";

const orderRouter = express.Router();

orderRouter.post("/", placeSnackOrder);
orderRouter.get("/allOrders", getAllSnackOrders);

export default orderRouter;
