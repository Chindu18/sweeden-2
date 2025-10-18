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

interface CollectorType {
  _id: string;
  username: string;
  phone: string;
  email: string;
  address: string;
  collectorType: string;
  collectAmount?: number;
}
const Dashboard = () => {
  const backend_url = "https://swedenn-backend.onrender.com";

  const [movie, setMovie] = useState({});
  const [allBookings, setAllBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState("All");
  const [searchId, setSearchId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pendingToggleIndex, setPendingToggleIndex] = useState(null);
  const [totalSeats, setTotalSeats] = useState(0);
  const [paidMoney, setPaidMoney] = useState(0);
  const [pendingMoney, setPendingMoney] = useState(0);
  const [totalShow, setTotalShows] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const [singleId, setsingleId] = useState({});

 const formatTime = (timeString) => {
  if (!timeString) return "";
  const [hour, minute] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // shows AM/PM
  });
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long", // e.g., Saturday
    month: "long",   // e.g., October
    day: "numeric",  // e.g., 18
    year: "numeric", // e.g., 2025
  });
};

interface CollectorStats {
  movieName: string;
  date: string;
  totalAmount: number;
}
  // Fetch latest movie
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`${backend_url}/movie/getmovie`);
        const data = response.data.data;
        if (data && data.length > 0) setMovie(data[data.length - 1]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovie();
  }, []);


  const[TotalCollectors,setTotalCollectors]=useState()
    const [stats, setStats] = useState<CollectorStats[]>([]);
 
  // Fetch dashboard data for selected movie
  useEffect(() => {
    if (!movie.title) return;
    const fetchData = async () => {
      try {
        const seatsResp = await axios.get(`${backend_url}/dashboard/seats`, { params: { movieName: movie.title } });
        setTotalSeats(seatsResp.data.totalSeats);

        const totalShowResp = await axios.get(`${backend_url}/dashboard/totalshow`, { params: { movieName: movie.title } });
        setTotalShows(totalShowResp.data.totalShows);

        const pendingResp = await axios.get(`${backend_url}/dashboard/pending`, { params: { movieName: movie.title, paymentStatus: "pending" } });
        const paidResp = await axios.get(`${backend_url}/dashboard/pending`, { params: { movieName: movie.title, paymentStatus: "paid" } });

        const combined = [...pendingResp.data.data, ...paidResp.data.data];
        setAllBookings(combined);
        setBookings(combined);

        setPendingMoney(pendingResp.data.totalAmount);
        setPaidMoney(paidResp.data.totalAmount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [movie]);

  // Filter bookings based on status, method, and search
  useEffect(() => {
    let filtered = allBookings;

    // Filter by status
    if (paymentStatus.toLowerCase() === "pending") {
      filtered = filtered.filter(b => b.paymentStatus?.toString().trim().toLowerCase() === "pending");
    } else if (paymentStatus.toLowerCase() === "paid") {
      filtered = filtered.filter(b => b.paymentStatus?.toString().trim().toLowerCase() === "paid");
    }

    // Filter by payment method (ticketType in backend)
if (paymentMethod.toLowerCase() === "online") {
  filtered = filtered.filter(
    b => b.ticketType?.toString().trim().toLowerCase() === "online"
  );
} else if (paymentMethod.toLowerCase() === "offline") {
  filtered = filtered.filter(
    b => b.ticketType?.toString().trim().toLowerCase() === "video speed"
  );
}


    setBookings(filtered);
  }, [paymentStatus, paymentMethod, allBookings, searchId]);

  const confirmToggleStatus = async () => {
    if (pendingToggleIndex === null) return;
    const booking = bookings[pendingToggleIndex];

    try {
      const res = await axios.put(`${backend_url}/dashboard/booking/${booking.bookingId}/status`, { paymentStatus: "paid" });
      const updatedBooking = res.data.data;
      setsingleId(updatedBooking);

      setBookings(prev => {
        const newBookings = [...prev];
        newBookings[pendingToggleIndex].paymentStatus = "paid";
        return newBookings;
      });

      setPendingMoney(prev => prev - booking.totalAmount);
      setPaidMoney(prev => prev + booking.totalAmount);

      try {
        await axios.post(`${backend_url}/booking/paid`, { email: updatedBooking.email || 'chinraman8@gmail.com', bookingId: updatedBooking.bookingId });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }

    } catch (error) {
      console.error("Failed to update payment status:", error);
    } finally {
      setPendingToggleIndex(null);
      setShowModal(false);
    }
  };

  const cancelToggleStatus = () => {
    setPendingToggleIndex(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-red-700 bg-clip-text text-transparent">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-md hover:shadow-lg border-l-4 border-l-primary">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-3xl font-bold mt-2">{totalSeats}</p>
              </div>
              <Users className="h-6 w-6 text-blue-600" />
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg border-l-4 border-l-green-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Collected</p>
                <p className="text-3xl font-bold mt-2 flex items-center gap-1">
                  <IndianRupee className="h-6 w-6" /> {paidMoney}
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg border-l-4 border-l-orange-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold mt-2 flex items-center gap-1">
                  <IndianRupee className="h-6 w-6" /> {pendingMoney}
                </p>
              </div>
              <Clock className="h-6 w-6 text-orange-600" />
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg border-l-4 border-l-purple-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Shows</p>
                <p className="text-3xl font-bold mt-2">{totalShow}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </CardContent>
          </Card>
           <Card asChild className="shadow-md hover:shadow-lg border-l-4 border-l-purple-500">
  <Link to="/collectors">
    <CardContent className="p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-muted-foreground">collectors</p>
        <p className="text-3xl font-bold mt-2">{TotalCollectors}</p>
      </div>
      <TrendingUp className="h-6 w-6 text-purple-600" />
    </CardContent>
  </Link>
</Card>
        </div>

        {/* Bookings Table */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-red-700 bg-clip-text text-transparent mb-4">Current Movie Bookings</h2>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Movie Name</label>
                <input type="text" value={movie?.title || ""} className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed" readOnly />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search by Booking ID</label>
                <input type="text" placeholder="Enter booking ID..." value={searchId} onChange={(e) => setSearchId(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none" />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary outline-none">
                  <option value="All">All</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="All">All</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Member Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-center">Seats</TableHead>
                    <TableHead>Show</TableHead>
                    <TableHead className="text-center">Payment Status</TableHead>
                    <TableHead className="text-center">Payment Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b, i) => (
                    <TableRow key={b.bookingId}>
                      <TableCell>{b.bookingId}</TableCell>
                      <TableCell>{b.name}</TableCell>
                      <TableCell>{b.email}</TableCell>
                      <TableCell>{b.phone}</TableCell>
                      <TableCell className="text-center">{b.seatNumbers.join(", ")}</TableCell>
                      <TableCell>{formatDate(b.date)} <br /><span className="text-sm text-muted-foreground">{formatTime(b.timing)}</span></TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => {
                            if (b.paymentStatus.toLowerCase() === "pending") {
                              setPendingToggleIndex(i);
                              setShowModal(true);
                            }
                          }}
                          disabled={b.paymentStatus.toLowerCase() === "paid"}
                          className={`relative inline-flex items-center h-6 w-16 rounded-full transition-colors duration-300 ${b.paymentStatus.toLowerCase() === "paid" ? "bg-green-500 cursor-not-allowed" : "bg-orange-500"}`}
                        >
                          <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${b.paymentStatus.toLowerCase() === "paid" ? "translate-x-10" : "translate-x-0"}`}></span>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white pointer-events-none">{b.paymentStatus}</span>
                        </button>
                      </TableCell>
                      <TableCell className="text-center">{b.ticketType || "-"}</TableCell>
                      <TableCell className="text-right font-semibold flex items-center justify-end gap-1"><IndianRupee className="h-4 w-4" /> {b.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden flex flex-col gap-4">
              {bookings.map((b, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={b.bookingId} onClick={() => setOpenIndex(isOpen ? null : i)} className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{b.bookingId}</p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold flex items-center gap-1"><IndianRupee className="h-4 w-4" /> {b.totalAmount}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (b.paymentStatus.toLowerCase() === "pending") {
                              setPendingToggleIndex(i);
                              setShowModal(true);
                            }
                          }}
                          disabled={b.paymentStatus.toLowerCase() === "paid"}
                          className={`relative inline-flex items-center h-6 w-16 rounded-full transition-colors duration-300 ${b.paymentStatus.toLowerCase() === "paid" ? "bg-green-500 cursor-not-allowed" : "bg-orange-500"}`}
                        >
                          <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${b.paymentStatus.toLowerCase() === "paid" ? "translate-x-10" : "translate-x-0"}`}></span>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white pointer-events-none">{b.paymentStatus}</span>
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        <p>Name: {b.name}</p>
                        <p>Email: {b.email}</p>
                        <p>Seats: {b.seatNumbers.join(", ")}</p>
                        <p>Show: {b.date} <span className="text-muted-foreground">{b.timing}</span></p>
                        <p>Payment Method: {b.paymentMethod || "-"}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Confirmation Modal */}
            {showModal && pendingToggleIndex !== null && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <p className="mb-4">Are you sure you want to change this booking to Paid?</p>
                  <div className="flex justify-center gap-4">
                    <button onClick={confirmToggleStatus} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Yes</button>
                    <button onClick={cancelToggleStatus} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">No</button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
