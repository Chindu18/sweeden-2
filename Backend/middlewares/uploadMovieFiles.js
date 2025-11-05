import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dfom7glyl",
  api_key: process.env.api_key,
  api_secret: process.env.api_pass,
});

// 🎬 Movies
const movieStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === "photos") {
      return {
        folder: "movies/posters",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      };
    }
    if (file.fieldname === "trailer") {
      return {
        folder: "movies/trailers",
        resource_type: "video",
        allowed_formats: ["mp4", "mov", "avi"],
      };
    }
  },
});
export const uploadMovieFiles = multer({ storage: movieStorage }).fields([
  { name: "photos", maxCount: 3 },
  { name: "trailer", maxCount: 1 },
]);

// 🍿 Snacks
const snackStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "snacks",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
export const uploadSnackImage = multer({ storage: snackStorage }).single("img");
