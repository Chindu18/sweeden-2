

// // import { useState, useRef } from "react";
// // import { QrReader } from "react-qr-reader";
// // import { Button } from "@/components/ui/button";
// // import { CheckCircle2, Camera } from "lucide-react";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// // import { toast } from "sonner";
// // import axios from "axios";

// // const Scanner = () => {

// //   const backend_url='http://localhost:8004'
// //   const [scannedList, setScannedList] = useState<any[]>([]);
// //   const [showModal, setShowModal] = useState(false);
// //   const [currentScan, setCurrentScan] = useState<any>(null);
// //   const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
// //   const[bookingdata,setbookingdata]=useState<any[]>([])
// //   const[updated,setupdated]=useState<any>({})

// //   const lastScanRef = useRef<string | null>(null);

// //   const handleScan = async(result: any) => {
// //     if (!result) return;

// //     try {
// //       const parsed = JSON.parse(result?.text || result);
// //       const bookingData = parsed.qrdata.data;
// //       setbookingdata(bookingData)
// //       console.log(bookingData)
// //      try {
// //        const res= await axios.get(`${backend_url}/api/bookingid/${bookingData.bookingId}`)
// //        setupdated(res.data.data);
// //      console.log(res.data.data)
      

// //      } catch (error) {
// //       console.log(error)
// //      }
    

// //       if (lastScanRef.current === bookingData.bookingId) return; // prevent duplicate
// //       lastScanRef.current = bookingData.bookingId;

// //       setCurrentScan(parsed);
// //       console.log(currentScan);

// //       setShowModal(true);
// //       toast.success(`QR Scanned: ${bookingData.bookingId}`);

// //       setScannedList(prev => [parsed, ...prev]);
// //       console.log(scannedList);
// //       setTimeout(() => (lastScanRef.current = null), 500); // allow next scan
// //     } catch (err) {
// //       console.log(err);
// //       toast.error("Invalid QR code format!");
// //     }
// //   };

// //   return (
// //     <div className="p-4 max-w-md mx-auto min-h-screen bg-gray-50">
// //       <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">QR Scanner</h1>

// //       <div className="border rounded-lg overflow-hidden shadow-md">
// //         <QrReader
// //           constraints={{ facingMode }}
// //           scanDelay={200}
// //           onResult={(result) => handleScan(result)}
// //           videoContainerStyle={{ width: "100%", height: 400 }}
// //         />
// //       </div>

// //       <div className="flex justify-center mt-4">
// //         <Button
// //           onClick={() =>
// //             setFacingMode(facingMode === "user" ? "environment" : "user")
// //           }
// //           className="flex items-center gap-2"
// //         >
// //           <Camera className="h-4 w-4" /> Switch Camera
// //         </Button>
// //       </div>

// //       {/* Modal */}
// //       <Dialog open={showModal} onOpenChange={setShowModal}>
// //         <DialogContent className="sm:max-w-md w-full p-4 max-h-[80vh]">
// //           <DialogHeader>
// //             <DialogTitle className="flex items-center gap-2 text-green-600 text-xl">
// //               <CheckCircle2 className="h-6 w-6" /> Ticket Verified
// //             </DialogTitle>
// //           </DialogHeader>

// //           {updated && (
// //             <div className="mt-4 space-y-4 max-h-[65vh] overflow-y-auto px-2 sm:px-4">
// //               <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-sm flex justify-between items-center">
// //                 <span className="font-semibold text-blue-800">Booking ID:</span>
// //                 <span className="font-bold text-blue-900">
// //                   {updated.bookingId}
// //                 </span>
// //               </div>

// //               <div className="grid grid-cols-2 gap-2 sm:gap-4">
// //                 <div className="p-2 bg-gray-50 rounded-md shadow-sm">
// //                   <span className="text-gray-600">Name</span>
// //                   <p className="font-semibold text-gray-800">{updated.name}</p>
// //                 </div>
// //                 <div className="p-2 bg-gray-50 rounded-md shadow-sm">
// //                   <span className="text-gray-600">Email</span>
// //                   <p className="font-semibold text-gray-800">{updated.email}</p>
// //                 </div>
// //                 <div className="p-2 bg-gray-50 rounded-md shadow-sm">
// //                   <span className="text-gray-600">Seats</span>
// //                   <p className="font-semibold text-gray-800">{updated.seatNumbers.join(", ")}</p>
// //                 </div>
// //                 <div className="p-2 bg-gray-50 rounded-md shadow-sm">
// //                   <span className="text-gray-600">Amount</span>
// //                   <p className="font-semibold text-gray-800">${updated.totalAmount}</p>
// //                 </div>
// //                 <div className="p-2 bg-gray-50 rounded-md shadow-sm col-span-2">
// //                   <span className="text-gray-600">Payment Status</span>
// //                   <p className={`font-bold ${updated.paymentStatus === "paid" ? "text-green-600" : "text-red-600"}`}>
// //                     {updated.paymentStatus.toUpperCase()}
// //                   </p>
// //                 </div>
// //               </div>

