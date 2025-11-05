// import React, { useMemo, useState } from "react";

// /**
//  * Brand: #E54343 (primary), #060606 (base)
//  * Improvements:
//  * ✅ Centered section headings
//  * ✅ Red button style for section headings
//  * ✅ White text, hover animation
//  * ✅ Maintains 3 cards per row, 2 rows per section
//  * ✅ Flip animation for cards
//  */

// const SAMPLE_SNACKS = [
//   // --- Vegetarian ---
//   {
//     id: "1",
//     name: "Masala Chips",
//     category: "Chips",
//     segment: "Vegetarian",
//     image:
//       "https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop",
//     revenue: 158000,
//     prevRevenue: 132000,
//     createdAt: "2025-10-05",
//   },
//   {
//     id: "2",
//     name: "Chocolate Cookies",
//     category: "Cookies",
//     segment: "Vegetarian",
//     image:
//       "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
//     revenue: 121000,
//     prevRevenue: 141000,
//     createdAt: "2025-07-22",
//   },
//   {
//     id: "3",
//     name: "Salted Peanuts",
//     category: "Nuts",
//     segment: "Vegetarian",
//     image:
//       "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=1200&auto=format&fit=crop",
//     revenue: 99000,
//     prevRevenue: 83000,
//     createdAt: "2025-09-10",
//   },
//   {
//     id: "4",
//     name: "Veg Puffs",
//     category: "Bakery",
//     segment: "Vegetarian",
//     image:
//       "https://images.unsplash.com/photo-1509440159598-8b49d7f6f81b?q=80&w=1200&auto=format&fit=crop",
//     revenue: 64000,
//     prevRevenue: 91000,
//     createdAt: "2025-08-03",
//   },
//   {
//     id: "5",
//     name: "Nacho Chips",
//     category: "Chips",
//     segment: "Vegetarian",
//     image:
//       "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop",
//     revenue: 172000,
//     prevRevenue: 120000,
//     createdAt: "2025-10-12",
//   },
//   {
//     id: "6",
//     name: "Fruit Gummies",
//     category: "Sweets",
//     segment: "Vegetarian",
//     image:
//       "https://images.unsplash.com/photo-1605979237075-7c3b1b1e76d3?q=80&w=1200&auto=format&fit=crop",
//     revenue: 54000,
//     prevRevenue: 38000,
//     createdAt: "2025-10-20",
//   },
//   // --- Non Vegetarian ---
//   {
//     id: "7",
//     name: "Chicken Puff",
//     category: "Bakery",
//     segment: "Non Vegetarian",
//     image:
//       "https://images.unsplash.com/photo-1542826438-3bd4a48d4a5b?q=80&w=1200&auto=format&fit=crop",
//     revenue: 118000,
//     prevRevenue: 101000,
//     createdAt: "2025-09-30",
//   },
//   {
//     id: "8",
//     name: "Fish Crackers",
//     category: "Snacks",
//     segment: "Non Vegetarian",
//     image:
//       "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1200&auto=format&fit=crop",
//     revenue: 88000,
//     prevRevenue: 94000,
//     createdAt: "2025-08-18",
//   },
//   {
//     id: "9",
//     name: "Egg Sandwich",
//     category: "Bakery",
//     segment: "Non Vegetarian",
//     image:
//       "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
//     revenue: 103000,
//     prevRevenue: 76000,
//     createdAt: "2025-10-10",
//   },
//   {
//     id: "10",
//     name: "Chicken Nuggets",
//     category: "Snacks",
//     segment: "Non Vegetarian",
//     image:
//       "https://images.unsplash.com/photo-1612927601601-6638404737fd?q=80&w=1200&auto=format&fit=crop",
//     revenue: 146000,
//     prevRevenue: 132000,
//     createdAt: "2025-09-25",
//   },
//   {
//     id: "11",
//     name: "Shrimp Chips",
//     category: "Snacks",
//     segment: "Non Vegetarian",
//     image:
//       "https://images.unsplash.com/photo-1619158401201-1b748e5368b3?q=80&w=1200&auto=format&fit=crop",
//     revenue: 76000,
//     prevRevenue: 82000,
//     createdAt: "2025-07-20",
//   },
//   {
//     id: "12",
//     name: "Chicken Roll",
//     category: "Bakery",
//     segment: "Non Vegetarian",
//     image:
//       "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1200&auto=format&fit=crop",
//     revenue: 112000,
//     prevRevenue: 98000,
//     createdAt: "2025-10-02",
//   },
//   // --- Juice ---
//   {
//     id: "13",
//     name: "Mango Juice",
//     category: "Juice",
//     segment: "Juice",
//     image:
//       "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1200&auto=format&fit=crop",
//     revenue: 134000,
//     prevRevenue: 111000,
//     createdAt: "2025-10-08",
//   },
//   {
//     id: "14",
//     name: "Orange Juice",
//     category: "Juice",
//     segment: "Juice",
//     image:
//       "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=1200&auto=format&fit=crop",
//     revenue: 98000,
//     prevRevenue: 86000,
//     createdAt: "2025-09-28",
//   },
//   {
//     id: "15",
//     name: "Watermelon Juice",
//     category: "Juice",
//     segment: "Juice",
//     image:
//       "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200&auto=format&fit=crop",
//     revenue: 72000,
//     prevRevenue: 69000,
//     createdAt: "2025-08-15",
//   },
//   {
//     id: "16",
//     name: "Grape Juice",
//     category: "Juice",
//     segment: "Juice",
//     image:
//       "https://images.unsplash.com/photo-1546820389-44d77e1f3b31?q=80&w=1200&auto=format&fit=crop",
//     revenue: 57000,
//     prevRevenue: 52000,
//     createdAt: "2025-07-30",
//   },
//   {
//     id: "17",
//     name: "Pineapple Juice",
//     category: "Juice",
//     segment: "Juice",
//     image:
//       "https://images.unsplash.com/photo-1542444459-db63c6b6d0bf?q=80&w=1200&auto=format&fit=crop",
//     revenue: 86000,
//     prevRevenue: 79000,
//     createdAt: "2025-10-03",
//   },
//   {
//     id: "18",
//     name: "Guava Juice",
//     category: "Juice",
//     segment: "Juice",
//     image:
//       "https://images.unsplash.com/photo-1536510347891-8f9f52f4d224?q=80&w=1200&auto=format&fit=crop",
//     revenue: 63000,
//     prevRevenue: 60000,
//     createdAt: "2025-09-05",
//   },
// ];

