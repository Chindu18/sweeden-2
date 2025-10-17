"use client";

import { useState, useEffect } from "react";
import { IndianRupee, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

// ---------------- Interfaces ----------------
interface Cast {
  actor: string;
  actress: string;
  villan: string;
  supporting: string;
}

interface Crew {
  director: string;
  producer: string;
  musicDirector: string;
  cinematographer: string;
}

interface ShowPrices {
  adult: string;
  kids: string;
}

interface Show {
  date: string;
  time: string;
  prices: {
    online: ShowPrices;
    videoSpeed: ShowPrices;
    others: ShowPrices; // ✅ renamed from soder
  };
}


interface Movie {
  _id: string;
  title: string;
  cast: Cast;
  crew: Crew;
  posters: string[];
  shows: Show[];
}

// ---------------- Helpers ----------------
const formatTime = (timeString: string) => {
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(Number(hour), Number(minute));
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

const formatDate = (dateString: string) => {
  const options = { weekday: "short", day: "numeric", month: "short" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// ---------------- SeatBlocker Modal ----------------
interface SeatBlockerProps {
  show: Show;
  movieName: string;
  blockedSeats: number[];
  onClose: () => void;
  onSave: (seats: number[]) => void;
}

const SeatBlocker: React.FC<SeatBlockerProps> = ({ show, movieName, blockedSeats, onClose, onSave }) => {
  const seatLayoutSets = [
    [19, 19, 21, 21, 21, 21, 21, 21],
    [19, 19, 19, 19, 19, 19, 19, 19, 19],
    [7],
  ];

  const [selectedSeats, setSelectedSeats] = useState<number[]>(blockedSeats);
  let currentSeatNumber = 1;

  const toggleSeat = (seat: number) => {
    setSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  const getSeatColor = (seat: number) =>
    selectedSeats.includes(seat) ? "bg-red-600" : "bg-green-600";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-3xl relative max-h-[90vh] overflow-auto">
        <button className="absolute top-2 right-2" onClick={onClose}><X /></button>
        <h2 className="text-xl font-bold mb-4">Block Seats - {movieName} ({show.date} {show.time})</h2>

        <div className="overflow-x-auto w-full">
          <div className="inline-block min-w-max px-1 sm:px-2 space-y-2">
            {seatLayoutSets.map((set, setIndex) => {
              const maxCols = Math.max(...set);
              const previousRows = seatLayoutSets
                .slice(0, setIndex)
                .reduce((acc, prevSet) => acc + prevSet.length, 0);

              return set.map((cols, rowIndex) => {
                const rowLetter = String.fromCharCode(65 + previousRows + rowIndex);

                return (
                  <div key={`set${setIndex}-${rowIndex}`} className="flex justify-center items-center gap-2 mb-2">
                    <span className="w-6 text-right font-bold">{rowLetter}</span>
                    {Array.from({ length: maxCols }, (_, seatIndex) => {
                      if (seatIndex < Math.floor((maxCols - cols) / 2) || seatIndex >= Math.floor((maxCols - cols) / 2) + cols) {
                        return <div key={`empty-${seatIndex}`} className="w-6 h-6" />;
                      }
                      const seatNumber = currentSeatNumber++;
                      return (
                        <button
                          key={seatNumber}
                          onClick={() => toggleSeat(seatNumber)}
                          className={`w-6 h-6 rounded ${getSeatColor(seatNumber)} text-white text-xs`}
                        >
                          {seatNumber}
                        </button>
                      );
                    })}
                    <span className="w-6 text-left font-bold">{rowLetter}</span>
                  </div>
                );
              });
            })}
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <div>
            <strong>Selected Seats:</strong> {selectedSeats.join(", ") || "None"}
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => onSave(selectedSeats)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------- Movies Component ----------------
const Movies = () => {
  const backend_url = "https://swedenn-backend.onrender.com";
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [modalMovie, setModalMovie] = useState<Movie | null>(null);
  const [showSeatBlocker, setShowSeatBlocker] = useState<{ show: Show; movie: Movie } | null>(null);
  const [loading, setLoading] = useState(false);

  const [trailerPreview, setTrailerPreview] = useState<string | null>(null);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  const [posterPreviews, setPosterPreviews] = useState<string[]>([]);

  const initialFormData: Omit<Movie, "_id"> & { posters: File[] } = {
    title: "",
    cast: { actor: "", actress: "", villan: "", supporting: "" },
    crew: { director: "", producer: "", musicDirector: "", cinematographer: "" },
    posters: [],
    shows: [],
  };
  const [formData, setFormData] = useState(initialFormData);

  // ---------------- Fetch Movies ----------------
  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${backend_url}/movie/getmovie`);
      setMovies(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // ---------------- Form Handlers ----------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: keyof Omit<Movie, "_id" | "title" | "posters" | "shows">,
    key?: string
  ) => {
    const { value, name } = e.target;
    if (section && key) {
      setFormData({ ...formData, [section]: { ...formData[section], [key]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    setFormData({ ...formData, posters: files });
    setPosterPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleTrailerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTrailerFile(file);
      setTrailerPreview(URL.createObjectURL(file));
    }
  };

 const addShow = () => {
  setFormData({
    ...formData,
    shows: [
      ...formData.shows,
      {
        date: "",
        time: "",
        prices: {
          online: { adult: "", kids: "" },
          videoSpeed: { adult: "", kids: "" },
          others: { adult: "", kids: "" }, // ✅ renamed
        },
      },
    ],
  });
};


  const handleShowChange = (
    index: number,
    field: "date" | "time" | "prices",
    method: keyof Show["prices"] | null,
    type: keyof ShowPrices | null,
    value: string
  ) => {
    const shows = [...formData.shows];
    if (field === "time") shows[index].time = value;
    else if (field === "date") shows[index].date = value;
    else if (field === "prices" && method && type) {
      if (/\D/.test(value)) return;
      shows[index].prices[method][type] = value;
    }
    setFormData({ ...formData, shows });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trailerFile) return alert("Please upload a trailer!");
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("hero", formData.cast.actor);
      data.append("heroine", formData.cast.actress);
      data.append("villain", formData.cast.villan);
      data.append("supportArtists", formData.cast.supporting);
      data.append("director", formData.crew.director);
      data.append("producer", formData.crew.producer);
      data.append("musicDirector", formData.crew.musicDirector);
      data.append("cinematographer", formData.crew.cinematographer);
      data.append("showTimings", JSON.stringify(formData.shows));
      formData.posters.forEach(file => data.append("photos", file));
      data.append("trailer", trailerFile);

      await axios.post(`${backend_url}/api/addDetails`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Movie saved successfully!");
      setFormData(initialFormData);
      setPosterPreviews([]);
      setTrailerFile(null);
      setTrailerPreview(null);
      fetchMovies();
    } catch (err: any) {
      console.error(err);
      alert("Failed to save movie.");
    } finally {
      setLoading(false);
    }
  };

  const getPosterSrc = (poster: File | string) =>
    poster instanceof File ? URL.createObjectURL(poster) : poster;

  // ---------------- Open SeatBlocker ----------------
  const handleOpenSeatBlocker = (movie: Movie, show: Show) => {
    setShowSeatBlocker({ movie, show });
  };

  // ---------------- Independent Seat Blocker State ----------------
// ---------------- Independent Seat Blocker State ----------------
const [independentSeats, setIndependentSeats] = useState<number[]>([]);

// ✅ Fetch currently blocked seats from backend
const getBlock = async () => {
  try {
    const res = await axios.get(`${backend_url}/seats/blocked`);
    const doc = res.data.data[0]; // since only one doc is used now
    setIndependentSeats(doc?.blockedseats || []);
  } catch (error) {
    console.error("Error fetching blocked seats:", error);
  }
};

useEffect(() => {
  getBlock();
}, []);

// ✅ Block seats
const blocksave = async (seats: number[]) => {
  try {
    if (!seats || seats.length === 0) return alert("No seats selected to block!");

    const res = await axios.post(`${backend_url}/seats/block`, {
      blockedseats: seats,
    });

    if (res.status === 200) {
      alert("Seats blocked successfully!");
      await getBlock(); // refresh state after saving
    }
  } catch (error: any) {
    console.error("Error blocking seats:", error);
    alert(error.response?.data?.message || "Failed to block seats.");
  }
};

// ✅ Unblock seats
const unblockSeat = async (seatToUnblock: number) => {
  try {
    const res = await axios.put(`${backend_url}/seats/unblock`, {
      seatNumber: seatToUnblock,
    });

    if (res.status === 200) {
      alert(`Seat ${seatToUnblock} unblocked successfully!`);
      await getBlock(); // refresh state after unblocking
    }
  } catch (error) {
    console.error("Failed to unblock seat:", error);
  }
};






  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold mb-4">Movies Collection</h1>

      {/* ---------------- Buttons ---------------- */}
      <div className="flex gap-4 mb-4 items-center">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add Movie"}
        </button>
        {showForm && (
  <form className="mb-6 max-w-3xl p-6 border rounded shadow space-y-4" onSubmit={handleSubmit}>
    <input
      type="text"
      name="title"
      placeholder="Movie Title"
      value={formData.title}
      onChange={handleChange}
      required
      className="border p-2 w-full rounded"
    />

    {/* Cast */}
    <div>
      <label className="font-semibold">Cast:</label>
      {Object.keys(formData.cast).map(role => (
        <input
          key={role}
          type="text"
          placeholder={role.charAt(0).toUpperCase() + role.slice(1)}
          value={formData.cast[role as keyof Cast]}
          onChange={e => handleChange(e, "cast", role)}
          required
          className="border p-2 w-full rounded mb-2"
        />
      ))}
    </div>

    {/* Crew */}
    <div>
      <label className="font-semibold">Crew:</label>
      {Object.keys(formData.crew).map(role => (
        <input
          key={role}
          type="text"
          placeholder={role.replace(/([A-Z])/g, " $1")}
          value={formData.crew[role as keyof Crew]}
          onChange={e => handleChange(e, "crew", role)}
          required
          className="border p-2 w-full rounded mb-2"
        />
      ))}
    </div>

    {/* Posters */}
    <div>
      <label className="font-semibold">Posters (3 max):</label>
      <input type="file" multiple accept="image/*" onChange={handlePosterUpload} required />
      <div className="flex gap-2 mt-2">
        {posterPreviews.map((src, idx) => (
          <img key={idx} src={src} alt={`Poster ${idx + 1}`} className="w-24 h-24 object-cover border rounded" />
        ))}
      </div>
    </div>

    {/* Trailer */}
    <div>
      <label className="font-semibold">Trailer:</label>
      <input type="file" accept="video/*" onChange={handleTrailerUpload} required />
      {trailerPreview && (
        <div className="mt-2">
          <video src={trailerPreview} controls className="w-full max-w-md border rounded" />
        </div>
      )}
    </div>

    {/* Shows */}
    <div>
      <label className="font-semibold">Shows:</label>
      {formData.shows.map((show, idx) => (
        <div key={idx} className="border p-3 rounded mb-3 space-y-2">
          <input
            type="date"
            value={show.date}
            onChange={e => handleShowChange(idx, "date", null, null, e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
          <input
            type="time"
            value={show.time}
            onChange={e => handleShowChange(idx, "time", null, null, e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
          <div className="grid grid-cols-3 gap-2">
            {(["online", "videoSpeed", "others"] as const).map(method => (
  <div key={method} className="border p-2 rounded space-y-1">
    <p className="font-medium">{method}</p>
    <input
      type="text"
      placeholder="Adult Price"
      value={show.prices[method].adult}
      onChange={e => handleShowChange(idx, "prices", method, "adult", e.target.value)}
      className="border p-1 w-full rounded"
      required
    />
    <input
      type="text"
      placeholder="Kids Price"
      value={show.prices[method].kids}
      onChange={e => handleShowChange(idx, "prices", method, "kids", e.target.value)}
      className="border p-1 w-full rounded"
      required
    />
  </div>
))}

          </div>
        </div>
      ))}
      <button type="button" className="bg-gray-300 text-black px-2 py-1 rounded" onClick={addShow}>
        + Add Show
      </button>
    </div>

    <button
      type="submit"
      className="bg-green-600 text-white px-4 py-2 rounded mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
      disabled={loading}
    >
      {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
      {loading ? "Saving..." : "Save Movie"}
    </button>
  </form>
)}


        {/* Independent Seat Blocker Button */}
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() =>{
           
            setShowSeatBlocker({
              movie: {
                _id: "independent",
                title: "Independent Seat Blocker",
                cast: { actor: "", actress: "", villan: "", supporting: "" },
                crew: { director: "", producer: "", musicDirector: "", cinematographer: "" },
                posters: [],
                shows: [
                  {
                    date: "Today",
                    time: "Now",
                    prices: { online: { adult: "", kids: "" }, videoSpeed: { adult: "", kids: "" }, soder: { adult: "", kids: "" } },
                  },
                ],
              },
              show: {
                date: "Today",
                time: "Now",
                prices: { online: { adult: "", kids: "" }, videoSpeed: { adult: "", kids: "" }, soder: { adult: "", kids: "" } },
              },
            })
          }}
        >
          Seat Blocker
        </button>

        {independentSeats.length > 0 && (
          <span className="ml-4 font-semibold">
            Selected Seats: {independentSeats.join(", ")}
          </span>
        )}
      </div>

      {/* ---------------- Add Movie Form ---------------- */}
      {showForm && (
        <form className="mb-6 max-w-3xl p-6 border rounded shadow space-y-4" onSubmit={handleSubmit}>
          {/* ... your existing form inputs ... */}
        </form>
      )}

      {/* ---------------- Movie Cards ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.slice(-5).reverse().map(movie => (
          <Card key={movie._id} className="cursor-pointer hover:shadow-lg" onClick={() => setModalMovie(movie)}>
            <img src={getPosterSrc(movie.posters[0])} alt={movie.title} className="w-full h-64 object-cover" />
            <CardContent className="flex justify-between p-3">
              <span>{movie.title}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ---------------- Movie Modal ---------------- */}
      {modalMovie && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-3/4 max-w-xl relative overflow-auto max-h-[90vh]">
            <button className="absolute top-2 right-2" onClick={() => setModalMovie(null)}>
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4">{modalMovie.title}</h2>
            <p className="mb-2"><strong>Cast:</strong> {Object.values(modalMovie.cast).join(", ")}</p>
            <p className="mb-2"><strong>Crew:</strong> {Object.values(modalMovie.crew).join(", ")}</p>
            <p className="mb-2"><strong>Shows:</strong></p>
            {modalMovie.shows.map((show, idx) => (
              <div key={idx} className="flex justify-between items-center mb-2 border p-2 rounded">
                <span>{formatDate(show.date)} - {formatTime(show.time)}</span>
               
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- SeatBlocker Modal ---------------- */}
      {showSeatBlocker && (
        <SeatBlocker
          show={showSeatBlocker.show}
          movieName={showSeatBlocker.movie.title}
          blockedSeats={showSeatBlocker.movie._id === "independent" ? independentSeats : []}
onSave={async (seats) => {
  if (showSeatBlocker.movie._id === "independent") {
    const removedSeats = independentSeats.filter(seat => !seats.includes(seat));
    const addedSeats = seats.filter(seat => !independentSeats.includes(seat));

    // Unblock removed seats
    for (const seat of removedSeats) {
      await unblockSeat(seat);
    }

    // Block new seats
    if (addedSeats.length > 0) {
      await blocksave(addedSeats);
    }

    // Refresh from backend
    await getBlock();
    setShowSeatBlocker(null);
  } else {
    console.log("Blocked seats for movie show:", seats);
  }
}}



          onClose={() => setShowSeatBlocker(null)}
        />
      )}
    </div>
  );
};

export default Movies;
