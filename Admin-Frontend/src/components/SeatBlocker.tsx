"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X } from "lucide-react";

interface SeatBlockerProps {
  onClose: () => void;
  backendUrl: string;
}

const SeatBlocker: React.FC<SeatBlockerProps> = ({ onClose, backendUrl }) => {
  // Define seat layout (each number = seats per row)
  const seatLayoutSets = [
    [19, 19, 21, 21, 21, 21, 21, 21],
    [19, 19, 19, 19, 19, 19, 19, 19, 19],
    [7],
  ];

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [blockedSeats, setBlockedSeats] = useState<number[]>([]);
  const seatNumberRef = useRef(1); // ✅ Keeps seat numbering stable

  // Toggle seat selection
  const toggleSeat = (seat: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  // Get color for each seat
  const getSeatColor = (seat: number) => {
    if (blockedSeats.includes(seat)) return "bg-gray-500"; // blocked
    if (selectedSeats.includes(seat)) return "bg-red-600"; // selected
    return "bg-green-600"; // available
  };

  // Fetch blocked seats
  const getBlockedSeats = async () => {
    try {
      const res = await axios.get(`${backendUrl}/seats/blocked`);
      setBlockedSeats(res.data?.blockedseats || []);
    } catch (err) {
      console.error("Error fetching blocked seats:", err);
    }
  };

  // Block selected seats
  const saveBlockedSeats = async () => {
    if (!selectedSeats.length) return alert("Select seats to block!");
    try {
      await axios.post(`${backendUrl}/seats/block`, {
        blockedseats: selectedSeats,
      });
      alert("✅ Seats blocked successfully!");
      setSelectedSeats([]);
      await getBlockedSeats();
    } catch (err) {
      console.error(err);
      alert("Error blocking seats!");
    }
  };

  // Unblock selected seats
  const unblockSeats = async () => {
    if (!selectedSeats.length) return alert("Select seats to unblock!");
    try {
      await axios.put(`${backendUrl}/seats/unblock`, {
        seatNumbers: selectedSeats,
      });
      alert("✅ Seats unblocked successfully!");
      setSelectedSeats([]);
      await getBlockedSeats();
    } catch (err) {
      console.error(err);
      alert("Error unblocking seats!");
    }
  };

  useEffect(() => {
    getBlockedSeats();
  }, []);

  // Reset seat numbering once
  seatNumberRef.current = 1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl relative max-h-[90vh] overflow-auto shadow-xl">
        <button className="absolute top-2 right-2" onClick={onClose}>
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">🎟 Block / Unblock Seats</h2>

        {/* Seat layout */}
        <div className="overflow-x-auto w-full">
          <div className="inline-block min-w-max px-2 space-y-2">
            {seatLayoutSets.map((set, setIndex) => {
              const maxCols = Math.max(...set);
              const previousRows = seatLayoutSets
                .slice(0, setIndex)
                .reduce((acc, prevSet) => acc + prevSet.length, 0);

             return set.map((cols, rowIndex) => {
  const rowNumber = previousRows + rowIndex + 1;


                return (
                  <div
                    key={`set${setIndex}-${rowIndex}`}
                    className="flex justify-center items-center gap-2 mb-2"
                  >
                    <span className="w-6 text-right font-bold">{rowNumber}</span>

                    {Array.from({ length: maxCols }, (_, seatIndex) => {
                      if (
                        seatIndex < Math.floor((maxCols - cols) / 2) ||
                        seatIndex >= Math.floor((maxCols - cols) / 2) + cols
                      ) {
                        return <div key={`empty-${seatIndex}`} className="w-6 h-6" />;
                      }

                      const seatNumber = seatNumberRef.current++;

                      return (
                        <button
                          key={seatNumber}
                          onClick={() => toggleSeat(seatNumber)}
                          className={`w-6 h-6 rounded ${getSeatColor(
                            seatNumber
                          )} text-white text-xs`}
                        >
                          {seatNumber}
                        </button>
                      );
                    })}

                    <span className="w-6 text-left font-bold">{rowNumber}</span>
                  </div>
                );
              });
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
          <div>
            <strong>Selected:</strong> {selectedSeats.join(", ") || "None"}
          </div>
          <div className="flex gap-2">
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              onClick={saveBlockedSeats}
            >
              Block
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              onClick={unblockSeats}
            >
              Unblock
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-center gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-600 rounded" /> Available
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-600 rounded" /> Selected
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-500 rounded" /> Blocked
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBlocker;