// const formatCurrency = (v, l = "en-IN", c = "INR") =>
//   new Intl.NumberFormat(l, { style: "currency", currency: c }).format(v);

// export default function SnackProductPerformance() {
//   const withGrowth = useMemo(
//     () =>
//       SAMPLE_SNACKS.map((s) => ({
//         ...s,
//         growth:
//           s.prevRevenue === 0 ? 1 : (s.revenue - s.prevRevenue) / s.prevRevenue,
//       })),
//     []
//   );

//   const sections = useMemo(() => {
//     const bySegment = { Vegetarian: [], "Non Vegetarian": [], Juice: [] };
//     withGrowth.forEach((item) => {
//       if (bySegment[item.segment] && bySegment[item.segment].length < 6) {
//         bySegment[item.segment].push(item);
//       }
//     });
//     return bySegment;
//   }, [withGrowth]);

//   return (
//     <div className="mx-auto max-w-7xl p-0">
//       {["Vegetarian", "Non Vegetarian", "Juice"].map((seg) => (
//         <Section key={seg} title={seg} items={sections[seg]} />
//       ))}
//     </div>
//   );
// }

// function Section({ title, items }) {
//   return (
//     <section className="mt-12 text-center">
//       {/* Centered red button heading */}
//       <div className="mb-8 flex justify-center">
//         <button className="rounded-full bg-[#E54343] px-8 py-3 text-lg font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-[#c43434]">
//           {title}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
//         {items.map((item) => (
//           <FlipSnackCard key={item.id} item={item} />
//         ))}
//       </div>
//     </section>
//   );
// }

// function FlipSnackCard({ item }) {
//   const [flipped, setFlipped] = useState(false);
//   const growthPct =
//     Math.round(
//       (item.prevRevenue === 0 ? 1 : item.growth) * 1000
//     ) / 10;
//   const isUp = growthPct >= 0;

//   return (
//     <div
//       className="relative h-80 cursor-pointer [perspective:1000px]"
//       onClick={() => setFlipped((f) => !f)}
//       title="Click to flip"
//     >
//       <div
//         className="absolute inset-0 rounded-xl border border-[#060606]/10 bg-white shadow-md transition-transform duration-700 [transform-style:preserve-3d] hover:shadow-lg"
//         style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
//       >
//         {/* Front */}
//         <div className="absolute inset-0 rounded-xl [backface-visibility:hidden]">
//           <div className="overflow-hidden rounded-t-xl bg-gray-50">
//             <img
//               src={item.image}
//               alt={item.name}
//               className="h-44 w-full object-cover transition duration-500"
//               loading="lazy"
//             />
//           </div>
//           <div className="p-4">
//             <div className="flex items-center gap-2">
//               <h4 className="truncate text-base font-extrabold text-[#060606]">
//                 {item.name}
//               </h4>
//               <span className="rounded-full bg-[#060606]/5 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#060606]">
//                 {item.category}
//               </span>
//             </div>
//             <div className="mt-1 text-[12px] font-semibold text-[#060606]/70">
//               Added {formatDate(item.createdAt)}
//             </div>
//             <div
//               className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
//                 isUp
//                   ? "bg-emerald-50 text-emerald-700"
//                   : "bg-[#E54343]/10 text-[#E54343]"
//               }`}
//             >
//               <span className="text-sm leading-none">{isUp ? "▲" : "▼"}</span>
//               <span>{Math.abs(growthPct)}%</span>
//             </div>
//           </div>
//         </div>

