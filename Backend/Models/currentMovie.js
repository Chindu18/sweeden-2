// import mongoose from "mongoose";
// const currentMovieSchema = new mongoose.Schema({
//   movie1: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
//   movie2: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
//   movie3: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
// }, { timestamps: true });

// export default mongoose.model("MovieGroup", currentMovieSchema);



import mongoose from "mongoose";

const currentMovieSchema = new mongoose.Schema(
  {
    movie1: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie2: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie3: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie4: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie5: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  },
  { timestamps: true }
);

export default mongoose.model("MovieGroup", currentMovieSchema);
