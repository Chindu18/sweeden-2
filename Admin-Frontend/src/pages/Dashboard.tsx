
import React, { useEffect, useState } from "react";
import { IndianRupee, Users, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { Link } from "react-router-dom";

interface CollectorStats {
  movieName: string;
  date: string;
  totalAmount: number;
}

interface Booking {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  seatNumbers: string[];
  date: string;
  timing: string;
  paymentStatus: string;
  ticketType: string;
  collectorChangedFrom: string;
  totalAmount: number;
}

const Dashboard = () => {
  const backend_url = "http://localhost:8004";

  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState("All");
  const [searchId, setSearchId] = useState("");
  const [pendingToggleIndex, setPendingToggleIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [totalSeats, setTotalSeats] = useState(0);
  const [paidMoney, setPaidMoney] = useState(0);
  const [pendingMoney, setPendingMoney] = useState(0);
  const [totalShow, setTotalShows] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [TotalCollectors, setTotalCollectors] = useState(0);

  // ---------------- Utility formatters ----------------
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hour, minute] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // ---------------- Fetch all movies ----------------
 useEffect(() => {
  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${backend_url}/movie/getmovie`);
      const data = response.data.data || [];

      // Reverse to show latest first
      const reversedData = [...data].reverse();

      setAllMovies(reversedData);

      // Auto select the latest movie (first in reversed list)
      if (reversedData.length > 0) {
        setSelectedMovie(reversedData[0]);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  };

  fetchMovies();
}, []);


  // ---------------- Fetch dashboard data ----------------
  useEffect(() => {
    if (!selectedMovie?.title) return;

    const fetchData = async () => {
      try {
        const seatsResp = await axios.get(`${backend_url}/dashboard/seats`, {
          params: { movieName: selectedMovie.title },
        });
        setTotalSeats(seatsResp.data.totalSeats);

        const totalShowResp = await axios.get(`${backend_url}/dashboard/totalshow`, {
          params: { movieName: selectedMovie.title },
        });
        setTotalShows(totalShowResp.data.totalShows);

        const pendingResp = await axios.get(`${backend_url}/dashboard/pending`, {
          params: { movieName: selectedMovie.title, paymentStatus: "pending" },
        });
        const paidResp = await axios.get(`${backend_url}/dashboard/pending`, {
          params: { movieName: selectedMovie.title, paymentStatus: "paid" },
        });

        const combined = [...pendingResp.data.data, ...paidResp.data.data];
        setAllBookings(combined);
        console.log("Combined Bookings:", combined);
        setBookings(combined);
        setPendingMoney(pendingResp.data.totalAmount);
        setPaidMoney(paidResp.data.totalAmount);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [selectedMovie]);

  // ---------------- Filtering logic ----------------
  useEffect(() => {
    let filtered = [...allBookings];

    if (paymentStatus.toLowerCase() === "pending") {
      filtered = filtered.filter((b) => b.paymentStatus.toLowerCase() === "pending");
    } else if (paymentStatus.toLowerCase() === "paid") {
      filtered = filtered.filter((b) => b.paymentStatus.toLowerCase() === "paid");
    }

    if (paymentMethod.toLowerCase() === "online") {
      filtered = filtered.filter((b) => b.ticketType?.toLowerCase() === "online");
    } else if (paymentMethod.toLowerCase() === "offline") {
      filtered = filtered.filter((b) => b.ticketType?.toLowerCase() === "offline");
    }

    if (searchId.trim() !== "") {
      filtered = filtered.filter((b) =>
        b.bookingId.toLowerCase().includes(searchId.toLowerCase())
      );
    }

    setBookings(filtered);
  }, [paymentStatus, paymentMethod, searchId, allBookings]);

  // ---------------- Confirm toggle ----------------
  const confirmToggleStatus = async () => {
    if (pendingToggleIndex === null) return;
    const booking = bookings[pendingToggleIndex];

    try {
      const res = await axios.put(`${backend_url}/dashboard/booking/${booking.bookingId}/status`, {
        paymentStatus: "paid",
      });
      const updatedBooking = res.data.data;
      console.log("Updated Booking:", updatedBooking);
      setBookings((prev) => {
        const updated = [...prev];
        updated[pendingToggleIndex].paymentStatus = "paid";
        return updated;
      });

      setPendingMoney((prev) => prev - booking.totalAmount);
      setPaidMoney((prev) => prev + booking.totalAmount);

      try {
        await axios.post(`${backend_url}/booking/paid`, {
          email: updatedBooking.email || "chinraman8@gmail.com",
          bookingId: updatedBooking.bookingId,
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    } finally {
      setPendingToggleIndex(null);
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-red-700 bg-clip-text text-transparent">
          Dashboard
        </h1>

        {/* Movie Dropdown */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Movie
            </label>
           <select
  value={selectedMovie?.title || ""}
  onChange={(e) =>
    setSelectedMovie(
      allMovies.find((m) => m.title === e.target.value) || null
    )
  }
  className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary outline-none"
>
  {[...allMovies].reverse().map((m) => (
    <option key={m._id} value={m.title}>
      {m.title}
    </option>
  ))}
</select>

          </div>
        </div>

        {/* Stats Cards */}
       {/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
  <Card>
    <CardContent className="p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-muted-foreground">Total Members</p>
        <p className="text-3xl font-bold mt-2">{totalSeats}</p>
      </div>
      <Users className="h-6 w-6 text-blue-600" />
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-muted-foreground">Collected</p>
        <p className="text-3xl font-bold mt-2 flex items-center gap-1">
         SEK {paidMoney}
        </p>
      </div>
      <TrendingUp className="h-6 w-6 text-green-600" />
    </CardContent>
  </Card>

  {/* ✅ New Total Shows Card */}
  <Card>
    <CardContent className="p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-muted-foreground">Total Shows</p>
        <p className="text-3xl font-bold mt-2">{totalShow}</p>
      </div>
      <Clock className="h-6 w-6 text-indigo-600" />
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-muted-foreground">Pending</p>
        <p className="text-3xl font-bold mt-2 flex items-center gap-1">
          SEK {pendingMoney}
        </p>
      </div>
      <Clock className="h-6 w-6 text-orange-600" />
    </CardContent>
  </Card>

  <Card asChild>
    <Link to="/collectors">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Collectors</p>
          <p className="text-3xl font-bold mt-2">Show more</p>
        </div>
        <TrendingUp className="h-6 w-6 text-purple-600" />
      </CardContent>
    </Link>
  </Card>
</div>


        {/* Bookings Table */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-red-700 bg-clip-text text-transparent mb-4">
              Bookings
            </h2>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Booking ID
                </label>
                <input
                  type="text"
                  placeholder="Enter booking ID..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                  <option value="All">All</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                  <option value="All">All</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            {/* Table */}
         {/* Table */}
<div className="overflow-x-auto">
  <Table className="hidden lg:table">
    {/* ✅ Desktop View */}
    <TableHeader>
      <TableRow>
        <TableHead>Booking ID</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Seats</TableHead>
        <TableHead>Show</TableHead>
        <TableHead>Chosen Method</TableHead>
        <TableHead>Paid Method</TableHead>
        <TableHead className="text-right">Amount</TableHead>
        <TableHead className="text-center">Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {bookings.map((b, i) => (
        <TableRow key={b.bookingId}>
          <TableCell>{b.bookingId}</TableCell>
          <TableCell>{b.name}</TableCell>
          <TableCell>{b.email}</TableCell>
          <TableCell>
            {b.seatNumbers.map((s: any) => `R${s.row}-S${s.seat}`).join(", ")}
          </TableCell>
          <TableCell>
            {formatDate(b.date)} <br />
            <span className="text-sm text-muted-foreground">
              {formatTime(b.timing)}
            </span>
          </TableCell>
          <TableCell>{b.collectorChangedFrom}</TableCell>
          <TableCell>{b.collectorType}</TableCell>
          <TableCell className="text-right font-semibold">
            SEK {b.totalAmount}
          </TableCell>
          <TableCell className="text-center">
            <button
              onClick={() => {
                if (b.paymentStatus.toLowerCase() === "pending") {
                  setPendingToggleIndex(i);
                  setShowModal(true);
                }
              }}
              disabled={b.paymentStatus.toLowerCase() === "paid"}
              className={`px-3 py-1 rounded text-white ${
                b.paymentStatus.toLowerCase() === "paid"
                  ? "bg-green-500"
                  : "bg-orange-500"
              }`}
            >
              {b.paymentStatus}
            </button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

  {/* ✅ Mobile & Tablet View */}
  <div className="block lg:hidden space-y-4">
    {bookings.map((b, i) => {
      const isOpen = openIndex === i;
      return (
        <div
          key={b.bookingId}
          className="border rounded-lg p-4 shadow-sm bg-white"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{b.bookingId}</p>
              <p className="text-sm text-gray-600">
                Payment: {b.ticketType}
              </p>
            </div>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="text-blue-600 text-sm font-medium"
            >
              {isOpen ? "Hide Details" : "Show Details"}
            </button>
          </div>

          {isOpen && (
            <div className="mt-3 text-sm space-y-1">
              <p><strong>Name:</strong> {b.name}</p>
              <p><strong>Email:</strong> {b.email}</p>
              <p><strong>Seats:</strong> {b.seatNumbers.map((s: any) => `R${s.row}-S${s.seat}`).join(", ")}</p>
              <p>
                <strong>Show:</strong> {formatDate(b.date)} at {formatTime(b.timing)}
              </p>
              <p><strong>Chosen Method:</strong> {b.collectorChangedFrom}</p>
              <p><strong>Amount:</strong> SEK {b.totalAmount}</p>
              <p>
                <strong>Status:</strong>{" "}
                <button
                  onClick={() => {
                    if (b.paymentStatus.toLowerCase() === "pending") {
                      setPendingToggleIndex(i);
                      setShowModal(true);
                    }
                  }}
                  disabled={b.paymentStatus.toLowerCase() === "paid"}
                  className={`px-3 py-1 rounded text-white ${
                    b.paymentStatus.toLowerCase() === "paid"
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                >
                  {b.paymentStatus}
                </button>
              </p>
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>


          </CardContent>
        </Card>

        {/* Confirm Modal */}
        {showModal && pendingToggleIndex !== null && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="mb-4">
                Are you sure you want to change this booking to Paid?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmToggleStatus}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;