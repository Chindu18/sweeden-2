import express from "express";
import { uploadSnackImage } from "../middlewares/uploadMovieFiles.js"; // ✅ named import
import {
  getSnacks,
  addSnack,
  updateSnack,
  deleteSnack,
} from "../controller/snackController.js";

const snackrouter = express.Router();

snackrouter.get("/getsnack", getSnacks);
snackrouter.post("/addsnack", uploadSnackImage, addSnack);
snackrouter.put("/updatesnack/:id", uploadSnackImage, updateSnack);
snackrouter.delete("/deletesnack/:id", deleteSnack);

export default snackrouter;
