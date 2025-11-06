import Snack from "../Models/snackModel.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// ☁️ Cloudinary Config
cloudinary.config({
  cloud_name: "dfom7glyl",
  api_key: process.env.api_key,
  api_secret: process.env.api_pass,
});

// 🍿 Snack Upload Setup
const snackStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "snacks",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export const uploadSnackImage = multer({ storage: snackStorage }).single("img");


// 📦 Get all snacks
export const getSnacks = async (req, res) => {
  try {
    const snacks = await Snack.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, snacks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching snacks", error: error.message });
  }
};

// 🍿 Add new snack
export const addSnack = async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const img = req.file?.path || req.body.img;

    if (!name || !price || !category || !img) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSnack = new Snack({ name, price, category, img });
    await newSnack.save();

    res.status(201).json({
      success: true,
      message: "Snack added successfully!",
      snack: newSnack,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding snack", error: error.message });
  }
};

// ✏️ Update snack
export const updateSnack = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;
    const img = req.file?.path || req.body.img;

    const snack = await Snack.findById(id);
    if (!snack) return res.status(404).json({ message: "Snack not found" });

    snack.name = name || snack.name;
    snack.price = price ?? snack.price;
    snack.category = category || snack.category;
    snack.img = img || snack.img;

    const updated = await snack.save();
    res.json({
      success: true,
      message: "Snack updated successfully!",
      snack: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating snack", error: error.message });
  }
};

// 🗑 Delete snack
export const deleteSnack = async (req, res) => {
  try {
    const snack = await Snack.findByIdAndDelete(req.params.id);
    if (!snack) return res.status(404).json({ message: "Snack not found" });
    res.json({ success: true, message: "Snack deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting snack", error: error.message });
  }
};
