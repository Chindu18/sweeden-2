"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moviePosterFallback from "@/assets/movie-poster-1.jpg";

interface Movie {
  _id: string;
  title: string;
  cast: { actor: string; actress: string };
  posters: string[];
}

// 🎟️ Movie Card
const MovieCard = ({ movie }: { movie: Movie }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.title}/${movie._id}`)}
      className="relative bg-gradient-to-r from-[#1b1b1b] to-[#2c2c2c] text-white rounded-[2rem] border-[3px] border-[#ff4b4b]/70 shadow-[0_0_40px_rgba(255,75,75,0.2)] overflow-hidden cursor-pointer transition-transform duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(255,75,75,0.5)]"
    >
      {/* Film holes */}
      <div className="absolute top-0 left-3 bottom-0 flex flex-col justify-between py-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-3 h-3 bg-black rounded-full border border-gray-700"></div>
        ))}
      </div>
      <div className="absolute top-0 right-3 bottom-0 flex flex-col justify-between py-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-3 h-3 bg-black rounded-full border border-gray-700"></div>
        ))}
      </div>

      {/* Poster */}
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={movie.posters[0] || moviePosterFallback}
          alt={movie.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-red-600/80 text-white text-xs px-4 py-1 rounded-full font-semibold tracking-widest">
          🎬 CINEMA PASS
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-500 my-2"></div>

      {/* Info */}
      <div className="px-6 py-4 text-center">
        <h3 className="text-3xl font-extrabold tracking-wide uppercase text-red-400 drop-shadow-[0_0_10px_rgba(255,75,75,0.4)]">
          {movie.title}
        </h3>

        <div className="mt-2 text-gray-300 text-sm">
          <p className="font-semibold">
            Starring:{" "}
            <span className="text-white">{movie.cast.actor}</span> &{" "}
            <span className="text-white">{movie.cast.actress}</span>
          </p>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="border border-red-400 rounded-lg px-6 py-1 text-xs tracking-widest text-red-300">
            🎟️ ADMIT ONE
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-[2rem] ring-1 ring-red-500/20"></div>
    </div>
  );
};

const MainMoviePage = () => {
  const backend_url = "http://localhost:8004";
  const [movies, setMovies] = useState<Movie[]>([]);

  const fetchCurrentMovies = async () => {
    try {
      const res = await axios.get(`${backend_url}/movie/currentMovie`);
      const data = res.data.data[0];
      if (data) {
        // ✅ Collect all available movie slots
        const allMovies = [
          data.movie1,
          data.movie2,
          data.movie3,
          data.movie4,
          data.movie5,
        ].filter(Boolean); // remove undefined/null
        setMovies(allMovies);``
      }
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    }
  };

  useEffect(() => {
    fetchCurrentMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-10">
      <h1 className="text-6xl md:text-8xl text-white font-extrabold text-center mb-16 tracking-wide drop-shadow-[0_0_30px_rgba(255,0,0,0.4)]">
        🎟️ Now Showing
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 justify-center">
        {movies.length > 0 ? (
          movies.map((m) => <MovieCard key={m._id} movie={m} />)
        ) : (
          <p className="text-center text-gray-400 col-span-full">
            No movies currently showing.
          </p>
        )}
      </div>
    </div>
  );
};

export default MainMoviePage;




// import React from 'react'
// import { Footer } from 'react-day-picker'
// import Index from './Index'

// const MainMoviePage = () => {
//   return (
//     <div>
//        <Index/>
//     </div>
//   )
// }

// export default MainMoviePage




