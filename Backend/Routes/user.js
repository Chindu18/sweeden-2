import express from "express";
import { addBooking, getBookedSeats, addMovie, uploadMovieFiles } from "../controller/userDetailControl.js";
import { getBookingById } from "../controller/dashBoardController.js";

const userRouter = express.Router();

userRouter.post("/addBooking", addBooking);
userRouter.get("/bookedSeats", getBookedSeats);
userRouter.get("/bookingid/:bookingId", getBookingById);

// Upload posters & trailer then add movie
userRouter.post("/addDetails", uploadMovieFiles, addMovie);

export default userRouter;
