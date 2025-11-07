

// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";



// export default function UserSnacksShop() {
//   const { bookingid } = useParams();
//   const primary = "#E54343";
//   const ink = "#060606";

//   const [query, setQuery] = useState("");
//   const [cart, setCart] = useState<Record<number, number>>({});
//   const [snacksData, setSnacksData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [booking, setBooking] = useState<any>(null);

//   const backendUrl = "http://localhost:8004"; // ✅ API endpoint

//   async function handleCheckout() {
//   if (cartList.length === 0) {
//     alert("🛒 Your cart is empty!");
//     return;
//   }

// const orderPayload = {
//   userName: booking?.name || "sweden", 
//   userEmail: booking?.email || "unknown@example.com",
//   bookingId: bookingid || "unknown",
//   totalAmount: total,
//   movieName: booking?.movieName || "",
//   showdate: booking?.showdate || "",
//   showTime: booking?.showTime || "",
//   items: cartList.map((item) => ({
//     snackId: item._id,
//     name: item.name,
//     price: item.price,
//     qty: item.qty,
//     lineTotal: item.lineTotal,
//     Image: item.img
//   })),
// };



//   try {
//     const res = await axios.post(`${backendUrl}/snacksorder/placeorder`, orderPayload);
//     if (res.data.success) {
//       alert("✅ Snack order placed successfully!");
//       setCart({}); // clear cart
//     } else {
//       alert("❌ Failed to place order!");
//     }
//   } catch (err) {
//     console.error("Checkout error:", err);
//     alert("⚠️ Error while placing order!");
//   }
// }


//    useEffect(() => {
//   const fetchBooking = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/dashboard/bookingdetails/${bookingid}`);
//       if (res.data.success) {
//         console.log("Fetched booking:", res.data.data);
//         setBooking(res.data.data); // ✅ store booking data
//       }
//     } catch (err) {
//       console.error("Error fetching booking:", err);
//     }
//   };
//   fetchBooking();
// }, [bookingid]);

//   // 🔹 Fetch snacks from API
//   useEffect(() => {
//     const fetchSnacks = async () => {
//       try {
//         const res = await axios.get(`${backendUrl}/snacks/getsnack`);
//         if (res.data.success) {
//           console.log("Fetched snacks:", res.data.snacks);
//           setSnacksData(res.data.snacks);
//         }
//       } catch (err) {
//         console.error("Error fetching snacks:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSnacks();
//   }, []);

//   // 🔹 Group snacks by category
//   const groupedData = useMemo(() => {
//     const grouped: Record<string, any[]> = {
//       Vegetarian: [],
//       "Non Vegetarian": [],
//       Juice: [],
//     };
//     snacksData.forEach((snack) => {
//       if (grouped[snack.category]) grouped[snack.category].push(snack);
//     });
//     return grouped;
//   }, [snacksData]);

//   // 🔹 Filter by search query
//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return groupedData;
//     const next: Record<string, any[]> = {};
//     for (const [cat, items] of Object.entries(groupedData)) {
//       next[cat] = items.filter((s) =>
//         s.name.toLowerCase().includes(q)
//       );
//     }
//     return next;
//   }, [query, groupedData]);

//   const allItems = useMemo(() => Object.values(groupedData).flat(), [groupedData]);

//   // 🔹 Cart functions
//   function addToCart(item: any) {
//     setCart((prev) => ({ ...prev, [item._id]: (prev[item._id] || 0) + 1 }));
//   }
//   function decFromCart(id: string) {
//     setCart((p) => ({ ...p, [id]: Math.max(0, (p[id] || 0) - 1) }));
//   }
//   function removeFromCart(id: string) {
//     setCart((p) => {
//       const n = { ...p };
//       delete n[id];
//       return n;
//     });
//   }

//   const cartList = Object.entries(cart)
//     .filter(([, q]) => q > 0)
//     .map(([id, qty]) => {
//       const item = allItems.find((i: any) => i._id === id);
//       return { ...item, qty, lineTotal: (item?.price || 0) * qty };
//     });

