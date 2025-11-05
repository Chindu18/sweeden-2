// import React, { useMemo, useState } from "react";

// // Local images (re-use your existing asset files/paths)
// import popcorn from "../assets/popcorn.jpg";
// import nachos from "../assets/nachos.jpg";
// import samosa from "../assets/samosa.jpg";
// import frenchfries from "../assets/FrenchFries.jpg";
// import Brownie from "../assets/Brownie.jpg";
// import Caramol from "../assets/caramol.jpg";
// import Hotdog from "../assets/hotdog.webp";
// import Burger from "../assets/burger.avif";
// import nuggets from "../assets/nuggets.jpg";
// import bbq from "../assets/bbq.jpg";
// import chickenroll from "../assets/chickenroll.jpg";
// import chickenpopcorn from "../assets/chickenpopcorn.jpg";
// import cola from "../assets/cola.jpeg";
// import lemon from "../assets/lemonjuice.avif";
// import orange from "../assets/orangejuice.jpg";
// import apple from "../assets/applejuice.png";
// import tea from "../assets/icedtea.jpg";
// import water from "../assets/water.webp";

// // const initialData = {
// //   Vegetarian: [
// //     { id: 1, name: "Popcorn", img: popcorn, price: 120 },
// //     { id: 2, name: "Nachos", img: nachos, price: 150 },
// //     { id: 3, name: "Samosa", img: samosa, price: 90 },
// //     { id: 4, name: "French Fries", img: frenchfries, price: 140 },
// //     { id: 5, name: "Brownie", img: Brownie, price: 120 },
// //     { id: 6, name: "Caramel Popcorn", img: Caramol, price: 180 },
// //   ],
// //   "Non Vegetarian": [
// //     { id: 7, name: "Hot Dog", img: Hotdog, price: 160 },
// //     { id: 8, name: "Chicken Burger", img: Burger, price: 240 },
// //     { id: 9, name: "Nuggets", img: nuggets, price: 210 },
// //     { id: 10, name: "BBQ Wings", img: bbq, price: 260 },
// //     { id: 11, name: "Chicken Roll", img: chickenroll, price: 180 },
// //     { id: 12, name: "Chicken Popcorn", img: chickenpopcorn, price: 190 },
// //   ],
// //   Juice: [
// //     { id: 13, name: "Cola", img: cola, price: 80 },
// //     { id: 14, name: "Lemonade", img: lemon, price: 90 },
// //     { id: 15, name: "Orange Juice", img: orange, price: 110 },
// //     { id: 16, name: "Apple Juice", img: apple, price: 110 },
// //     { id: 17, name: "Iced Tea", img: tea, price: 100 },
// //     { id: 18, name: "Water", img: water, price: 40 },
// //   ],
// // };
// const initialData = {};

// export default function UserSnacksShop(){
//   const primary = "#E54343";
//   const ink = "#060606";

//   const [query, setQuery] = useState("");
//   const [cart, setCart] = useState({}); // id -> qty

//   const filtered = useMemo(()=>{
//     const q = query.trim().toLowerCase();
//     if(!q) return initialData;
//     const next = {};
//     for(const [cat, items] of Object.entries(initialData)){
//       next[cat] = items.filter(s => s.name.toLowerCase().includes(q));
//     }
//     return next;
//   },[query]);

//   const allItems = useMemo(()=> Object.values(initialData).flat(), []);

//   function addToCart(item){
//     setCart(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
//   }
//   function decFromCart(id){ setCart(p=> ({...p, [id]: Math.max(0, (p[id]||0)-1)})); }
//   function removeFromCart(id){ setCart(p=>{ const n={...p}; delete n[id]; return n; }); }

//   const cartList = Object.entries(cart).filter(([,q])=>q>0).map(([id,qty])=>{
//     const item = allItems.find(i=> i.id === Number(id));
//     return { ...item, qty, lineTotal: (item?.price||0)*qty };
//   });
//   const total = cartList.reduce((a,b)=> a + b.lineTotal, 0);
//   const count = cartList.reduce((a,b)=> a + b.qty, 0);

