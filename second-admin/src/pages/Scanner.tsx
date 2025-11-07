import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { CheckCircle2, QrCode, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { error } from "console";

const Scanner = () => {
  const backend_url = "http://localhost:8004";

  const [showModal, setShowModal] = useState(false);
  const [updated, setUpdated] = useState<any>(null);
  const [scannedList, setScannedList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const lastScanRef = useRef<string | null>(null);
  const scanLock = useRef(false);



  // ✅ Format date and time nicely
// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Format time
const formatTime = (timeStr: string) => {
  const date = new Date(`1970-01-01T${timeStr}`); // just time part
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};


  // ✅ Handle QR scan
  const handleScan = async (decodedText: string) => {
    if (scanLock.current || !decodedText) return;
    scanLock.current = true;

    try {
      const bookingData = JSON.parse(decodedText);
      if (lastScanRef.current === bookingData.bookingId) return;
      lastScanRef.current = bookingData.bookingId;

      setLoading(true);

      let fetchedData = bookingData;
      try {
        const res = await axios.get(
          `${backend_url}/api/bookingid/${bookingData.bookingId}`
        );
        console.log("Backend fetch successful:", res.data);
        fetchedData = res.data.data;
      } catch (err) {
        console.error("Backend fetch failed:", err);
      } finally {
        setUpdated(fetchedData);
        setLoading(false);
        setShowModal(true);
      }

      setScannedList((prev) => {
        const exists = prev.find(
          (item) => item.bookingId === fetchedData.bookingId
        );
        if (exists) {
          return prev.map((item) =>
            item.bookingId === fetchedData.bookingId
              ? { ...item, paymentStatus: fetchedData.paymentStatus }
              : item
          );
        }
        return [{ ...fetchedData }, ...prev.slice(0, 29)];
      });

      toast.success(`✅ Scanned: ${bookingData.bookingId}`);
    } catch (err) {
      console.error(err);
      toast.error("Invalid QR code format!");
    } finally {
      setTimeout(() => (scanLock.current = false), 300);
      setTimeout(() => (lastScanRef.current = null), 500);
    }
  };

  // ✅ Initialize scanner
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 20, qrbox: 250, rememberLastUsedCamera: true, aspectRatio: 1.0 },
      false
    );

    scanner.render(
      (decodedText) => handleScan(decodedText),
      (error) => {
        if (!error.includes("NotFoundException")) console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch((err) => console.error("Cleanup error:", err));
    };
  }, []);

  const displayData = updated;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-tight flex items-center justify-center gap-2">
          <QrCode className="w-8 h-8 text-blue-600" /> Smart QR Ticket Scanner
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Scan tickets and verify instantly
        </p>
      </div>

      <div
        id="reader"
        className="rounded-2xl overflow-hidden shadow-xl border border-blue-200 bg-white"
        style={{ width: "100%" }}
      ></div>

      {loading && (
        <p className="text-center text-sm mt-3 text-blue-600 animate-pulse font-medium">
          Verifying ticket...
        </p>
      )}

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg w-full p-5 sm:p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-green-600 text-2xl font-bold">
              <CheckCircle2 className="h-7 w-7" /> Ticket Verified
            </DialogTitle>
          </DialogHeader>

          {displayData && (
            <div className="mt-4 space-y-4 max-h-[65vh] overflow-y-auto px-1 sm:px-2">
              <div className="bg-blue-100 border-l-4 border-blue-500 px-4 py-3 rounded-lg flex justify-between items-center">
                <span className="font-semibold text-blue-800">Booking ID:</span>
                <span className="font-bold text-blue-900">
                  {displayData.bookingId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Name", displayData.name],
                  ["Email", displayData.email],
                  ["Movie", displayData.movieName],
                  ["Date", formatDate(displayData.date)],
                  ["Time", formatTime(displayData.timing)],
                  ["Ticket Type", displayData.ticketType],
                  ["Adult", displayData.adult],
                  ["Extras", displayData.kids],
                 [
  "Seats",
  displayData.seatNumbers
    ?.map((s: { seat: number; row: number }) => `Row ${s.row} - Seat ${s.seat}`)
    .join(", "),
],

                  ["Total Seats", displayData.totalSeatsSelected],
                  ["Total Amount", `SEK ${displayData.totalAmount}`],
                ].map(([label, value], i) => (
                  <div
                    key={i}
                    className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                  >
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {value}
                    </p>
                  </div>
                ))}

                {/* Payment Section */}
                <div className="col-span-2 p-3 bg-gray-100 rounded-xl border border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p
                      className={`font-bold text-lg ${
                        displayData.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {displayData.paymentStatus?.toUpperCase()}
                    </p>
                  </div>

                  {/* ✅ Buttons */}
                  {displayData.paymentStatus === "pending" && (
  <>
    {/* ✅ If current collector type matches */}
    {localStorage.getItem("collectorType") === displayData.ticketType ? (
      <Button
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
        onClick={async () => {
          try {
            const storedCollectorType = localStorage.getItem("collectorType") || "";
            const collectorId = localStorage.getItem("id") || "";

            await axios.put(
              `${backend_url}/dashboard/booking/${displayData.bookingId}/status`,
              {
                paymentStatus: "paid",
                collectorType: storedCollectorType,
                collectorId,
              }
            );

            setUpdated({
              ...displayData,
              paymentStatus: "paid",
            });

            toast.success("✅ Marked as PAID!");
          } catch {
            toast.error("Failed to update payment!");
          }
        }}
      >
        <CheckCircle2 className="w-5 h-5" /> Mark as Paid
      </Button>
    ) : (
      <>
        {/* ✅ If preview not shown yet */}
        {!showPreview ? (
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={async () => {
              try {
                const res = await axios.get(`${backend_url}/collectors/previewchange`, {
                  params: {
                    bookingid: displayData.bookingId,
                    collector: localStorage.getItem("collectorType"),
                  },
                });
                setPreviewData(res.data);
                console.log(res.data);
                setShowPreview(true);
                toast.info("Preview loaded");
              } catch {
                toast.error("Preview failed");
              }
            }}
          >
            🔁  Change Amount

          </Button>
        ) : (
          <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-400 rounded-2xl text-sm shadow-sm transition-all duration-200">
            <h3 className="text-lg font-bold text-yellow-700 mb-3 flex items-center gap-2">
              ⚙️ Approve Amount 

            </h3>

            <div className="grid grid-cols-2 gap-3 text-gray-800">
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Current Collector</p>
                <p className="font-semibold">{displayData.ticketType}</p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">New Collector</p>
                <p className="font-semibold text-yellow-700">
                  {previewData?.preview?.newCollectorType ||
                    localStorage.getItem("collectorType")}
                </p>
              </div>

              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Current Adult Price</p>
                <p className="font-semibold">
                  SEK {previewData?.preview?.currentAdultPrice}
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">New Adult Price</p>
                <p className="font-semibold text-yellow-700">
                  SEK {previewData?.preview?.newAdultPrice}
                </p>
              </div>

              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Current extras Price</p>
                <p className="font-semibold">
                  SEK {previewData?.preview?.currentKidsPrice}
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">New extras Price</p>
                <p className="font-semibold text-yellow-700">
                  SEK {previewData?.preview?.newKidsPrice}
                </p>
              </div>

              <div className="col-span-2 p-2 bg-white rounded-lg border border-gray-300 text-center">
                <p className="text-xs text-gray-500">Total Comparison</p>
                <p className="font-semibold text-gray-800">
                  {`SEK ${previewData?.preview?.currentTotalAmount} → `}
                  <span className="text-yellow-700 font-bold">
                    SEK {previewData?.preview?.newTotalAmount}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold flex-1 py-2"
                onClick={async () => {
                  try {
                    const res = await axios.put(`${backend_url}/collectors/changecollector`, {
                      bookingid: displayData.bookingId,
                      collector: localStorage.getItem("collectorType"),
                    });

                    setUpdated({
                      ...displayData,
                      collectorType: res.data.updatedBooking.collectorType,
                      ticketType: res.data.updatedBooking.ticketType,
                      totalAmount: res.data.updatedBooking.totalAmount,
                    });

                    toast.success("✅ Collector updated successfully!");
                    setShowPreview(false);
                  } catch {
                    toast.error("Failed to change collector!");
                   
                  }
                }}
              >
                <CheckCircle2 className="w-5 h-5" /> Confirm Change
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-100 text-gray-700 flex-1"
                onClick={() => setShowPreview(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </>
    )}
  </>
)}

                </div>
              </div>

             {/* 🍿 Snack Orders Section */}
<div className="mt-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-400 rounded-xl p-4">
  <h3 className="text-lg font-bold text-yellow-700 mb-3 flex items-center gap-2">
    🍿 Snack Orders
  </h3>

  {displayData?.bookingId && (
    <SnackDetails bookingId={displayData.bookingId} backend_url={backend_url} />
  )}
</div>

<Button
  onClick={() => setShowModal(false)}
  className="w-full mt-5 bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-lg font-semibold py-2"
>
  Close
</Button>

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ History */}
      <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-3 max-h-72 overflow-y-auto">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">
          Scanned Tickets
        </h3>

        {scannedList.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            No tickets scanned yet.
          </p>
        ) : (
          scannedList.map((data, idx) => (
            <div
              key={idx}
              className="p-2 border-b last:border-b-0 flex justify-between items-center"
            >
              <div>
                <span className="font-bold text-gray-800">
                  {data.bookingId}
                </span>{" "}
                <span className="text-gray-500 text-sm">- {data.name}</span>
              </div>
              <span
                className={`font-semibold text-sm ${
                  data.paymentStatus === "paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {data.paymentStatus?.toUpperCase() || "PENDING"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Scanner;



// ✅ Subcomponent: Fetch + Display snack details
const SnackDetails = ({ bookingId, backend_url }: { bookingId: string; backend_url: string }) => {
  const [snacks, setSnacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");

  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const res = await axios.get(`${backend_url}/snacksorder/get/${bookingId}`);
        if (res.data?.orders?.length > 0) {
          const order = res.data.orders[0];
          setSnacks(order.items);
          setPaymentStatus(order.paymentStatus);
        } else {
          setError("No snack orders found for this booking.");
        }
      } catch (err) {
        console.error("Error fetching snacks:", err);
        setError("No snack orders found for this booking.");
      } finally {
        setLoading(false);
      }
    };

    fetchSnacks();
  }, [bookingId]);

  const handleMarkSnackPaid = async () => {
    try {
      await axios.put(`${backend_url}/snacksorder/updatepayment/${bookingId}`, {
  collectorType: localStorage.getItem("collectorType"),
  collectorId: localStorage.getItem("id"),
});

      setPaymentStatus("paid");
      toast.success("✅ Snack payment marked as PAID!");
    } catch {
      toast.error("Failed to update snack payment!");
    }
  };

  if (loading)
    return <p className="text-sm text-gray-500 italic">Loading snack details...</p>;

  if (error)
    return <p className="text-sm text-gray-500 italic">{error}</p>;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {snacks.map((item, i) => (
          <div
            key={i}
            className="p-3 bg-white rounded-lg border border-yellow-300 shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500">
                Qty: {item.qty} × SEK {item.price} ={" "}
                <span className="font-medium">SEK {item.lineTotal}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="font-semibold text-gray-700">
          Status:{" "}
          <span
            className={
              paymentStatus === "paid" ? "text-green-600" : "text-red-600"
            }
          >
            {paymentStatus.toUpperCase()}
          </span>
        </p>

        {paymentStatus === "pending" && (
          <Button
            onClick={handleMarkSnackPaid}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Mark Snack as Paid
          </Button>
        )}
      </div>
    </div>
  );
};