// //               <Button
// //                 onClick={() => setShowModal(false)}
// //                 className="w-full mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300"
// //               >
// //                 Close
// //               </Button>
// //             </div>
// //           )}
// //         </DialogContent>
// //       </Dialog>

// //       {/* Scanned History */}
// //       <div className="mt-4 max-h-64 overflow-y-auto border rounded-md p-2 bg-white shadow-sm">
// //         {scannedList.map((item, idx) => (
// //           <div key={idx} className="p-2 border-b last:border-b-0">
// //             <span className="font-bold">{item.qrdata.data.bookingId}</span> - {item.qrdata.data.name} - <span className={`${item.qrdata.data.paymentStatus==="paid"?"text-green-600":"text-red-600"}`}>{item.qrdata.data.paymentStatus}</span>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Scanner;



// import { useState, useRef, useEffect } from "react";
// import { QrReader } from "react-qr-reader";
// import { Button } from "@/components/ui/button";
// import { CheckCircle2, Camera } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { toast } from "sonner";
// import axios from "axios";

// const Scanner = () => {
//   const backend_url = 'https://swedenn-backend.onrender.com';

//   const [scannedList, setScannedList] = useState<any[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [currentScan, setCurrentScan] = useState<any>(null);
//   const [updated, setUpdated] = useState<any>(null);
//   const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

//   const lastScanRef = useRef<string | null>(null);

//   // Debugging state updates
//   useEffect(() => {
//     if (updated) console.log("Backend data:", updated);
//   }, [updated]);

//   useEffect(() => {
//     if (scannedList.length > 0) console.log("Scanned list:", scannedList);
//   }, [scannedList]);

//   const handleScan = async (result: any) => {
//     if (!result) return;

//     try {
//       const parsed = JSON.parse(result?.text || result);
//       const bookingData = parsed.qrdata.data;

//       // Prevent duplicate scan
//       if (lastScanRef.current === bookingData.bookingId) return;
//       lastScanRef.current = bookingData.bookingId;

//       setCurrentScan(parsed);

//       // Fetch backend verified booking
//       try {
//         const res = await axios.get(`${backend_url}/api/bookingid/${bookingData.bookingId}`);
//         setUpdated(res.data.data);
//       } catch (err) {
//         console.log("Backend fetch failed, using QR data:", err);
//         setUpdated(bookingData); // fallback to QR data
//       }

//       // Show modal and toast
//       setShowModal(true);
//       toast.success(`QR Scanned: ${bookingData.bookingId}`);

//       // Update scanned list
//       setScannedList(prev => [parsed, ...prev]);

//       // Allow next scan after short delay
//       setTimeout(() => (lastScanRef.current = null), 500);
//     } catch (err) {
//       console.log("Invalid QR format:", err);
//       toast.error("Invalid QR code format!");
//     }
//   };

//   const displayData = updated || currentScan?.qrdata.data;

//   return (
//     <div className="p-4 max-w-md mx-auto min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">QR Scanner</h1>

//       <div className="border rounded-lg overflow-hidden shadow-md">
//         <QrReader
//           constraints={{ facingMode }}
//           scanDelay={200}
//           onResult={handleScan}
//           videoContainerStyle={{ width: "100%", height: 400 }}
//         />
//       </div>

//       <div className="flex justify-center mt-4">
//         <Button
//           onClick={() => setFacingMode(facingMode === "user" ? "environment" : "user")}
//           className="flex items-center gap-2"
//         >
//           <Camera className="h-4 w-4" /> Switch Camera
//         </Button>
//       </div>

//       {/* Modal */}
//       <Dialog open={showModal} onOpenChange={setShowModal}>
//         <DialogContent className="sm:max-w-md w-full p-4 max-h-[80vh]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-green-600 text-xl">
//               <CheckCircle2 className="h-6 w-6" /> Ticket Verified
//             </DialogTitle>
//           </DialogHeader>

