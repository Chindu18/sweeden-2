
// "use client";
// import { useState, useEffect } from "react";
// import { AddMovieForm } from "@/components/addMovie/AddMovieForm";
// import axios from "axios";
// import SeatBlocker from "@/components/SeatBlocker"; // ✅ create this new component file

// interface Movie {
//   _id: string;
//   title: string;
//   cast: { actor: string; actress: string };
//   posters: string[];
// }

// const Movies = () => {
//   const backend_url = "http://localhost:8004";
//   const [activeMovieForm, setActiveMovieForm] = useState<number | null>(null);
//   const [showSeatBlocker, setShowSeatBlocker] = useState(false); // ✅ new state

//   const [movie1, setMovie1] = useState<Movie | null>(null);
//   const [movie2, setMovie2] = useState<Movie | null>(null);
//   const [movie3, setMovie3] = useState<Movie | null>(null);

//   const fetchCurrentMovies = async () => {
//     try {
//       const res = await axios.get(`${backend_url}/movie/currentMovie`);
//       const data = res.data.data[0];
//       if (data) {
//         setMovie1(data.movie1 || null);
//         setMovie2(data.movie2 || null);
//         setMovie3(data.movie3 || null);
//       }
//     } catch (err) {
//       console.error("Failed to fetch movies:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCurrentMovies();
//   }, []);

//   const handleDelete = async (position: number) => {
//     try {
//       const movieToDelete =
//         position === 1 ? movie1 : position === 2 ? movie2 : movie3;
//       if (!movieToDelete) return;
//       await axios.delete(`${backend_url}/movie/${movieToDelete._id}`);
//       fetchCurrentMovies();
//     } catch (err) {
//       console.error("Failed to delete movie:", err);
//     }
//   };

//   const renderAddMovieForm = (position: number, movieData?: Movie) => (
//     <AddMovieForm
//       backendUrl={backend_url}
//       onSaved={() => {
//         setActiveMovieForm(null);
//         fetchCurrentMovies();
//       }}
//       moviePosition={position}
//       movieData={movieData}
//     />
//   );

//   const renderMovieCard = (
//     movie: Movie | null,
//     position: number,
//     colorClass: string
//   ) => (
//     <div className="flex flex-col items-center space-y-2">
//       <div className="relative w-48 h-64 group perspective">
//         {movie ? (
//           <div className="relative w-full h-full transform transition-transform duration-500 group-hover:rotate-y-6">
//             <img
//               src={movie.posters[0]}
//               alt={movie.title}
//               className="w-full h-full object-cover rounded-lg shadow-lg"
//             />
//             <div className="absolute bottom-0 w-full bg-black/60 text-white text-center py-2 font-semibold rounded-b-lg">
//               {movie.title}
//             </div>

//             <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-lg">
//               <button
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold"
//                 onClick={() =>
//                   setActiveMovieForm(activeMovieForm === position ? null : position)
//                 }
//               >
//                 Edit
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold"
//                 onClick={() => handleDelete(position)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ) : (
//           <button
//             className={`${colorClass} text-white px-6 py-4 rounded-lg w-full font-semibold text-lg`}
//             onClick={() =>
//               setActiveMovieForm(activeMovieForm === position ? null : position)
//             }
//           >
//             Screen {position}
//           </button>
//         )}
//       </div>

//       {activeMovieForm === position &&
//         renderAddMovieForm(
//           position,
//           position === 1 ? movie1 : position === 2 ? movie2 : movie3
//         )}
//     </div>
//   );

//   return (
//     <div className="p-8 space-y-8 flex flex-col items-center">
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
//         {renderMovieCard(movie1, 1, "bg-blue-600")}
//         {renderMovieCard(movie2, 2, "bg-green-600")}
//         {renderMovieCard(movie3, 3, "bg-purple-600")}
//       </div>

//       <button
//         onClick={() => setShowSeatBlocker(true)}
//         className="mt-8 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-lg transition duration-300"
//       >
//         Blocked Seats
//       </button>

//       {showSeatBlocker && (
//         <SeatBlocker
//           onClose={() => setShowSeatBlocker(false)}
//           backendUrl={backend_url}
//         />
//       )}
//     </div>
//   );
// };

// export default Movies;

"use client";
import { useState, useEffect } from "react";
import { AddMovieForm } from "@/components/addMovie/AddMovieForm";
import axios from "axios";
import SeatBlocker from "@/components/SeatBlocker";

interface Movie {
  _id: string;
  title: string;
  cast: { actor: string; actress: string };
  posters: string[];
}

