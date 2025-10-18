


import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/hooks/use-toast";
import { Users, Ticket, CreditCard, Film } from "lucide-react";
import { toDataURL } from 'qrcode';

interface BookingData {
  seatNumbers: number[];
  adult: number;
  kids: number;
  ticketType: string;
  totalAmount: number;
  totalSeats: number;
}

interface Show {
  date: string;
  time: string;
  prices: {
    online: { adult: number; kids: number };
    videoSpeed: { adult: number; kids: number };
    soder: { adult: number; kids: number };
  };
}

interface Movie {
  title: string;
  cast: { hero: string; heroine: string; villain: string; supportArtists: string[] };
  crew: { director: string; producer: string; musicDirector: string; cinematographer: string };
  photos: string[];
  shows: Show[];
  bookingOpenDays: number;
}
const formatTime = (timeString) => {
  const [hour, minute] = timeString.split(':');
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};

const formatDate = (dateString) => {
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const parseShowDateTime = (show: Show) => {
  if (!show.date || !show.time) return null;

  const datePart = new Date(show.date);
  let hours = 0, minutes = 0;

  if (show.time.includes(":")) {
    // 24-hour format "14:30"
    [hours, minutes] = show.time.split(":").map(Number);
  } else if (show.time.toLowerCase().includes("am") || show.time.toLowerCase().includes("pm")) {
    // 12-hour format "10.00am"
    const isPM = show.time.toLowerCase().includes("pm");
    const [h, m] = show.time.slice(0, -2).split(".").map(Number);
    hours = isPM ? (h % 12) + 12 : h % 12;
    minutes = m || 0;
  }

  const showDateTime = new Date(datePart);
  showDateTime.setHours(hours, minutes, 0, 0);

  return showDateTime;
};




//otp

const backend_url='https://swedenn-backend.onrender.com'

const BookTicket = () => {
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
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adult, setAdult] = useState(0);
  const [kids, setKids] = useState(0);
  const [ticketType, setTicketType] = useState<string>("");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [Phone,setPhone]=useState('')

  //otp
const [otp, setOtp] = useState("");        // user-entered OTP
const [generatedOtp, setGeneratedOtp] = useState(""); // OTP from backend
const [otpSent, setOtpSent] = useState(false);
const [otpVerified, setOtpVerified] = useState(false);

//qr
const [qr, setQr] = useState("");






// Send OTP to user's email


  // Send OTP
  const sendOtp = async () => {
    if (!email) {
      toast({ title: "Enter Email", description: "Please enter your email first.", variant: "destructive" });
      return;
    }

    try {
      await axios.post(`${backend_url}/otp/send-otp`, { email });
      setOtpSent(true);
      toast({ title: "OTP Sent", description: "Check your email for OTP." });
    } catch (err) {
      toast({ title: "Failed to send OTP", description: "Try again.", variant: "destructive" });
      console.log(err.message);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      const res = await axios.post(`${backend_url}/otp/verify-otp`, { email, otp });
      if (res.data.success) {
        setOtpVerified(true);
        toast({ title: "OTP Verified", description: "You can now book your tickets." });
      } else {
        toast({ title: "Invalid OTP", description: res.data.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Failed to verify OTP", description: "Try again.", variant: "destructive" });
      console.log(err.message);
    }
  };



  // -------------------- Fetch Movie --------------------
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`${backend_url}/movie/getmovie`);
        const data = response.data.data;
        console.log(data)
        if (data && data.length > 0) {
          const lastMovie = data[data.length - 1];
          setMovie(lastMovie);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovie();
  }, []);

  //----------------------fetch sets --------------
  
  
   useEffect(() => {
  if (!selectedDate || !selectedTime) return; // only fetch if date & timing are selected
  console.log("Selected Date:", selectedDate);
  console.log("Selected Time:", selectedTime);

  axios.get(`${backend_url}/api/bookedSeats`, {
    params: { date: selectedDate, timing: selectedTime }
  })
  .then(res =>{ setBookedSeats(res.data.data);console.log(res.data.data)}) // <-- access data array
  .catch(err => console.log(err));
}, [selectedDate, selectedTime]);




  // -------------------- Reset Seats on Ticket Type Change --------------------
  useEffect(() => {
    setAdult(0);
    setKids(0);
    setSelectedSeats([]);
  }, [ticketType]);

  // -------------------- Get Selected Show --------------------
  const selectedShow = movie.shows?.find(
    (s) => s.date === selectedDate && s.time === selectedTime
  );

  // -------------------- Get Dynamic Ticket Price --------------------
  const getTicketPrice = (type: string) => {
    if (!selectedShow) return { adult: 0, kids: 0 };
    if (type === "online") return selectedShow.prices.online;
    if (type === "video") return selectedShow.prices.videoSpeed;
    if (type === "others") return selectedShow.prices.others;
    return { adult: 0, kids: 0 };
  };

  const ticketPrice = getTicketPrice(ticketType);
  let totalSeatsSelected = adult + kids;
  totalSeatsSelected=Number(totalSeatsSelected);
  console.log("Total Seats Selected:", totalSeatsSelected);
  const calculateTotal = () => adult * ticketPrice.adult + kids * ticketPrice.kids;

  // -------------------- Seat Selection --------------------
  const handleSeatClick = (seatNumber: number) => {
    if (bookedSeats.includes(seatNumber)) {
      toast({ title: "Seat Unavailable", description: "This seat is already booked.", variant: "destructive" });
      return;
    }
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= totalSeatsSelected) {
        toast({
          title: "Maximum Seats Selected",
          description: `You can only select ${totalSeatsSelected} seat(s).`,
          variant: "destructive",
        });
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const getSeatColor = (seatNumber: number) => {
  if (bookedSeats.includes(seatNumber)) return "bg-red-600"; // already booked → red
  if (selectedSeats.includes(seatNumber)) return "bg-green-600"; // selected → green
  return "bg-gray-300"; // available → default
};
const handleBooking = async () => {
  if (!name || !email || selectedSeats.length !== totalSeatsSelected || !ticketType || !selectedShow || !Phone) {
    toast({ title: "Missing Information", description: "Please fill all fields and select seats.", variant: "destructive" });
    return;
  }

  const paymentStatus = "pending";

  // Convert Phone to number before sending
  const phoneNumber = Number(Phone);

  if (isNaN(phoneNumber)) {
    toast({ title: "Invalid Phone", description: "Please enter a valid phone number.", variant: "destructive" });
    return;
  }

  const booking: BookingData = {
    name,
    email,
    phone: Phone, // send as number
    date: selectedShow.date,
    timing: selectedShow.time,
    movieName: movie.title,
    seatNumbers: selectedSeats,
    paymentStatus,
    adult,
    totalSeats: totalSeatsSelected,
    kids,
    ticketType:ticketType,
    totalAmount: calculateTotal(),
     collectorType:'',
     collectorId:'',
  };

  try {
    const response = await axios.post(`${backend_url}/api/addBooking`, booking);

    if (response.data.success) {
      setBookedSeats([...bookedSeats, ...selectedSeats]);
      setQr(response.data.qrCode);
      setBookingData(booking);
      setShowQRModal(true);

     if (ticketType === "online") {
  toast({
    title: "Mode: Online — we will get back soon for banking details",
    description: "Mode: Online — we will get back soon for banking details"
  });
} else if (ticketType === "video speed") {
  toast({
    title: "Mode: Video Speed",
    description: "Mode: Video Speed,Your ticket has been booked."
  });
} else if (ticketType === "others") {
  toast({
    title: "Mode: Others",
    description: "Mode: Others,Your ticket has been booked."
  });
} else {
  toast({
    title: "Booking Successful!",
    description: "Your ticket has been booked."
  });
}


      // Reset form
      setName("");
      setEmail("");
      setAdult(0);
      setKids(0);
      setTicketType("");
      setSelectedSeats([]);
      setPhone(""); // reset phone
    }
  } catch (error: any) {
    toast({
      title: "Booking Failed",
      description: error.response?.data?.message || "Something went wrong",
      variant: "destructive",
    });
    console.log(error);
  }
};



  // -------------------- Seat Layout --------------------
  const seatLayoutSets = [
    [19, 19, 21, 21, 21, 21, 21, 21],
    [19, 19, 19, 19, 19, 19, 19, 19, 19],
    [7],
  ];
  let currentSeatNumber = 1;

  // -------------------- JSX --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-4">Book Your Tickets</h1>
          <div className="w-32 h-1 bg-accent mx-auto rounded-full"></div>
          <p className="text-muted-foreground text-lg mt-4">Select your seats and complete your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details */}
            <Card className="border-2 border-border hover:border-accent/50 transition-colors shadow-xl animate-slide-up">
              <CardHeader className="bg-gradient-to-r from-accent to-accent/80 text-white">
                <CardTitle className="text-3xl flex items-center gap-3 tracking-[2px]">
                  <Ticket className="w-8 h-8" /> Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" /> Name
                  </Label>
                  <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="text-lg p-6 border-2 focus:border-accent" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-accent" /> Email
                  </Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="text-lg p-6 border-2 focus:border-accent" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" /> Contact Number
                  </Label>
                  <Input id="phone" type="tel" inputMode="numeric"  value={Phone} maxLength={11} minLength={10} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your mobile number" className="text-lg p-6 border-2 focus:border-accent" />
                </div>
                <div className="space-y-2">
                  <Label className="text-lg flex items-center gap-2">
                    <Film className="w-5 h-5 text-accent" /> Shows
                  </Label>
                  <div>
                    
{movie.shows
  ?.filter((show) => {
  // Parse show date
  const showDate = new Date(show.date); 
  //parse show time 
  const [hours,minutes]=show.time.split(':')
  
  //show date + time
  const showDateTime=new Date(showDate);
  showDateTime.setHours(hours,minutes,0,0)
  console.log(showDateTime)

  //current date+time
  const now=new Date();

  if(showDateTime>=now){
  return true;
  }
  
  else false;
})

  .map((show, index) => (
    <button
      key={index}
      onClick={() => {
        setSelectedShowId(index);
        setSelectedDate(show.date);
        setSelectedTime(show.time);
      }}
      className={`m-2 px-6 border rounded-lg p-3 text-center cursor-pointer transition-all ${
        selectedShowId === index
          ? "bg-accent text-white border-accent"
          : "bg-background border-border hover:border-accent"
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

            {/* Payment Card */}
            <Card className="border-2 border-border hover:border-accent/50 transition-colors shadow-xl animate-slide-up">
              <CardHeader className="bg-gradient-to-r from-secondary to-cinema-black text-white">
                <CardTitle className="text-3xl flex items-center gap-3 tracking-[2px]">
                  <CreditCard className="w-8 h-8" /> PAYMENT METHOD
                </CardTitle>
              </CardHeader>
              <CardContent className=" md:p-6 space-y-4 ">
                <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:gap-4 mb-6">
  {["online", "video"].map((type) => (
    <button
      key={type}
      onClick={() => setTicketType(type)}
      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg border-2 transition-all duration-200
        ${ticketType === type ? "bg-accent text-white border-accent" : "bg-background border-border hover:border-accent"}`}
    >
      {type === "online"
        ? "Online Payment"
        : type === "video"
        ? "Video Speed"
        : "others"}
    </button>
  ))}
</div>


                {ticketType && (
                  // <div className="space-y-4 border-2 border-border rounded-lg p-6">
                  //   <div className="flex justify-between items-center">
                  //     <Label className="text-lg font-semibold">Adult (SEK{ticketPrice.adult})</Label>
                  //     <div className="flex items-center gap-2">
                  //       <button onClick={() => setAdult(Math.max(adult - 1, 0))} className="px-3 py-1 bg-gray-200 rounded">-</button>
                  //       <span className="w-8 text-center">{adult}</span>
                  //       <button onClick={() => setAdult(adult + 1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
                  //     </div>
                  //   </div>
                  //   <div className="flex justify-between items-center">
                  //     <Label className="text-lg font-semibold">Kids (SEK{ticketPrice.kids})</Label>
                  //     <div className="flex items-center gap-2">
                  //       <button onClick={() => setKids(Math.max(kids - 1, 0))} className="px-3 py-1 bg-gray-200 rounded">-</button>
                  //       <span className="w-8 text-center">{kids}</span>
                  //       <button onClick={() => setKids(kids + 1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
                  //     </div>
                  //   </div>
                  //   <p className="text-lg font-semibold mt-2">Total Seats: {totalSeatsSelected}</p>
                  //   <div className="pt-4 border-t-2 border-border mt-4">
                  //     <div className="flex justify-between items-center p-4 bg-accent/10 rounded-lg">
                  //       <span className="text-xl font-bold">Total Amount:</span>
                  //       <span className="text-2xl font-bold text-accent">SEK{calculateTotal()}</span>
                  //     </div>
                  //   </div>
                  // </div>
                  <div className="space-y-6 border-2 border-border rounded-lg p-4 sm:p-6">
  {/* Adult Ticket */}
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
    <Label className="text-lg font-semibold mb-2 sm:mb-0">
      Adult (SEK{ticketPrice.adult})
    </Label>
    <div className="flex justify-center sm:justify-start items-center gap-2">
      <button
        onClick={() => setAdult(Math.max(adult - 1, 0))}
        className="px-4 py-2 bg-gray-200 rounded text-lg sm:text-base"
      >
        -
      </button>
      <span className="w-10 text-center text-lg">{adult}</span>
      <button
        onClick={() => setAdult(adult + 1)}
        className="px-4 py-2 bg-gray-200 rounded text-lg sm:text-base"
      >
        +
      </button>
    </div>
  </div>

  {/* Kids Ticket */}
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
    <Label className="text-lg font-semibold mb-2 sm:mb-0">
      Kids (SEK{ticketPrice.kids})
    </Label>
    <div className="flex justify-center sm:justify-start items-center gap-2">
      <button
        onClick={() => setKids(Math.max(kids - 1, 0))}
        className="px-4 py-2 bg-gray-200 rounded text-lg sm:text-base"
      >
        -
      </button>
      <span className="w-10 text-center text-lg">{kids}</span>
      <button
        onClick={() => setKids(kids + 1)}
        className="px-4 py-2 bg-gray-200 rounded text-lg sm:text-base"
      >
        +
      </button>
    </div>
    
     
    
  </div>

  {/* Total Seats */}
  <p className="text-lg font-semibold text-center sm:text-left">
    Total Seats: {totalSeatsSelected}
  </p>

  {/* Total Amount */}
  <div className="pt-4 border-t-2 border-border mt-4">
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-accent/10 rounded-lg gap-2 sm:gap-0">
      <span className="text-xl font-bold">Total Amount:</span>
      <span className="text-2xl font-bold text-accent">SEK{calculateTotal()}</span>
    </div>
  </div>
</div>

                )}
              </CardContent>
            </Card>

            {/* Selected Seats Card */}
            <Card className="border-2 border-accent shadow-xl animate-slide-up">
  <CardContent className="p-6">
    <Label className="text-foreground text-lg font-semibold mb-3 block">
      Selected Seats
    </Label>

   <div className="p-4 bg-muted rounded-lg min-h-[80px] flex items-center justify-center">
  {selectedSeats.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {selectedSeats
        .sort((a, b) => a - b)
        .map((seat) => {
          // flatten all seat layout sets to count total rows
          const seatsPerRow = seatLayoutSets.flat();

          // find which row this seat belongs to
          let totalSeatsCounted = 0;
          let rowIndex = 0;
          for (let i = 0; i < seatsPerRow.length; i++) {
            totalSeatsCounted += seatsPerRow[i];
            if (seat <= totalSeatsCounted) {
              rowIndex = i;
              break;
            }
          }

          // row number (1-based)
          const rowNumber = rowIndex + 1;

          // keep the original seat number
          const seatLabel = `${rowNumber}-${seat}`;

          return (
            <span
              key={seat}
              className="px-4 py-2 bg-seat-selected text-white rounded-lg font-bold text-lg shadow-lg"
            >
              {seatLabel}
            </span>
          );
        })}
    </div>
  ) : (
    <p className="text-muted-foreground text-lg">No seats selected</p>
  )}
</div>

  </CardContent>
</Card>


          {/* OTP Section */}
               <div className="mb-4 space-y-3">
                    <Label htmlFor="otp" className="text-lg flex items-center gap-2">
                      OTP
                    </Label>

                    {/* Input field for entering OTP */}
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="text-lg p-4 border-2 focus:border-accent"
                      disabled={!otpSent || otpVerified} // disable until OTP is sent or already verified
                    />

                    <div className="flex gap-3">
                      {/* Send OTP Button */}
                      <Button
                        onClick={sendOtp}
                        className="bg-accent text-white flex-1"
                        
                      >
                        {otpSent ? "Resent OTP" : "Send OTP"}
                      </Button>

                      {/* Verify OTP Button */}
                      <Button
                        onClick={verifyOtp}
                        className="bg-green-600 text-white flex-1"
                        disabled={!otpSent || otpVerified || otp.length !== 6} // disable if OTP not sent, verified, or invalid length
                      >
                        {otpVerified ? "Verified" : "Verify OTP"}
                      </Button>
                    </div>

                    {/* Optional status message */}
                    {otpVerified && (
                      <p className="text-green-600 font-medium mt-2">
                        OTP Verified! You can now proceed.
                      </p>
                    )}
                  </div>



            <Button
              onClick={handleBooking}
              className="w-full bg-accent hover:bg-accent/90 text-white font-bold text-2xl py-8 rounded-xl shadow-2xl cinema-glow hover:scale-105 transition-all duration-300"
              size="lg"
              disabled={!otpVerified} // prevent booking until OTP is verified
            >
              Book Now
            </Button>

          </div>

          {/* Seat Layout */}
          {/* <div className="lg:col-span-3">
            <Card className="border-2 border-border shadow-2xl animate-scale-in h-full">
              <CardHeader className="bg-gradient-to-r from-cinema-black to-secondary text-white">
                <CardTitle className="text-3xl tracking-[2px]">Select Your Seats</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-12">
                  <div className="bg-gradient-to-r from-transparent via-accent to-transparent h-1 rounded-full mb-3 shadow-lg cinema-glow"></div>
                  <p className="text-center text-lg font-bold text-foreground tracking-wider">THIS IS THE SCREEN</p>
                </div>

                <div className="space-y-2 overflow-auto max-h-[700px] px-2">
                  {seatLayoutSets.map((set, setIndex) => {
                    const maxCols = Math.max(...set);
                    return set.map((cols, rowIndex) => (
                      <div key={`set${setIndex}-${rowIndex}`} className="flex flex-col items-center">
                        <div className="flex gap-1 items-center justify-center w-full">
                          <span className="text-xs text-muted-foreground font-bold w-8 text-right mr-2">{currentSeatNumber}</span>
                          {Array.from({ length: maxCols }, (_, seatIndex) => {
                            if (seatIndex < Math.floor((maxCols - cols) / 2) || seatIndex >= Math.floor((maxCols - cols) / 2) + cols) {
                              return <div key={`empty-${setIndex}-${rowIndex}-${seatIndex}`} className="w-8 h-8" />;
                            }
                            const seatNumber = currentSeatNumber++;
                            return (
                              <button
                                key={seatNumber}
                                onClick={() => handleSeatClick(seatNumber)}
                                className={`w-8 h-8 text-[11px] rounded ${getSeatColor(seatNumber)} 
                                  hover:opacity-80 transition-all duration-200 font-bold text-white 
                                  flex items-center justify-center shadow hover:scale-110 hover:shadow-lg`}
                                disabled={bookedSeats.includes(seatNumber)}
                              >
                                {seatNumber}
                              </button>
                            );
                          })}
                          <span className="text-xs text-muted-foreground font-bold w-8 text-left ml-2">{currentSeatNumber - 1}</span>
                        </div>
                      </div>
                    ));
                  })}
                </div>
              </CardContent>
            </Card>
          </div> */}
          <div className="lg:col-span-3">
  <Card className="border-2 border-border shadow-2xl animate-scale-in h-full max-w-full mx-auto">
    <CardHeader className="bg-gradient-to-r from-cinema-black to-secondary text-white">
      <CardTitle className="text-2xl sm:text-3xl tracking-[2px] text-center sm:text-left">
        Select Your Seats
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 sm:p-6">
      <div className="mb-8 sm:mb-12">
        <div className="bg-gradient-to-r from-transparent via-accent to-transparent h-1 rounded-full mb-2 sm:mb-3 shadow-lg cinema-glow"></div>
        <p className="text-center text-base sm:text-lg font-bold text-foreground tracking-wider">
          THIS IS THE SCREEN
        </p>
      </div>

      {/* Scrollable seat layout */}
    <div className="overflow-x-auto w-full">
  <div className="inline-block min-w-max px-1 sm:px-2 space-y-2">
    {seatLayoutSets.map((set, setIndex) => {
      const maxCols = Math.max(...set);

      // Count total rows before this set
      const previousRows = seatLayoutSets
        .slice(0, setIndex)
        .reduce((acc, prevSet) => acc + prevSet.length, 0);

      return set.map((cols, rowIndex) => {
        // Row number (1, 2, 3...)
        const rowNumber = previousRows + rowIndex + 1;

        return (
          <div
            key={`set${setIndex}-${rowIndex}`}
            className={`flex justify-center items-center gap-1 sm:gap-2 ${
              rowIndex === 7 ? "mb-6 sm:mb-8 md:mb-10 lg:mb-10" : ""
            }`}
          >
            {/* Left row number */}
            <span className="text-xs sm:text-sm text-muted-foreground font-bold w-6 sm:w-8 text-right">
              {rowNumber}
            </span>

            {/* Seats */}
            {Array.from({ length: maxCols }, (_, seatIndex) => {
              if (
                seatIndex < Math.floor((maxCols - cols) / 2) ||
                seatIndex >= Math.floor((maxCols - cols) / 2) + cols
              ) {
                return (
                  <div
                    key={`empty-${setIndex}-${rowIndex}-${seatIndex}`}
                    className="w-6 sm:w-8 h-6 sm:h-8"
                  />
                );
              }
              const seatNumber = currentSeatNumber++;
              return (
                <button
  key={seatNumber}
  onClick={() => handleSeatClick(seatNumber)}
  className={`w-6 sm:w-8 h-6 sm:h-8 text-[9px] sm:text-[11px] rounded ${getSeatColor(seatNumber)}
    hover:opacity-80 transition-all duration-200 font-bold text-white flex items-center justify-center shadow`}
  disabled={bookedSeats.includes(seatNumber)} // cannot click booked seats
>
  {seatNumber}
</button>

              );
            })}

            {/* Right row number */}
            <span className="text-xs sm:text-sm text-muted-foreground font-bold w-6 sm:w-8 text-left">
              {rowNumber}
            </span>
          </div>
        );
      });
    })}
  </div>
</div>



    </CardContent>
  </Card>
</div>

        </div>
      </div>

      {/* QR Code Modal */}
      {/* QR Code Modal */}
{/* <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
  <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 text-center">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold">Your Booking QR Code</DialogTitle>
    </DialogHeader>

    {bookingData && (
      <div className="flex flex-col items-center gap-4 mt-4">
        <QRCodeSVG
          value={JSON.stringify({
            name,
            email,
            paymentStatus: "pending",
            qrdata
          })}
          size={200}
        />
        <p className="text-lg font-semibold">Movie: {qrdata.data.movieName}</p>
        <p className="text-lg font-semibold">Booking ID: {qrdata.data.bookingId}</p>
        <p className="text-lg font-semibold">seatNumbers: {qrdata.data.seatNumbers.join(", ")}</p>
        <p className="text-lg font-semibold">totalAmount : {qrdata.data.totalAmount}</p>
        <Button onClick={() => setShowQRModal(false)} className="mt-4 bg-accent text-white">
          Close
        </Button>
      </div>
    )}
  </DialogContent>
</Dialog> */}
<Dialog open={showQRModal} onOpenChange={setShowQRModal}>
  <DialogContent className="w-full max-w-sm sm:max-w-[400px] rounded-2xl p-6 text-center">
    <DialogHeader>
      <DialogTitle className="text-xl sm:text-2xl font-bold">Your Booking QR Code</DialogTitle>
    </DialogHeader>

    {/* {bookingData && (
      <div className="flex flex-col items-center gap-4 mt-4">
        <QRCodeSVG
          value={JSON.stringify({
            name,
            email,
            paymentStatus: "pending",
            qrdata
          })}
          size={Math.min(window.innerWidth * 0.6, 200)} // scales QR on small screens
        />
        <p className="text-sm sm:text-lg font-semibold">Movie: {qrdata.data.movieName}</p>
        <p className="text-sm sm:text-lg font-semibold">Booking ID: {qrdata.data.bookingId}</p>
        <p className="text-sm sm:text-lg font-semibold">Seats: {qrdata.data.seatNumbers.join(", ")}</p>
        <p className="text-sm sm:text-lg font-semibold">Total Amount: SEK{qrdata.data.totalAmount}</p>
        <Button onClick={() => setShowQRModal(false)} className="mt-4 bg-accent text-white">
          Close
        </Button>
      </div>
    )} */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "15px", marginTop: "20px" }}>
  <button
    style={{
      padding: "10px 20px",
      fontSize: "16px",
      cursor: "pointer",
      backgroundColor: "#e50914",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
    }}
  >
    Your QR Code
  </button>

  {qr && (
    <>
      <img
        src={qr}
        alt="QR Code"
        style={{ width: "200px", height: "200px", border: "2px solid #e50914", borderRadius: "10px" }}
      />

      <div
        style={{
          marginTop: "10px",
          backgroundColor: "#1c1c1c",
          color: "#fff",
          padding: "15px",
          borderRadius: "10px",
          width: "250px",
        }}
      >
        <h3 style={{ color: "#e50914", marginBottom: "10px" }}>🎬 Enjoy Your Movie! 🎟️</h3>
        <p style={{ margin: "4px 0" }}><strong>Movie:</strong> {movie.title}</p>
        <p style={{ margin: "4px 0" }}><strong>Date:</strong> {formatDate(selectedDate)}</p>
        <p style={{ margin: "4px 0" }}><strong>Time:</strong> {formatTime(selectedTime)}</p>
        <p style={{ margin: "4px 0" }}><strong>Total Amount:</strong> SEK{bookingData.totalAmount}</p>
        <p style={{ margin: "4px 0" }}><strong>Booking Type:</strong>{bookingData.ticketType}</p>
       <p style={{ margin: "4px 0" }}>
  <strong>Booking Seats:</strong> {bookingData?.seatNumbers?.map(seat => `Seat-${seat}`).join(", ")}
</p>

      </div>
    </>
  )}
</div>

  </DialogContent>
</Dialog>


    </div>
  );
};

export default BookTicket;