//           {displayData && (
//   <div className="mt-4 space-y-4 max-h-[65vh] overflow-y-auto px-2 sm:px-4">
//     <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-sm flex justify-between items-center">
//       <span className="font-semibold text-blue-800">Booking ID:</span>
//       <span className="font-bold text-blue-900">{displayData.bookingId}</span>
//     </div>

//     <div className="grid grid-cols-2 gap-2 sm:gap-4">
//       <div className="p-2 bg-gray-50 rounded-md shadow-sm">
//         <span className="text-gray-600">Name</span>
//         <p className="font-semibold text-gray-800">{displayData.name}</p>
//       </div>
//       <div className="p-2 bg-gray-50 rounded-md shadow-sm">
//         <span className="text-gray-600">Email</span>
//         <p className="font-semibold text-gray-800">{displayData.email}</p>
//       </div>
//       <div className="p-2 bg-gray-50 rounded-md shadow-sm">
//         <span className="text-gray-600">Seats</span>
//         <p className="font-semibold text-gray-800">{displayData.seatNumbers.join(", ")}</p>
//       </div>
//       <div className="p-2 bg-gray-50 rounded-md shadow-sm">
//         <span className="text-gray-600">Amount</span>
//         <p className="font-semibold text-gray-800">${displayData.totalAmount}</p>
//       </div>
//       <div className="p-2 bg-gray-50 rounded-md shadow-sm col-span-2 flex items-center justify-between">
//         <div>
//           <span className="text-gray-600">Payment Status</span>
//           <p className={`font-bold ${displayData.paymentStatus === "paid" ? "text-green-600" : "text-red-600"}`}>
//             {displayData.paymentStatus.toUpperCase()}
//           </p>
//         </div>
//         {/* Pending Button */}
//         {displayData.paymentStatus === "pending" && (
//           <Button
//             className="bg-yellow-500 text-white hover:bg-yellow-600"
//             onClick={async () => {
//                try {
//                     // 1️⃣ Update payment status on backend
//                     const res = await axios.put(
//                       `${backend_url}/dashboard/booking/${updated.bookingId}/status`,
//                       { paymentStatus: "paid" }
//                     );
//     //                  try {
//     //   await axios.post(`${backend_url}/booking/paid`, {
//     //     email: updatedBooking.email || 'chinraman8@gmail.com', // fallback
//     //     bookingId: updatedBooking.bookingId ||'bkg-4dtfv6f'
//     //   });
//     //   console.log("Email notification sent successfully");
//     // } catch (emailError) {
//     //   console.error("Failed to send email notification:", emailError);
//     // }
                
//                 // Update UI
//                 setUpdated({ ...displayData, paymentStatus: "paid" });
//                 toast.success("Payment marked as PAID!");
//               } catch (err) {
//                 console.log(err);
//                 toast.error("Failed to update payment!");
//               }
//             }}
//           >
//             Mark as Paid
//           </Button>
//         )}
//       </div>
//     </div>

//     <Button
//       onClick={() => setShowModal(false)}
//       className="w-full mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300"
//     >
//       Close
//     </Button>
//   </div>
// )}

//         </DialogContent>
//       </Dialog>

//       {/* Scanned History */}
//     {/* Scanned History */}
//         <div className="mt-4 max-h-64 overflow-y-auto border rounded-md p-2 bg-white shadow-sm">
//           {scannedList.map((item, idx) => {
//             const data = item.qrdata.data;
//             // If this is the ticket we just updated, show updated paymentStatus
//             const isUpdated = updated && updated.bookingId === data.bookingId;
//             const paymentStatus = isUpdated ? updated.paymentStatus : data.paymentStatus;

//             return (
//               <div key={idx} className="p-2 border-b last:border-b-0">
//                 <span className="font-bold">{data.bookingId}</span> - {data.name} - 
//                 <span className={`${paymentStatus === "paid" ? "text-green-600" : "text-red-600"}`}>
//                   {paymentStatus}
//                 </span>
//               </div>
//             );
//           })}
//         </div>

//     </div>
//   );
// };

// export default Scanner;



import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