//   const total = cartList.reduce((a, b) => a + b.lineTotal, 0);
//   const count = cartList.reduce((a, b) => a + b.qty, 0);

//   if (loading) return <p className="text-center mt-20">Loading snacks...</p>;

//   return (
//     <div className="min-h-screen bg-white" style={{ color: ink }}>
//       {/* Header */}
//       <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b shadow-sm">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-3">
//           <span
//             className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white"
//             style={{ backgroundColor: primary }}
//           >
//             🎬
//           </span>
//           <h1 className="text-xl sm:text-2xl font-bold">
//             Snacks <span style={{ color: primary }}>Shop</span>
//           </h1>
//           <div className="ml-auto flex items-center gap-3">
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search snacks..."
//               className="rounded-full px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 w-40 sm:w-64"
//               style={{ border: `2px solid ${primary}` }}
//             />
//             <button
//               className="relative rounded-full px-4 py-2 text-white font-semibold"
//               style={{ backgroundColor: primary }}
//             >
//               Cart
//               {count > 0 && (
//                 <span className="absolute -top-2 -right-2 text-xs rounded-full px-2 py-0.5 bg-black text-white">
//                   {count}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Body */}
//       <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10">
//         {Object.entries(filtered).map(([category, snacks]) => (
//           <section key={category}>
//             <h2
//               className="text-2xl sm:text-3xl font-bold mb-6 text-center underline underline-offset-8"
//               style={{ textDecorationColor: primary }}
//             >
//               {category}
//             </h2>
//             <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
//               {snacks.map((snack: any) => (
//                 <div
//                   key={snack._id}
//                   className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition"
//                 >
//                   <div className="aspect-[4/2.2] overflow-hidden">
//                     <img
//                       src={snack.img}
//                       alt={snack.name}
//                       className="h-full w-full object-cover"
//                       loading="lazy"
//                     />
//                   </div>
//                   <div className="p-4 text-center">
//                     <p
//                       className="font-semibold text-base sm:text-lg"
//                       style={{ color: ink }}
//                     >
//                       {snack.name}
//                     </p>
//                     <p className="text-sm text-gray-600 mt-1">
//                       ₹{snack.price}
//                     </p>
//                     <button
//                       onClick={() => addToCart(snack)}
//                       className="mt-3 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white"
//                       style={{ backgroundColor: primary }}
//                     >
//                       Add to cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         ))}

//         {/* Cart summary */}
//         <div className="sticky bottom-3 z-30">
//           <div className="mx-auto max-w-3xl rounded-full shadow-lg bg-white border px-4 py-3 flex items-center gap-3">
//             <span className="text-sm">
//               Items: <b>{count}</b>
//             </span>
//             <span className="text-sm">
//               Total: <b>₹{total}</b>
//             </span>
//             <div className="ml-auto flex items-center gap-2">
//               <button
//   onClick={handleCheckout}
//   className="rounded-full px-4 py-2 text-white text-sm font-semibold"
//   style={{ backgroundColor: primary }}
// >
//   Checkout
// </button>

//             </div>
//           </div>
//         </div>

//         {/* Cart list */}
//         {cartList.length > 0 && (
//           <div className="mx-auto max-w-3xl w-full">
//             <div className="mt-4 bg-white border rounded-xl overflow-hidden">
//               <div className="px-4 py-3 font-semibold" style={{ background: "#fff6f6" }}>
//                 Cart
//               </div>
//               <ul className="divide-y">
//                 {cartList.map((item: any) => (
//                   <li key={item._id} className="px-4 py-3 flex items-center gap-3">
//                     <img
//                       src={item.img}
//                       alt={item.name}
//                       className="h-12 w-12 rounded object-cover"
//                     />
//                     <div className="flex-1">
//                       <p className="text-sm font-medium">{item.name}</p>
//                       <p className="text-xs text-gray-500">
//                         ₹{item.price} each
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button
//                         className="h-7 w-7 rounded-full border"
//                         onClick={() => decFromCart(item._id)}
//                       >
//                         −
//                       </button>
//                       <span className="w-6 text-center text-sm">
//                         {item.qty}
//                       </span>
//                       <button
//                         className="h-7 w-7 rounded-full border"
//                         onClick={() => addToCart(item)}
//                       >
//                         +
//                       </button>
//                     </div>
//                     <div className="w-20 text-right text-sm">
//                       ₹{item.lineTotal}
//                     </div>
//                     <button
//                       className="ml-2 text-xs underline"
//                       onClick={() => removeFromCart(item._id)}
//                     >
//                       Remove
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </main>

