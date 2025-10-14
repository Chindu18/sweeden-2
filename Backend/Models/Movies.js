import mongoose from "mongoose";

const showPricesSchema = new mongoose.Schema({
  adult: { type: Number, default: 0 },
  kids: { type: Number, default: 0 },
});

const showSchema = new mongoose.Schema({
  date: { type: Date, required: true },   // for the date (e.g., 2025-10-09)
  time: { type: String, required: true }, // for the time (e.g., "10:00 AM")

  prices: {
    online: { type: showPricesSchema, default: {},required: true },
    videoSpeed: { type: showPricesSchema, default: {},required: true },
    soder: { type: showPricesSchema, default: {},required: true },
  },
});

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    cast: {
      actor: { type: String, default: "", required: true },
      actress: { type: String, default: "", required: true },
      villan: { type: String, default: "" , required: true},
      supporting: { type: String, default: "" , required: true},
    },
    crew: {
      director: { type: String, default: "", required: true },
      producer: { type: String, default: "", required: true },
      musicDirector: { type: String, default: "" , required: true},
      cinematographer: { type: String, default: "", required: true },
    },
    posters: { type: [String],required: true }, // uploaded images URLs
      trailer: { type: String, required: true },
    shows: { type: [showSchema],required: true}, // store array of shows
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