const Movies = () => {
  const backend_url = "http://localhost:8004";
  const [activeMovieForm, setActiveMovieForm] = useState<number | null>(null);
  const [showSeatBlocker, setShowSeatBlocker] = useState(false);

  const [movie1, setMovie1] = useState<Movie | null>(null);
  const [movie2, setMovie2] = useState<Movie | null>(null);
  const [movie3, setMovie3] = useState<Movie | null>(null);
  const [movie4, setMovie4] = useState<Movie | null>(null);
  const [movie5, setMovie5] = useState<Movie | null>(null);

  const fetchCurrentMovies = async () => {
    try {
      const res = await axios.get(`${backend_url}/movie/currentMovie`);
      const data = res.data.data[0];
      if (data) {
        setMovie1(data.movie1 || null);
        setMovie2(data.movie2 || null);
        setMovie3(data.movie3 || null);
        setMovie4(data.movie4 || null);
        setMovie5(data.movie5 || null);
      }
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    }
  };

  useEffect(() => {
    fetchCurrentMovies();
  }, []);

  const handleDelete = async (position: number) => {
    try {
      const movieToDelete =
        position === 1
          ? movie1
          : position === 2
          ? movie2
          : position === 3
          ? movie3
          : position === 4
          ? movie4
          : movie5;
      if (!movieToDelete) return;
      await axios.delete(`${backend_url}/movie/${movieToDelete._id}`);
      fetchCurrentMovies();
    } catch (err) {
      console.error("Failed to delete movie:", err);
    }
  };

  const renderAddMovieForm = (position: number, movieData?: Movie) => (
    <AddMovieForm
      backendUrl={backend_url}
      onSaved={() => {
        setActiveMovieForm(null);
        fetchCurrentMovies();
      }}
      moviePosition={position}
      movieData={movieData}
    />
  );

  const renderMovieRow = (
    movie: Movie | null,
    position: number,
    colorClass: string
  ) => (
    <div
      key={position}
      className="w-full flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#000] rounded-2xl p-6 shadow-xl border border-gray-800 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all duration-300"
    >
      {/* 🎞️ Poster (Left side) */}
      <div className="w-full md:w-[350px] h-[220px] overflow-hidden rounded-xl shadow-lg">
        {movie ? (
          <img
            src={movie.posters[0]}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <button
            className={`${colorClass} w-full h-full text-white text-xl font-semibold rounded-xl flex items-center justify-center`}
            onClick={() =>
              setActiveMovieForm(activeMovieForm === position ? null : position)
            }
          >
            + Screen {position}
          </button>
        )}
      </div>

      {/* 🎬 Movie Details (Right side) */}
      <div className="flex flex-col flex-1 text-center md:text-left space-y-3">
        <h2 className="text-3xl font-bold text-white tracking-wide">
          {movie ? movie.title : `Add Movie for Screen ${position}`}
        </h2>

        {movie && (
          <div className="text-gray-300 text-sm sm:text-base leading-relaxed">
            <b>Actor:</b> {movie.cast.actor} <br />
            <b>Actress:</b> {movie.cast.actress}
          </div>
        )}

        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
          {movie ? (
            <>
              <button
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                onClick={() =>
                  setActiveMovieForm(activeMovieForm === position ? null : position)
                }
              >
                 Edit
              </button>
              <button
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                onClick={() => handleDelete(position)}
              >
                 Delete
              </button>
            </>
          ) : (
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              onClick={() =>
                setActiveMovieForm(activeMovieForm === position ? null : position)
              }
            >
              Add Movie
            </button>
          )}
        </div>

        {/* Form (Below buttons) */}
        {activeMovieForm === position &&
          renderAddMovieForm(
            position,
            position === 1
              ? movie1
              : position === 2
              ? movie2
              : position === 3
              ? movie3
              : position === 4
              ? movie4
              : movie5
          )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 sm:px-8 md:px-12 lg:px-20 py-10 bg-gradient-to-w from-[#000000] via-[#0a0a0a] to-[#1a1a1a] flex flex-col items-center space-y-10">
      
       <button
        onClick={() => setShowSeatBlocker(true)}
        className="mt-8 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow-lg text-lg sm:text-xl transition-all duration-300"
      >
         Manage Blocked Seats
      </button>
      <div className="flex flex-col w-full max-w-6xl space-y-8">
        {renderMovieRow(movie1, 1, "bg-gradient-to-r from-blue-600 to-cyan-500")}
        {renderMovieRow(movie2, 2, "bg-gradient-to-r from-green-600 to-lime-500")}
        {renderMovieRow(movie3, 3, "bg-gradient-to-r from-purple-600 to-pink-500")}
        {renderMovieRow(movie4, 4, "bg-gradient-to-r from-orange-600 to-yellow-500")}
        {renderMovieRow(movie5, 5, "bg-gradient-to-r from-pink-600 to-rose-500")}
      </div>

      

      {showSeatBlocker && (
        <SeatBlocker
          onClose={() => setShowSeatBlocker(false)}
          backendUrl={backend_url}
        />
      )}
    </div>
  );
};

export default Movies;