//       <footer
//         className="text-center text-xs sm:text-sm mt-16 border-t-2 pt-4"
//         style={{ borderColor: primary, color: ink }}
//       >
//         © {new Date().getFullYear()} Snacks Shop • Red & Black Theme
//       </footer>
//     </div>
//   );
// }



import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function UserSnacksShop() {
  const { bookingid } = useParams();
  const primary = "#E54343";
  const ink = "#060606";

  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [snacksData, setSnacksData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);

  const backendUrl = "http://localhost:8004";

  // ✅ Handle Checkout
  async function handleCheckout() {
    if (cartList.length === 0) {
      alert("🛒 Your cart is empty!");
      return;
    }

 const orderPayload = {
  userName: booking?.name || "sweden",
  userEmail: booking?.email || "unknown@example.com",
  bookingId: bookingid || "unknown",
  movieName: booking?.movieName || "",
  showdate: booking?.date || "",    // ✅ match backend
  showTime: booking?.timing || "",
  totalAmount: total,
  items: cartList.map((item) => ({
    snackId: item._id,
    name: item.name,
    price: item.price,
    qty: item.qty,
    lineTotal: item.lineTotal,
    Image: item.img,
  })),
};


    try {
      const res = await axios.post(`${backendUrl}/snacksorder/placeorder`, orderPayload);
      if (res.data.success) {
        alert("✅ Snack order placed successfully!");
        setCart({});
      } else {
        alert("❌ Failed to place order!");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("⚠️ Error while placing order!");
    }
  }

  // 🔹 Fetch Booking
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${backendUrl}/dashboard/bookingdetails/${bookingid}`);
        if (res.data.success) {
          console.log("Fetched booking:", res.data.data);
          setBooking(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
      }
    };
    fetchBooking();
  }, [bookingid]);

  // 🔹 Fetch Snacks
  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const res = await axios.get(`${backendUrl}/snacks/getsnack`);
        if (res.data.success) {
          setSnacksData(res.data.snacks);
        }
      } catch (err) {
        console.error("Error fetching snacks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSnacks();
  }, []);

  // 🔹 Group snacks by category
  const groupedData = useMemo(() => {
    const grouped: Record<string, any[]> = {
      Vegetarian: [],
      "Non Vegetarian": [],
      Juice: [],
    };
    snacksData.forEach((snack) => {
      if (grouped[snack.category]) grouped[snack.category].push(snack);
    });
    return grouped;
  }, [snacksData]);

  // 🔹 Filter snacks by search query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groupedData;
    const next: Record<string, any[]> = {};
    for (const [cat, items] of Object.entries(groupedData)) {
      next[cat] = items.filter((s) => s.name.toLowerCase().includes(q));
    }
    return next;
  }, [query, groupedData]);

  const allItems = useMemo(() => Object.values(groupedData).flat(), [groupedData]);

  // 🔹 Cart functions
  function addToCart(item: any) {
    setCart((prev) => ({ ...prev, [item._id]: (prev[item._id] || 0) + 1 }));
  }
  function decFromCart(id: string) {
    setCart((p) => ({ ...p, [id]: Math.max(0, (p[id] || 0) - 1) }));
  }
  function removeFromCart(id: string) {
    setCart((p) => {
      const n = { ...p };
      delete n[id];
      return n;
    });
  }

  const cartList = Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => {
      const item = allItems.find((i: any) => i._id === id);
      return { ...item, qty, lineTotal: (item?.price || 0) * qty };
    });

  const total = cartList.reduce((a, b) => a + b.lineTotal, 0);
  const count = cartList.reduce((a, b) => a + b.qty, 0);

  if (loading) return <p className="text-center mt-20">Loading snacks...</p>;

  return (
    <div className="min-h-screen bg-white" style={{ color: ink }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-3">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: primary }}
          >
            🎬
          </span>
          <h1 className="text-xl sm:text-2xl font-bold">
            Snacks <span style={{ color: primary }}>Shop</span>
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search snacks..."
              className="rounded-full px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 w-40 sm:w-64"
              style={{ border: `2px solid ${primary}` }}
            />
            <button
              className="relative rounded-full px-4 py-2 text-white font-semibold"
              style={{ backgroundColor: primary }}
            >
              Cart
              {count > 0 && (
                <span className="absolute -top-2 -right-2 text-xs rounded-full px-2 py-0.5 bg-black text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Booking Details */}
      {booking && (
        <div className="max-w-7xl mx-auto my-6 bg-white border rounded-xl px-4 py-3 shadow-sm">
          <h2 className="font-bold text-lg mb-2">Booking Details</h2>
          <p><b>Name:</b> {booking.name}</p>
          <p><b>Email:</b> {booking.email}</p>
          <p><b>Phone:</b> {booking.phone}</p>
          <p><b>Movie:</b> {booking.movieName}</p>
          <p><b>ShowDate:</b> {new Date(booking.date).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric"
})}</p>

<p><b>ShowTime:</b> {new Date(`1970-01-01T${booking.timing}:00`).toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true
})}</p>

          <p><b>Seats:</b> {booking.seatNumbers.map((s: any) => s.seat).join(", ")}</p>
        </div>
      )}

      {/* Body */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10">
        {Object.entries(filtered).map(([category, snacks]) => (
          <section key={category}>
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6 text-center underline underline-offset-8"
              style={{ textDecorationColor: primary }}
            >
              {category}
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {snacks.map((snack: any) => (
                <div
                  key={snack._id}
                  className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <div className="aspect-[4/2.2] overflow-hidden">
                    <img
                      src={snack.img}
                      alt={snack.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-semibold text-base sm:text-lg" style={{ color: ink }}>
                      {snack.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">₹{snack.price}</p>
                    <button
                      onClick={() => addToCart(snack)}
                      className="mt-3 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white"
                      style={{ backgroundColor: primary }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Cart summary */}
        <div className="sticky bottom-3 z-30">
          <div className="mx-auto max-w-3xl rounded-full shadow-lg bg-white border px-4 py-3 flex items-center gap-3">
            <span className="text-sm">Items: <b>{count}</b></span>
            <span className="text-sm">Total: <b>₹{total}</b></span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleCheckout}
                className="rounded-full px-4 py-2 text-white text-sm font-semibold"
                style={{ backgroundColor: primary }}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>

        {/* Cart list */}
        {cartList.length > 0 && (
          <div className="mx-auto max-w-3xl w-full">
            <div className="mt-4 bg-white border rounded-xl overflow-hidden">
              <div className="px-4 py-3 font-semibold" style={{ background: "#fff6f6" }}>
                Cart
              </div>
              <ul className="divide-y">
                {cartList.map((item: any) => (
                  <li key={item._id} className="px-4 py-3 flex items-center gap-3">
                    <img src={item.img} alt={item.name} className="h-12 w-12 rounded object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="h-7 w-7 rounded-full border" onClick={() => decFromCart(item._id)}>−</button>
                      <span className="w-6 text-center text-sm">{item.qty}</span>
                      <button className="h-7 w-7 rounded-full border" onClick={() => addToCart(item)}>+</button>
                    </div>
                    <div className="w-20 text-right text-sm">₹{item.lineTotal}</div>
                    <button className="ml-2 text-xs underline" onClick={() => removeFromCart(item._id)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer
        className="text-center text-xs sm:text-sm mt-16 border-t-2 pt-4"
        style={{ borderColor: primary, color: ink }}
      >
        © {new Date().getFullYear()} Snacks Shop • Red & Black Theme
      </footer>
    </div>
  );
}