//   return (
//     <div className="min-h-screen bg-white" style={{color:ink}}>
//       {/* Header */}
//       <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b shadow-sm">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-3">
//           <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white" style={{backgroundColor:primary}}>🎬</span>
//           <h1 className="text-xl sm:text-2xl font-bold">Snacks <span style={{color:primary}}>Shop</span></h1>
//           <div className="ml-auto flex items-center gap-3">
//             <input
//               value={query}
//               onChange={e=>setQuery(e.target.value)}
//               placeholder="Search snacks..."
//               className="rounded-full px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 w-40 sm:w-64"
//               style={{border:`2px solid ${primary}`}}
//             />
//             <button className="relative rounded-full px-4 py-2 text-white font-semibold" style={{backgroundColor:primary}}>
//               Cart
//               {count>0 && (
//                 <span className="absolute -top-2 -right-2 text-xs rounded-full px-2 py-0.5 bg-black text-white">{count}</span>
//               )}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Body */}
//       <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10">
//         {Object.entries(filtered).map(([category, snacks])=> (
//           <section key={category}>
//             <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center underline underline-offset-8" style={{textDecorationColor:primary}}>{category}</h2>
//             <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
//               {snacks.map(snack => (
//                 <div key={snack.id} className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition">
//                   <div className="aspect-[4/2.2] overflow-hidden">
//                     <img src={snack.img} alt={snack.name} className="h-full w-full object-cover" loading="lazy" />
//                   </div>
//                   <div className="p-4 text-center">
//                     <p className="font-semibold text-base sm:text-lg" style={{color:ink}}>{snack.name}</p>
//                     <p className="text-sm text-gray-600 mt-1">₹{snack.price}</p>
//                     <button
//                       onClick={()=> addToCart(snack)}
//                       className="mt-3 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white"
//                       style={{backgroundColor:primary}}
//                     >
//                       Add to cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         ))}

//         {/* Simple cart summary */}
//         <div className="sticky bottom-3 z-30">
//           <div className="mx-auto max-w-3xl rounded-full shadow-lg bg-white border px-4 py-3 flex items-center gap-3">
//             <span className="text-sm">Items: <b>{count}</b></span>
//             <span className="text-sm">Total: <b>₹{total}</b></span>
//             <div className="ml-auto flex items-center gap-2">
//               <button className="rounded-full px-4 py-2 text-white text-sm font-semibold" style={{backgroundColor:primary}}>Checkout</button>
//             </div>
//           </div>
//         </div>

//         {/* Expandable cart list */}
//         {cartList.length>0 && (
//           <div className="mx-auto max-w-3xl w-full">
//             <div className="mt-4 bg-white border rounded-xl overflow-hidden">
//               <div className="px-4 py-3 font-semibold" style={{background:'#fff6f6'}}>Cart</div>
//               <ul className="divide-y">
//                 {cartList.map(item=> (
//                   <li key={item.id} className="px-4 py-3 flex items-center gap-3">
//                     <img src={item.img} alt={item.name} className="h-12 w-12 rounded object-cover" />
//                     <div className="flex-1">
//                       <p className="text-sm font-medium">{item.name}</p>
//                       <p className="text-xs text-gray-500">₹{item.price} each</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button className="h-7 w-7 rounded-full border" onClick={()=> decFromCart(item.id)}>−</button>
//                       <span className="w-6 text-center text-sm">{item.qty}</span>
//                       <button className="h-7 w-7 rounded-full border" onClick={()=> addToCart(item)}>+</button>
//                     </div>
//                     <div className="w-20 text-right text-sm">₹{item.lineTotal}</div>
//                     <button className="ml-2 text-xs underline" onClick={()=> removeFromCart(item.id)}>Remove</button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </main>

//       <footer className="text-center text-xs sm:text-sm mt-16 border-t-2 pt-4" style={{borderColor:primary,color:ink}}>
//         © {new Date().getFullYear()} Snacks Shop • Red & Black Theme
//       </footer>
//     </div>
//   );
// }



import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function UserSnacksShop() {
  const primary = "#E54343";
  const ink = "#060606";

  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [snacksData, setSnacksData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = "http://localhost:8004"; // ✅ API endpoint

  // 🔹 Fetch snacks from API
  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const res = await axios.get(`${backendUrl}/orderfood/allSnacks`);
        if (res.data.success) {
          console.log("Fetched snacks:", res.data.orders);
          setSnacksData(res.data.orders);
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

  // 🔹 Filter by search query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groupedData;
    const next: Record<string, any[]> = {};
    for (const [cat, items] of Object.entries(groupedData)) {
      next[cat] = items.filter((s) =>
        s.name.toLowerCase().includes(q)
      );
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
                    <p
                      className="font-semibold text-base sm:text-lg"
                      style={{ color: ink }}
                    >
                      {snack.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      ₹{snack.price}
                    </p>
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
            <span className="text-sm">
              Items: <b>{count}</b>
            </span>
            <span className="text-sm">
              Total: <b>₹{total}</b>
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button
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
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        ₹{item.price} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="h-7 w-7 rounded-full border"
                        onClick={() => decFromCart(item._id)}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">
                        {item.qty}
                      </span>
                      <button
                        className="h-7 w-7 rounded-full border"
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    </div>
                    <div className="w-20 text-right text-sm">
                      ₹{item.lineTotal}
                    </div>
                    <button
                      className="ml-2 text-xs underline"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
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