//         {/* Back */}
//         <div className="absolute inset-0 rounded-xl bg-white p-4 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
//           <div className="flex h-full flex-col items-center justify-center gap-2">
//             <div className="text-xs font-semibold uppercase tracking-wide text-[#060606]/60">
//               Revenue
//             </div>
//             <div className="text-2xl font-extrabold text-[#060606]">
//               {formatCurrency(item.revenue)}
//             </div>
//             <div className="text-[11px] font-semibold text-[#060606]/60">
//               Prev:{" "}
//               <span className="font-bold text-[#E54343]">
//                 {formatCurrency(item.prevRevenue)}
//               </span>
//             </div>
//             <button
//               className="mt-2 rounded-full border border-[#E54343]/50 bg-white px-3 py-1 text-xs font-extrabold text-[#060606] transition hover:border-[#E54343] hover:text-[#E54343]"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setFlipped(false);
//               }}
//             >
//               Tap to flip back
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function formatDate(d) {
//   const dt = new Date(d);
//   return dt.toLocaleDateString(undefined, {
//     year: "numeric",
//     month: "short",
//     day: "2-digit",
//   });
// }


import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const formatCurrency = (v, l = "en-IN", c = "INR") =>
  new Intl.NumberFormat(l, { style: "currency", currency: c }).format(v);

export default function SnackProductPerformance() {
  const [snacks, setSnacks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8004/snacks/allSnacks")
      .then((res) => setSnacks(res.data))
      .catch((err) => console.error("❌ Error fetching snacks:", err));
  }, []);

  const withGrowth = useMemo(
    () =>
      snacks.map((s) => ({
        ...s,
        growth:
          s.prevRevenue === 0 ? 1 : (s.revenue - s.prevRevenue) / s.prevRevenue,
      })),
    [snacks]
  );

  const sections = useMemo(() => {
    const bySegment = { Vegetarian: [], "Non Vegetarian": [], Juice: [] };
    withGrowth.forEach((item) => {
      if (bySegment[item.segment] && bySegment[item.segment].length < 6) {
        bySegment[item.segment].push(item);
      }
    });
    return bySegment;
  }, [withGrowth]);

  return (
    <div className="mx-auto max-w-7xl p-0">
      {["Vegetarian", "Non Vegetarian", "Juice"].map((seg) => (
        <Section key={seg} title={seg} items={sections[seg]} />
      ))}
    </div>
  );
}

function Section({ title, items }) {
  return (
    <section className="mt-12 text-center">
      <div className="mb-8 flex justify-center">
        <button className="rounded-full bg-[#E54343] px-8 py-3 text-lg font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-[#c43434]">
          {title}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {items.map((item) => (
          <FlipSnackCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}

function FlipSnackCard({ item }) {
  const [flipped, setFlipped] = useState(false);

  const growthPct = Math.round(
    (item.prevRevenue === 0 ? 1 : item.growth) * 1000
  ) / 10;
  const isUp = growthPct >= 0;

  const handleOrder = async () => {
    try {
      await axios.post("http://localhost:8000/api/orders", {
        userName: "Chin",
        userEmail: "chin@example.com",
        items: [
          {
            snackId: item._id,
            name: item.name,
            price: 100, // You can replace with your price field if added
            qty: 1,
            lineTotal: 100,
          },
        ],
        totalAmount: 100,
      });
      alert("✅ Order placed successfully!");
    } catch (err) {
      console.error("Order failed:", err);
      alert("❌ Failed to place order");
    }
  };

  return (
    <div
      className="relative h-80 cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped((f) => !f)}
      title="Click to flip"
    >
      <div
        className="absolute inset-0 rounded-xl border border-[#060606]/10 bg-white shadow-md transition-transform duration-700 [transform-style:preserve-3d] hover:shadow-lg"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-xl [backface-visibility:hidden]">
          <div className="overflow-hidden rounded-t-xl bg-gray-50">
            <img
              src={item.image}
              alt={item.name}
              className="h-44 w-full object-cover transition duration-500"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <h4 className="truncate text-base font-extrabold text-[#060606]">
                {item.name}
              </h4>
              <span className="rounded-full bg-[#060606]/5 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#060606]">
                {item.category}
              </span>
            </div>
            <div className="mt-1 text-[12px] font-semibold text-[#060606]/70">
              Added {formatDate(item.createdAt)}
            </div>
            <div
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                isUp
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-[#E54343]/10 text-[#E54343]"
              }`}
            >
              <span className="text-sm leading-none">{isUp ? "▲" : "▼"}</span>
              <span>{Math.abs(growthPct)}%</span>
            </div>

            {/* Order button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOrder();
              }}
              className="mt-3 w-full rounded-full bg-[#E54343] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#c43434]"
            >
              Order Now
            </button>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-xl bg-white p-4 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#060606]/60">
              Revenue
            </div>
            <div className="text-2xl font-extrabold text-[#060606]">
              {formatCurrency(item.revenue)}
            </div>
            <div className="text-[11px] font-semibold text-[#060606]/60">
              Prev:{" "}
              <span className="font-bold text-[#E54343]">
                {formatCurrency(item.prevRevenue)}
              </span>
            </div>
            <button
              className="mt-2 rounded-full border border-[#E54343]/50 bg-white px-3 py-1 text-xs font-extrabold text-[#060606] transition hover:border-[#E54343] hover:text-[#E54343]"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
              }}
            >
              Tap to flip back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
