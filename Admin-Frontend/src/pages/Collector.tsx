"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import CollectorManager from "@/components/addcollectors/CollectorManager";
import { useNavigate } from "react-router-dom";



interface CollectorStats {
  movieName: string;
  date: string;
  totalAmount: number;
}

interface CollectorType {
  _id: string;
  username: string;
  phone: string;
  email: string;
  address: string;
  collectorType: string;
  collectAmount?: number;
  access?: string; // allowed | denied | pending
}

const Collector = () => {
    const navigate = useNavigate();

  const handleClick = () => {
    navigate("/snackscollectorrevenue"); 
  };
  
  const [collectors, setCollectors] = useState<CollectorType[]>([]);
  const [totalCollectors, setTotalCollectors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(0);

  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string>("");

  const backend_url = "http://localhost:8004";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${backend_url}/movie/getmovie`);
        const data = response.data.data;
        if (Array.isArray(data) && data.length > 0) {
          const reversed = [...data].reverse();
          setMovies(reversed);
          setSelectedMovie(reversed[0].title);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (!selectedMovie) return;

    const fetchCollectors = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend_url}/api/allcollector`);
        if (res.data.success) {
          const collectorsData: CollectorType[] = res.data.collectors;

          const collectorsWithStats = await Promise.all(
            collectorsData.map(async (collector) => {
              try {
                const statsRes = await axios.get(
                  `${backend_url}/api/collector/${collector._id}?movieName=${encodeURIComponent(selectedMovie)}`
                );
                const stats: CollectorStats[] = statsRes.data.data || [];
                const totalCollected = stats.reduce((acc, item) => acc + item.totalAmount, 0);
                return { ...collector, collectAmount: totalCollected };
              } catch {
                return { ...collector, collectAmount: 0 };
              }
            })
          );

          setCollectors(collectorsWithStats);
          setTotalCollectors(collectorsWithStats.length);
          const total = collectorsWithStats.reduce((acc, c) => acc + (c.collectAmount || 0), 0);
          setGrandTotal(total);
        }
      } catch (err) {
        console.error("Error fetching collectors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectors();
  }, [selectedMovie]);

  const handleAccessChange = async (id: string, action: "allow" | "block" | "delete") => {
    try {
      if (action === "delete") {
        await axios.delete(`${backend_url}/api/collector/access/${id}`);
        setCollectors((prev) => prev.filter((c) => c._id !== id));
        toast.success("Collector deleted successfully");
      } else {
        const access = action === "allow" ? "allowed" : "denied";
        await axios.put(`${backend_url}/api/collector/access/${id}`, { access });
        setCollectors((prev) =>
          prev.map((c) => (c._id === id ? { ...c, access } : c))
        );
        toast.success(`Collector ${access}`);
      }
    } catch (err) {
      console.error("Error updating collector:", err);
      toast.error("Failed to update collector");
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading collectors...</div>;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-indigo-700">
          Total Collectors: {totalCollectors}
        </h1>

       

        <div className="flex items-center gap-3">
          <label htmlFor="movieSelect" className="font-semibold text-gray-700">Select Movie:</label>
          <select
            id="movieSelect"
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
            className="border rounded-lg px-3 py-2 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {movies.map((m) => (
              <option key={m._id} value={m.title}>
                {m.title}
              </option>
            ))}
          </select>
        </div>


           <div
      onClick={handleClick}
      className="cursor-pointer px-5 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-md text-center 
                 transform transition duration-300 hover:scale-105 hover:bg-blue-600"
    >
      Go for Snacks Revenue
    </div>
      </div>

      {/* Collector Manager */}
      <CollectorManager />

      {/* Grand Total */}
      <h1 className="text-2xl font-bold mb-6 text-green-700">
        Total Collection for "{selectedMovie}": SEK {grandTotal}
      </h1>

      {/* Collectors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectors.map((collector) => (
          <div
            key={collector._id}
            className={`p-5 rounded-3xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border ${
              collector.access === "allowed"
                ? "border-green-400 bg-green-50"
                : collector.access === "denied"
                ? "border-red-400 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <h2 className="text-lg font-bold text-indigo-600 mb-2">{collector.username}</h2>
            <p><strong>Phone:</strong> {collector.phone}</p>
            <p><strong>Email:</strong> {collector.email}</p>
            <p><strong>Address:</strong> {collector.address}</p>
            <p><strong>Type:</strong> {collector.collectorType}</p>
            <p><strong>Total Collected:</strong> SEK {collector.collectAmount || 0}</p>

            <p className="mt-2">
              <strong>Access:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-white font-semibold text-sm ${
                  collector.access === "allowed"
                    ? "bg-green-600"
                    : collector.access === "denied"
                    ? "bg-red-600"
                    : "bg-gray-500"
                }`}
              >
                {collector.access || "pending"}
              </span>
            </p>

            <div className="flex justify-between mt-4 gap-2">
              <button
                onClick={() => handleAccessChange(collector._id, "allow")}
                className="flex-1 px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition transform hover:scale-105"
              >
                Allow
              </button>
              <button
                onClick={() => handleAccessChange(collector._id, "block")}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition transform hover:scale-105"
              >
                Block
              </button>
              <button
                onClick={() => handleAccessChange(collector._id, "delete")}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition transform hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collector;
