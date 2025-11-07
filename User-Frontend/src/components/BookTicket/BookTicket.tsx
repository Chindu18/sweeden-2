

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 
import { toast } from "@/hooks/use-toast";
import { Ticket, CreditCard, Film } from "lucide-react";
import { useParams } from "react-router-dom";
import BookingQR from "./BookingQR";
import TicketForm from "./TicketForm";
import OTPVerification from "./OTPVerification";
import SeatLayout from "./SeatLayout";
import { Movie, Show, BookingData } from "./types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";


const backend_url = "http://localhost:8004";

const formatTime = (timeString: string) => {
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(Number(hour) || 0, Number(minute) || 0);
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

const formatDate = (dateString: string) => {
  const options = { weekday: "short", day: "numeric", month: "short" } as const;
  return new Date(dateString).toLocaleDateString(undefined, options);
};




 

const BookTicket: React.FC = () => {
  const { id } = useParams();
  const [ids,setids]=useState(id)
  console.log("movie id:",ids);
  // -------------------- State --------------------
  const [movie, setMovie] = useState<Movie>({
    title: "",
    cast: { hero: "", heroine: "", villain: "", supportArtists: [] },
    crew: { director: "", producer: "", musicDirector: "", cinematographer: "" },
    photos: [],
    shows: [],
    bookingOpenDays: 3,
  });

  const [selectedShowId, setSelectedShowId] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<{ seat: number; row: number }[]>([]);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adult, setAdult] = useState(0);
  const [kids, setKids] = useState(0);
  const [ticketType, setTicketType] = useState<string>("");
  const [bookingData, setBookingData] = useState<any | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [Phone, setPhone] = useState("");

  // OTP
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // QR
  const [qr, setQr] = useState("");

  // Payment dialog (red/black/white)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState<{ title: string; message: string }>({
    title: "",
    message: "",
  });


   const handleOrderSnack = () => {
    navigate(`/booking/${bookingData.bookingId}/${bookingData.email}/ordersnack`);
  };
  // -------------------- Fetch Movie --------------------
  const fetchMovie = async () => {
    try {
      if (!id) return;
      const response = await axios.get(`${backend_url}/movie/getsinglemovie/${id}`);
      setMovie(response.data.data);
    } catch (error) {
      console.error("Movie fetch error:", error);
    }
  };

  useEffect(() => {
    fetchMovie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------- Fetch Booked Seats --------------------
  useEffect(() => {
    if (!selectedDate || !selectedTime) return;
    axios
      .get(`${backend_url}/api/bookedSeats`, { params: { date: selectedDate, timing: selectedTime } })
      .then((res) => setBookedSeats(res.data.data || []))
      .catch((err) => console.log(err));
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    setAdult(0);
    setKids(0);
    setSelectedSeats([]);
  }, [ticketType]);

  const selectedShow = movie.shows?.find((s) => s.date === selectedDate && s.time === selectedTime);

  // -------------------- Ticket Price --------------------
  const getTicketPrice = (type: string) => {
    if (!selectedShow) return { adult: 0, kids: 0 };
    if (type === "online") return selectedShow.prices?.online ?? { adult: 0, kids: 0 };
    if (type === "video") return selectedShow.prices?.videoSpeed ?? { adult: 0, kids: 0 };

    const collector = selectedShow.collectors?.find((c) => c.collectorName === type);
    if (collector) return { adult: collector.adult, kids: collector.kids };

    return { adult: 0, kids: 0 };
  };

  const ticketPrice = getTicketPrice(ticketType);
  const totalSeatsSelected = adult + kids;
  const calculateTotal = () => adult * ticketPrice.adult + kids * ticketPrice.kids;

  // -------------------- Seat Selection --------------------
  const handleSeatClick = (seatNumber: number, rowNumber: number) => {
    if (bookedSeats.includes(seatNumber)) {
      toast({
        title: "Seat Unavailable",
        description: "This seat is already booked.",
        variant: "destructive",
      });
      return;
    }

    const alreadySelected = selectedSeats.some((s) => s.seat === seatNumber);

    if (alreadySelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seat !== seatNumber));
    } else {
      if (selectedSeats.length >= totalSeatsSelected) {
        toast({
          title: "Maximum Seats Selected",
          description: `You can only select ${totalSeatsSelected} seat(s).`,
          variant: "destructive",
        });
        return;
      }
      setSelectedSeats([...selectedSeats, { seat: seatNumber, row: rowNumber }]);
    }
  };

  // -------------------- Booking --------------------
 const handleBooking = async () => {
  if (
    !name ||
    !email ||
    selectedSeats.length !== totalSeatsSelected ||
    !ticketType ||
    !selectedShow ||
    !Phone
  ) {
    toast({
      title: "Missing Info",
      description: "Please fill all fields and select seats.",
      variant: "destructive",
    });
    return;
  }

  // ✅ Auto-convert "video" → "video speed"
  const finalTicketType = ticketType.toLowerCase() === "video" ? "video speed" : ticketType;

  const booking: BookingData & any = {
    name,
    email,
    phone: Phone,
    date: selectedShow.date,
    timing: selectedShow.time,
    movieName: movie.title,
    seatNumbers: selectedSeats,
    paymentStatus: "pending",
    adult,
    kids,
    totalSeatsSelected,
    ticketType: finalTicketType, // ✅ use updated type
    seatLayoutSets,
    totalAmount: calculateTotal(),
    movieId:ids
  };

  try {
    const res = await axios.post(`${backend_url}/api/addBooking`, booking);
    if (res.data.success) {
      setBookedSeats([...bookedSeats]);
      const qrValue = res.data.qrCode;
      setQr(String(qrValue));
     setBookingData({
  qrCode: res.data.qrCode,
  bookingId: res.data.bookingId,
  email: booking.email, // ✅ add this line
  data: res.data.data,
});


      setShowQRModal(true);
      toast({
        title: "Booking Successful!",
        description: "Your ticket has been booked.",
      });

      // Reset form
      
      
      setAdult(0);
      setKids(0);
      setTicketType("");
      
      setPhone("");
    }
  } catch (err: any) {
    toast({
      title: "Booking Failed",
      description:
        err.response?.data?.message || "Something went wrong",
      variant: "destructive",
    });
  }
};


  // -------------------- OTP --------------------
  const sendOtp = async () => {
    if (!email) {
      toast({ title: "Enter Email", description: "Please enter your email first.", variant: "destructive" });
      return;
    }
    try {
      await axios.post(`${backend_url}/otp/send-otp`, { email });
      setOtpSent(true);
      toast({ title: "OTP Sent", description: "Check your email." });
    } catch {
      toast({ title: "Failed to send OTP", description: "Try again.", variant: "destructive" });
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(`${backend_url}/otp/verify-otp`, { email, otp });
      if (res.data.success) {
        setOtpVerified(true);
        toast({ title: "OTP Verified", description: "You can now book your tickets." });
      } else {
        toast({ title: "Invalid OTP", description: res.data.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Verification Failed", description: "Try again.", variant: "destructive" });
    }
  };

  // -------------------- Seat Layout --------------------
  const seatLayoutSets = [
    [19, 19, 21, 21, 21, 21, 21, 21],
    [19, 19, 19, 19, 19, 19, 19, 19, 19],
    [7],
  ];

  const futureShows = (movie.shows || []).filter((show: Show) => {
    try {
      const [hours, minutes] = show.time.includes(":") ? show.time.split(":").map(Number) : [0, 0];
      const showDateTime = new Date(show.date);
      showDateTime.setHours(hours, minutes, 0, 0);
      return showDateTime >= new Date();
    } catch {
      return false;
    }
  });

  // -------------------- Helpers: open payment dialog --------------------
  const openPaymentDialog = (mode: string) => {
    if (mode === "online") {
      setPaymentDialog({
        title: "Online Payment Selected",
        message: "Thank you for selecting online mode. Let’s follow up with bank details…",
      });
    } else {
      setPaymentDialog({
        title: "Payment Mode Selected",
        message: `Thank you for selecting ${mode}. Please make this payment within 12 hours.`,
      });
    }
    setPaymentDialogOpen(true);
  };
   const navigate = useNavigate();

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-foreground mb-4">
            Book Your Tickets for <span className="text-[#0078f8] decoration-wavy">{movie.title}</span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white mx-auto rounded-full"></div>
          <p className="text-muted-foreground mt-4">Select your seats and complete your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-border shadow-xl">
              {/* <CardHeader className="bg-gradient-to-r from-accent to-accent/80 text-white"> */}
              <CardHeader className="bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white">
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Ticket className="w-8 h-8" /> Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <TicketForm name={name} email={email} phone={Phone} setName={setName} setEmail={setEmail} setPhone={setPhone} />
                <div>
                  <Label className="flex items-center gap-2 text-lg">
                    <Film className="w-5 h-5 text-[#00c7a9]" /> Shows
                  </Label>
                  <div>
                    {futureShows.map((show, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedShowId(index);
                          setSelectedDate(show.date);
                          setSelectedTime(show.time);
                        }}
                        className={`m-2 px-6 py-3 rounded-lg border transition-all ${
                          selectedShowId === index ? "bg-[#00c7a9] text-white" : "border-border hover:border-[#00c7a9]"
                        }`}
                      >
                        <p className="font-semibold">{formatTime(show.time)}</p>
                        <p className="text-sm">{formatDate(show.date)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-2 border-border shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white">
                <CardTitle className="text-3xl flex items-center gap-3">
                  <CreditCard className="w-8 h-8 tracking-widest" /> Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {selectedShow && (
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => {
                        setTicketType("online");
                        openPaymentDialog("online");
                      }}
                      className={`px-6 py-3 rounded-lg font-semibold border-2 ${
                        ticketType === "online" ? "bg-[#00c7a9] text-white" : "hover:border-[#00c7a9]"
                      }`}
                    >
                      Online Payment
                    </button>
                    <button
                      onClick={() => {
                        setTicketType("video");
                        openPaymentDialog("video");
                      }}
                      className={`px-6 py-3 rounded-lg font-semibold border-2 ${
                        ticketType === "video" ? "bg-[#00c7a9] text-white" : "hover:border-[#00c7a9]"
                      }`}
                    >
                      Video Speed
                    </button>
                    {selectedShow.collectors?.map((c) => (
                      <button
                        key={c._id}
                        onClick={() => {
                          setTicketType(c.collectorName);
                          openPaymentDialog(c.collectorName);
                        }}
                        className={`px-6 py-3 rounded-lg font-semibold border-2 ${
                          ticketType === c.collectorName ? "bg-[#00c7a9] text-white" : "hover:border-[#00c7a9]"
                        }`}
                      >
                        {c.collectorName}
                      </button>
                    ))}
                  </div>
                )}

                {ticketType && (
                  <div className="space-y-4 border-2 border-border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <Label>Adult (SEK{ticketPrice.adult})</Label>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setAdult(Math.max(adult - 1, 0))} className="px-3 py-1 bg-gray-200 rounded">-</button>
                        <span>{adult}</span>
                        <button onClick={() => setAdult(adult + 1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Extras (SEK{ticketPrice.kids})</Label>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setKids(Math.max(kids - 1, 0))} className="px-3 py-1 bg-gray-200 rounded">-</button>
                        <span>{kids}</span>
                        <button onClick={() => setKids(kids + 1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold">Total Amount:</span>
                      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7]">SEK {calculateTotal()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* OTP & Booking */}
            <div className="border-2 border-border rounded-lg p-6">
              <OTPVerification
                email={email}
                otp={otp}
                setOtp={setOtp}
                otpSent={otpSent}
                otpVerified={otpVerified}
                sendOtp={sendOtp}
                verifyOtp={verifyOtp}
              />
              <Button
                onClick={handleBooking}
                className="w-full bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white  font-bold text-2xl py-6 rounded-xl mt-4"
                disabled={!otpVerified}
              >
                Book Now
              </Button>
            </div>
          </div>

          {/* Seat Layout */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-border shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-cinema-black to-secondary text-white">
                <CardTitle className="text-2xl text-center sm:text-left">Select Your Seats</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-transparent via-[#0078f7] to-transparent h-1 rounded-full mb-3"></div>
                  <p className="text-center font-bold">THIS IS THE SCREEN</p>
                </div>
                <SeatLayout
                  seatLayoutSets={[
                    [19],
                    [19],
                    [21],
                    [21],
                    [21],
                    [21],
                    [21],
                    [21],
                    [19],
                    [19],
                    [19],
                    [19],
                    [19],
                    [19],
                    [19],
                    [19],
                    [19],
                    [7],
                  ]}
                  bookedSeats={bookedSeats}
                  selectedSeats={selectedSeats}
                  onSeatClick={handleSeatClick}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ✅ QR Modal */}
      <BookingQR open={showQRModal} onClose={() => setShowQRModal(false)} bookingData={bookingData} />

      {/* ✅ Payment Mode Dialog (red/black/white) */}
      {/* ✅ Payment Mode Dialog — fixed corners + black top bar + smaller message */}
<Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
  <DialogContent
    className="
      sm:max-w-md
      p-0
      rounded-2xl
      overflow-hidden          /* <-- clips the black header so corners are clean */
      bg-white
      border border-[#060606]/20
      shadow-2xl
    "
  >
    {/* Top bar (black) */}
    <div className="flex items-center justify-between bg-[#060606] px-5 py-3">
      <div className="inline-flex items-center gap-2">
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#E54343] px-2 text-[10px] font-extrabold uppercase tracking-wide text-white">
          {paymentDialog.title?.toLowerCase().includes("online") ? "Online" : "Payment"}
        </span>
        <DialogTitle className="text-white text-sm md:text-base font-extrabold tracking-wide">
          {paymentDialog.title}
        </DialogTitle>
      </div>
      <DialogClose asChild>
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:text-white hover:bg-white/10 transition"
          aria-label="Close"
        >
          ×
        </button>
      </DialogClose>
    </div>

    {/* Body */}
    <div className="px-6 py-5">
      <DialogDescription
        className="
          text-[#060606]
          text-[15px]           /* slightly smaller than before */
          md:text-base
          font-semibold
          leading-relaxed
        "
      >
        {paymentDialog.message}
      </DialogDescription>
    </div>

    {/* Divider */}
    <div className="h-px bg-[#060606]/10" />

    {/* Footer */}
    <DialogFooter className="px-6 py-4 flex items-center justify-end gap-2">
      <Button
        onClick={() => setPaymentDialogOpen(false)}
        className="bg-[#060606] text-white hover:bg-black"
      >
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

 {/* ✅ Show "Order Snacks" only after successful booking */}
{bookingData?.bookingId && (
  <div className="fixed bottom-6 right-6 flex flex-col items-center bg-white p-4 rounded-xl shadow-2xl border border-gray-200 animate-bounce">
    <p className="text-gray-800 font-semibold mb-2 text-center">
      🎉 Booking Successful!<br />Ready to order some snacks?
    </p>
    <button
      onClick={handleOrderSnack}
      className="bg-gradient-to-r from-[#007bff] via-[#00c6ff] to-[#00e0a8] hover:opacity-90 text-white font-bold px-6 py-2 rounded-full shadow-lg transition-all"
    >
      🍿 Order Snacks
    </button>
  </div>
)}

    </div>
  );
};

export default BookTicket;




