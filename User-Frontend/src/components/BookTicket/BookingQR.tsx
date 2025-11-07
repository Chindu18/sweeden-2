"use client";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

interface BookingQRProps {
  open: boolean;
  onClose: () => void;
  bookingData: any;
}

const BookingQR: React.FC<BookingQRProps> = ({ open, onClose, bookingData }) => {
  if (!bookingData) return null;

  const qrCode = bookingData.qrCode;
  const bookingId = bookingData.bookingId || bookingData.data?.bookingId;
  const data = bookingData.data || {};

  // ✅ Format seat numbers
  const formattedSeats =
    data.seatNumbers && Array.isArray(data.seatNumbers)
      ? data.seatNumbers.map((s: any) => `R${s.row}-S${s.seat}`).join(", ")
      : "N/A";

  // ✅ Format date
  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  // ✅ Format time (handles "16:00" → "4:00 PM")
  const formattedTime = data.timing
    ? new Date(`1970-01-01T${data.timing}:00`).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[90%] sm:w-[400px] max-w-md p-0 
          overflow-hidden rounded-2xl shadow-2xl border-0 bg-white 
          max-h-[90vh] flex flex-col
        "
      >
        {/* Scrollable Body */}
        <div className="overflow-y-auto">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#007bff] via-[#00c6ff] to-[#00e0a8] text-white">
            <h2 className="font-extrabold text-xl">
              {data.movieName || "Unknown Movie"}
            </h2>
            <p className="text-sm font-medium mt-1">
              {formattedDate} | {formattedTime}
            </p>
            <p className="text-xs opacity-80 mt-1">
              {data.theatreName || "Tamil Film Sweden"}
            </p>
          </div>

          {/* Info Line */}
          <div className="px-4 py-2 text-center text-gray-500 text-xs sm:text-sm border-b bg-gray-50">
            Tap for support or booking details
          </div>

          {/* QR + Info */}
          <div className="flex flex-col items-center py-5 px-3 bg-white text-sm">
            {qrCode ? (
              <img
                src={
                  qrCode.startsWith("data:image")
                    ? qrCode
                    : `data:image/png;base64,${qrCode}`
                }
                alt="QR Code"
                className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg border p-2"
              />
            ) : (
              <QRCodeSVG value={bookingId || "No Booking ID"} size={150} />
            )}

            <div className="mt-4 text-center space-y-1">
              {data.screen && (
                <p className="text-gray-700 font-semibold">{data.screen}</p>
              )}

              <p className="text-gray-600 font-medium">
                🎟 Seats:{" "}
                <span className="text-gray-800 font-semibold">
                  {formattedSeats}
                </span>
              </p>

              {data.totalSeatsSelected && (
                <p className="text-gray-500 text-sm">
                  Total Seats:{" "}
                  <span className="font-semibold text-gray-700">
                    {data.totalSeatsSelected}
                  </span>
                </p>
              )}

              {data.totalAmount && (
                <p className="text-gray-600 text-sm">
                  💰 Total Amount:{" "}
                  <span className="font-semibold text-gray-800">
                    SEK {data.totalAmount}
                  </span>
                </p>
              )}

              {(data.adult || data.kids) && (
                <p className="text-gray-500 text-xs">
                  Adults: {data.adult || 0} | Extras: {data.kids || 0}
                </p>
              )}

              {data.name && (
                <p className="text-gray-500 text-xs">Name: {data.name}</p>
              )}

              {bookingId && (
                <p className="text-gray-600 text-md mt-1">
                  Booking ID: {bookingId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 text-center text-[11px] sm:text-xs text-gray-400 border-t bg-gray-50">
          Cancellation not available for this venue
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingQR;