const Scanner = () => {
  const backend_url = "https://swedenn-backend.onrender.com";

  const [showModal, setShowModal] = useState(false);
  const [updated, setUpdated] = useState<any>(null);
  const [scannedList, setScannedList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const lastScanRef = useRef<string | null>(null);
  const scanLock = useRef(false);

  // ✅ QR scan handler
  const handleScan = async (decodedText: string) => {
    if (scanLock.current || !decodedText) return;
    scanLock.current = true;

    try {
      const parsed = JSON.parse(decodedText);
      const bookingData = parsed.qrdata.data;

      // Prevent duplicate scans
      if (lastScanRef.current === bookingData.bookingId) return;
      lastScanRef.current = bookingData.bookingId;

      setLoading(true);

      // Fetch backend info (non-blocking)
      axios
        .get(`${backend_url}/api/bookingid/${bookingData.bookingId}`)
        .then((res) => {
          setUpdated(res.data.data);
        })
        .catch(() => {
          setUpdated(bookingData); // fallback
        })
        .finally(() => {
          setLoading(false);
          setShowModal(true);
        });

      // Update scanned list (limit to 30)
      setScannedList((prev) => [bookingData, ...prev.slice(0, 29)]);

      toast.success(`✅ Scanned: ${bookingData.bookingId}`);
    } catch (err) {
      toast.error("Invalid QR format!");
    } finally {
      // Unlock after short delay to allow next scan
      setTimeout(() => (scanLock.current = false), 250);
      setTimeout(() => (lastScanRef.current = null), 400);
    }
  };

  useEffect(() => {
    // Initialize fast scanner
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 20, // frames per second (higher = faster)
      qrbox: 250,
      rememberLastUsedCamera: true,
      aspectRatio: 1.0,
    });

    scanner.render(
      (decodedText) => handleScan(decodedText),
      (errorMessage) => {
        // console.log("QR scan error:", errorMessage);
      }
    );

    return () => scanner.clear();
  }, []);

  const displayData = updated;

  return (
    <div className="p-4 max-w-md mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Ultra-Fast QR Scanner 🚀
      </h1>

      {/* Camera View */}
      <div id="reader" className="rounded-lg shadow-md overflow-hidden" style={{ width: "100%" }}></div>

      {/* Loading text */}
      {loading && (
        <p className="text-center text-sm mt-2 text-blue-600 animate-pulse">Verifying ticket...</p>
      )}

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md w-full p-4 max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600 text-xl">
              <CheckCircle2 className="h-6 w-6" /> Ticket Verified
            </DialogTitle>
          </DialogHeader>

          {displayData && (
            <div className="mt-4 space-y-4 max-h-[65vh] overflow-y-auto px-2 sm:px-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-sm flex justify-between items-center">
                <span className="font-semibold text-blue-800">Booking ID:</span>
                <span className="font-bold text-blue-900">{displayData.bookingId}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="p-2 bg-gray-50 rounded-md shadow-sm">
                  <span className="text-gray-600">Name</span>
                  <p className="font-semibold text-gray-800">{displayData.name}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-md shadow-sm">
                  <span className="text-gray-600">Email</span>
                  <p className="font-semibold text-gray-800">{displayData.email}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-md shadow-sm">
                  <span className="text-gray-600">Seats</span>
                  <p className="font-semibold text-gray-800">
                    {displayData.seatNumbers?.join(", ")}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded-md shadow-sm">
                  <span className="text-gray-600">Amount</span>
                  <p className="font-semibold text-gray-800">
                    ${displayData.totalAmount}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded-md shadow-sm col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-gray-600">Payment Status</span>
                    <p
                      className={`font-bold ${
                        displayData.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {displayData.paymentStatus?.toUpperCase()}
                    </p>
                  </div>

                  {displayData.paymentStatus === "pending" && (
                    <Button
                      className="bg-yellow-500 text-white hover:bg-yellow-600"
                      onClick={async () => {
                        try {
                          const res = await axios.put(
                            `${backend_url}/dashboard/booking/${displayData.bookingId}/status`,
                            { paymentStatus: "paid" }
                          );
                          setUpdated({ ...displayData, paymentStatus: "paid" });
                          toast.success("Marked as PAID!");
                        } catch (err) {
                          toast.error("Failed to update!");
                        }
                      }}
                    >
                      Mark as Paid
                    </Button>
                  )}
                </div>
              </div>

              <Button
                onClick={() => setShowModal(false)}
                className="w-full mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Scanned History */}
      <div className="mt-4 max-h-64 overflow-y-auto border rounded-md p-2 bg-white shadow-sm">
        {scannedList.map((data, idx) => (
          <div key={idx} className="p-2 border-b last:border-b-0">
            <span className="font-bold">{data.bookingId}</span> - {data.name} -{" "}
            <span
              className={`${
                data.paymentStatus === "paid" ? "text-green-600" : "text-red-600"
              }`}
            >
              {data.paymentStatus}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scanner;
