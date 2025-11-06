"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface CollectorType {
  _id: string;
  username: string;
  phone: string;
  email: string;
  address: string;
  collectorType: string;
  collectAmount?: number; // movie collection
  snackAmount?: number;   // snack collection
  access?: string; // allowed | denied | pending
}

interface CollectorStats {
  movieName: string;
  date: string;
  totalAmount: number;
}

interface SnackRevenue {
  _id: string;
  collectorRevenue: number;
}

const CombinedCollectorDashboard = () => {
  const [collectors, setCollectors] = useState<CollectorType[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalSnackRevenue, setTotalSnackRevenue] = useState(0);
  const [snackRevenues, setSnackRevenues] = useState<SnackRevenue[]>([]);

  const backend = "http://localhost:8004";

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${backend}/movie/getmovie`);
        const data = res.data.data || [];
        setMovies(data);
        if (data.length > 0) setSelectedMovie(data[0].title);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  // Fetch collector + snack data
  useEffect(() => {
    if (!selectedMovie) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1️⃣ Movie collectors
        const collectorRes = await axios.get(`${backend}/api/allcollector`);
        const collectorsData: CollectorType[] = collectorRes.data.collectors || [];

        const collectorsWithMovie = await Promise.all(
          collectorsData.map(async (c) => {
            try {
              const statsRes = await axios.get(
                `${backend}/api/collector/${c._id}?movieName=${encodeURIComponent(selectedMovie)}`
              );
              const stats: CollectorStats[] = statsRes.data.data || [];
              const totalCollected = stats.reduce((acc, i) => acc + i.totalAmount, 0);
              return { ...c, collectAmount: totalCollected };
            } catch {
              return { ...c, collectAmount: 0 };
            }
          })
        );

        // 2️⃣ Snack revenue
        const snackRes = await axios.get(`${backend}/snacks-revenue/revenue`);
        const snackData: SnackRevenue[] = snackRes.data.data || [];
        const totalSnack = snackData.reduce((acc, s) => acc + (s.collectorRevenue || 0), 0);
        setTotalSnackRevenue(totalSnack);
        setSnackRevenues(snackData);

        // 3️⃣ Merge snack revenue into collectors
        const combined = collectorsWithMovie.map((c) => {
          const snack = snackData.find((s) => s._id === c._id);
          return {
            ...c,
            snackAmount: snack?.collectorRevenue || 0,
          };
        });

        setCollectors(combined);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch collectors");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMovie]);

  if (loading) return <div className="p-6 text-center">Loading collectors...</div>;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-black min-h-screen">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Collector Dashboard</h1>

      {/* Total Summary */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center">
        <p className="text-xl font-bold text-indigo-700">
          Total Collectors: {collectors.length}
        </p>
        <p className="text-xl font-bold text-green-700">
          Total Snack Revenue: SEK {totalSnackRevenue}
        </p>
      </div>

      {/* Movie Selection */}
      <div className="mb-6">
        <label className="font-semibold text-white mr-3">Select Movie:</label>
        <select
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
          className="px-3 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {movies.map((m) => (
            <option key={m._id} value={m.title}>{m.title}</option>
          ))}
        </select>
      </div>

      {/* Collector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {collectors.map((c) => (
          <div
            key={c._id}
            className={`p-5 rounded-2xl shadow-lg border ${
              c.access === "allowed"
                ? "border-green-400 bg-green-50"
                : c.access === "denied"
                ? "border-red-400 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <h2 className="text-xl font-bold text-blue-700 mb-2">{c.username}</h2>
            <p><strong>Phone:</strong> {c.phone}</p>
            <p><strong>Email:</strong> {c.email}</p>
            <p><strong>Movie Collection:</strong> SEK {c.collectAmount || 0}</p>
            <p><strong>Snack Collection:</strong> SEK {c.snackAmount || 0}</p>
            <p className="mt-2 font-bold text-green-800">
              Grand Total: SEK {(c.collectAmount || 0) + (c.snackAmount || 0)}
            </p>
            <p className="mt-2">
              <strong>Access:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-white font-semibold text-sm ${
                  c.access === "allowed"
                    ? "bg-green-600"
                    : c.access === "denied"
                    ? "bg-red-600"
                    : "bg-gray-500"
                }`}
              >
                {c.access || "pending"}
              </span>
            </p>
          </div>
        ))}
      </div>

   {/* Snack Revenue Table at Bottom */}
<div className="p-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-xl shadow-md mt-10">
  <h2 className="text-2xl font-bold mb-4 text-orange-700">🍿 Snack Revenue Table</h2>

  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-xl shadow-md">
      <thead className="bg-orange-200 text-left">
        <tr>
          <th className="px-4 py-2 border">Collector Name</th>
          <th className="px-4 py-2 border">Email</th>
          <th className="px-4 py-2 border">Phone</th>
          <th className="px-4 py-2 border">Snack Revenue</th>
        </tr>
      </thead>
      <tbody>
        {collectors.length === 0 && (
          <tr>
            <td colSpan={4} className="text-center py-4 text-gray-600">
              No collector data found.
            </td>
          </tr>
        )}
        {collectors.map((c) => {
          // Find corresponding snack revenue by collector _id
         const snack = snackRevenues.find((s) => s._id === c._id);


          return (
            <tr key={c._id} className="border-b hover:bg-orange-50">
              <td className="px-4 py-2 border">{c.username}</td>
              <td className="px-4 py-2 border">{c.email}</td>
              <td className="px-4 py-2 border">{c.phone}</td>
              <td className="px-4 py-2 border">SEK {snack?.collectorRevenue || 0}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>


    </div>
  );
};

export default CombinedCollectorDashboard;
