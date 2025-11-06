


// import React, { useMemo, useState } from "react";

// // Local images (initial seeds)
// import popcorn from "../../assets/popcorn.jpg";
// import nachos from "../../assets/nachos.jpg";
// import samosa from "../../assets/samosa.jpg";
// import frenchfries from "../../assets/FrenchFries.jpg";
// import Brownie from "../../assets/Brownie.jpg";
// import Caramol from "../../assets/caramol.jpg";
// import Hotdog from "../../assets/hotdog.webp";
// import Burger from "../../assets/burger.avif";
// import nuggets from "../../assets/nuggets.jpg";
// import bbq from "../../assets/bbq.jpg";
// import chickenroll from "../../assets/chickenroll.jpg";
// import chickenpopcorn from "../../assets/chickenpopcorn.jpg";
// import cola from "../../assets/cola.jpeg";
// import lemon from "../../assets/lemonjuice.avif";
// import orange from "../../assets/orangejuice.jpg";
// import apple from "../../assets/applejuice.png";
// import tea from "../../assets/icedtea.jpg";
// import water from "../../assets/water.webp";

// const initialData = {
//   Vegetarian: [
//     { id: 1, name: "Popcorn", img: popcorn, price: 120 },
//     { id: 2, name: "Nachos", img: nachos, price: 150 },
//     { id: 3, name: "Samosa", img: samosa, price: 90 },
//     { id: 4, name: "French Fries", img: frenchfries, price: 140 },
//     { id: 5, name: "Brownie", img: Brownie, price: 120 },
//     { id: 6, name: "Caramel Popcorn", img: Caramol, price: 180 },
//   ],
//   "Non Vegetarian": [
//     { id: 7, name: "Hot Dog", img: Hotdog, price: 160 },
//     { id: 8, name: "Chicken Burger", img: Burger, price: 240 },
//     { id: 9, name: "Nuggets", img: nuggets, price: 210 },
//     { id: 10, name: "BBQ Wings", img: bbq, price: 260 },
//     { id: 11, name: "Chicken Roll", img: chickenroll, price: 180 },
//     { id: 12, name: "Chicken Popcorn", img: chickenpopcorn, price: 190 },
//   ],
//   Juice: [
//     { id: 13, name: "Cola", img: cola, price: 80 },
//     { id: 14, name: "Lemonade", img: lemon, price: 90 },
//     { id: 15, name: "Orange Juice", img: orange, price: 110 },
//     { id: 16, name: "Apple Juice", img: apple, price: 110 },
//     { id: 17, name: "Iced Tea", img: tea, price: 100 },
//     { id: 18, name: "Water", img: water, price: 40 },
//   ],
// };

// export default function SnacksPicker() {
//   const primary = "#E54343";
//   const ink = "#060606";

//   const [data, setData] = useState(initialData);
//   const [query, setQuery] = useState("");
//   const [selected, setSelected] = useState({});
//   const [editing, setEditing] = useState(null);
//   const [draftName, setDraftName] = useState("");
//   const [draftPrice, setDraftPrice] = useState("");
//   const [draftImg, setDraftImg] = useState("");

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return data;
//     const next = {};
//     for (const [cat, items] of Object.entries(data)) {
//       next[cat] = items.filter((s) => s.name.toLowerCase().includes(q));
//     }
//     return next;
//   }, [data, query]);

//   function toggleSnack(cat, snack) {
//     setSelected((p) => ({ ...p, [snack.id]: p[snack.id] ? 0 : 1 }));
//   }

//   function startEdit(cat, item) {
//     setEditing({ cat, id: item.id });
//     setDraftName(item.name);
//     setDraftPrice(String(item.price));
//     setDraftImg(item.img);
//   }

//   function cancelEdit() {
//     setEditing(null);
//     setDraftName("");
//     setDraftPrice("");
//     setDraftImg("");
//   }

//   function commitEdit() {
//     if (!editing) return;
//     const { cat, id } = editing;
//     const value = Number(draftPrice);
//     if (Number.isNaN(value) || value < 0) {
//       alert("Please enter a valid price.");
//       return;
//     }
//     if (!draftName.trim()) {
//       alert("Please enter a valid name.");
//       return;
//     }
//     setData((prev) => {
//       const updated = { ...prev };
//       updated[cat] = prev[cat].map((it) =>
//         it.id === id ? { ...it, name: draftName.trim(), price: value, img: draftImg } : it
//       );
//       return updated;
//     });
//     cancelEdit();
//   }

//   function onChangeDraftImage(e) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => setDraftImg(reader.result);
//     reader.readAsDataURL(file);
//   }

//   return (
//     <div className="min-h-screen bg-white" style={{ color: ink }}>
//       <header
//         className="sticky top-0 z-40 bg-white border-b shadow-sm"
//         style={{ borderColor: primary }}
//       >
//         <div className="flex justify-between items-center px-6 py-3">
//           <h1 className="text-3xl font-extrabold tracking-wide">
//             Snacks <span style={{ color: primary }}>Cart</span>
//           </h1>
//           <input
//             type="text"
//             placeholder="Search snacks..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="border rounded-full px-4 py-2 text-sm"
//             style={{ borderColor: primary }}
//           />
//         </div>
//       </header>

//       <main className="px-6 py-8 space-y-10">
//         {Object.entries(filtered).map(([category, snacks]) => (
//           <section key={category}>
//             <h2
//               className="text-2xl font-bold text-center underline underline-offset-8 mb-6"
//               style={{ textDecorationColor: primary }}
//             >
//               {category}
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {snacks.map((snack) => {
//                 const isEditing =
//                   editing && editing.cat === category && editing.id === snack.id;
//                 return (
//                   <div
//                     key={snack.id}
//                     className="border rounded-xl shadow hover:shadow-lg transition relative overflow-hidden"
//                     style={{ borderColor: isEditing ? primary : "#ddd" }}
//                   >
//                     <div className="aspect-[4/2.2] relative">
//                       <img
//                         src={isEditing && draftImg ? draftImg : snack.img}
//                         alt={snack.name}
//                         className="h-full w-full object-cover"
//                       />
//                       {isEditing && (
//                         <label className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border shadow-sm">
//                           📷 Change
//                           <input
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             onChange={onChangeDraftImage}
//                           />
//                         </label>
//                       )}
//                     </div>
//                     <div className="p-4 text-center bg-[#fff6f6]">
//                       {!isEditing ? (
//                         <>
//                           <p className="font-semibold text-lg">{snack.name}</p>
//                           <div className="flex justify-center items-center gap-2 mt-2">
//                             <span>SEK {snack.price}</span>
//                             <button
//                               onClick={() => startEdit(category, snack)}
//                               className="text-red-500 text-sm"
//                             >
//                               ✏️ Edit
//                             </button>
//                           </div>
//                         </>
//                       ) : (
//                         <div className="space-y-3">
//                           <input
//                             type="text"
//                             value={draftName}
//                             onChange={(e) => setDraftName(e.target.value)}
//                             className="w-3/4 border px-2 py-1 rounded-md"
//                             style={{ borderColor: primary }}
//                           />
//                           <input
//                             type="number"
//                             value={draftPrice}
//                             min="0"
//                             onChange={(e) => setDraftPrice(e.target.value)}
//                             className="w-1/2 border px-2 py-1 rounded-md"
//                             style={{ borderColor: primary }}
//                           />
//                           <div className="flex justify-center gap-3">
//                             <button
//                               onClick={commitEdit}
//                               className="px-4 py-1 rounded bg-red-500 text-white"
//                             >
//                               Save
//                             </button>
//                             <button
//                               onClick={cancelEdit}
//                               className="px-4 py-1 rounded border"
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         ))}
//       </main>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function SnacksPicker() {
  const primary = "#E54343";
  const ink = "#060606";

  const [data, setData] = useState({});
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [draftPrice, setDraftPrice] = useState("");
  const [draftImg, setDraftImg] = useState("");
  const [draftCategory, setDraftCategory] = useState("Vegetarian");
  const [showAddForm, setShowAddForm] = useState(false);

  // ✅ Load snacks from backend
  const fetchSnacks = async () => {
    try {
      const res = await axios.get("http://localhost:8004/snacks/getsnack");
      if (res.data.success) {
        const grouped = { Vegetarian: [], "Non Vegetarian": [], Juice: [] };
        res.data.snacks.forEach((snack) => {
          grouped[snack.category]?.push(snack);
        });
        setData(grouped);
      }
    } catch (err) {
      console.error("Error loading snacks:", err);
    }
  };

  useEffect(() => {
    fetchSnacks();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    const next = {};
    for (const [cat, items] of Object.entries(data)) {
      next[cat] = items.filter((s) => s.name.toLowerCase().includes(q));
    }
    return next;
  }, [data, query]);

  function startEdit(cat, item) {
    setEditing({ cat, id: item._id });
    setDraftName(item.name);
    setDraftPrice(String(item.price));
    setDraftImg(item.img);
    setDraftCategory(item.category);
  }

  function cancelEdit() {
    setEditing(null);
    setDraftName("");
    setDraftPrice("");
    setDraftImg("");
  }

  // ✅ Update in MongoDB
  async function commitEdit() {
    if (!editing) return;
    const { id } = editing;
    try {
      await axios.put(`http://localhost:8004/snacks/updatesnack/${id}`, {
        name: draftName,
        price: draftPrice,
        category: draftCategory,
        img: draftImg,
      });
      alert("✅ Snack updated!");
      fetchSnacks();
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  }

  // ✅ Delete snack
  async function handleDelete(id) {
    if (!window.confirm("Delete this snack?")) return;
    try {
      await axios.delete(`http://localhost:8004/snacks/deletesnack/${id}`);
      alert("🗑 Snack deleted!");
      fetchSnacks();
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  }

  // ✅ Add new snack
  async function handleAddSnack() {
    if (!draftName || !draftPrice || !draftCategory || !draftImg) {
      alert("All fields required!");
      return;
    }

    try {
      await axios.post("http://localhost:8004/snacks/addsnack", {
        name: draftName,
        price: draftPrice,
        category: draftCategory,
        img: draftImg,
      });
      alert("✅ Snack added!");
      setShowAddForm(false);
      fetchSnacks();
      setDraftName("");
      setDraftPrice("");
      setDraftImg("");
    } catch (err) {
      console.error(err);
      alert("❌ Add failed");
    }
  }

  function onChangeDraftImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraftImg(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-white" style={{ color: ink }}>
      <header
        className="sticky top-0 z-40 bg-white border-b shadow-sm flex justify-between items-center px-6 py-3"
        style={{ borderColor: primary }}
      >
        <h1 className="text-3xl font-extrabold tracking-wide">
          Snacks <span style={{ color: primary }}>Cart</span>
        </h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search snacks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded-full px-4 py-2 text-sm"
            style={{ borderColor: primary }}
          />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-md text-white font-semibold"
            style={{ backgroundColor: primary }}
          >
            ➕ Add
          </button>
        </div>
      </header>

      {/* ✅ Add Form */}
      {showAddForm && (
        <div className="p-6 border-b bg-[#fff5f5] flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Name"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            className="border px-3 py-2 rounded-md"
            style={{ borderColor: primary }}
          />
          <input
            type="number"
            placeholder="Price"
            value={draftPrice}
            onChange={(e) => setDraftPrice(e.target.value)}
            className="border px-3 py-2 rounded-md"
            style={{ borderColor: primary }}
          />
          <select
            value={draftCategory}
            onChange={(e) => setDraftCategory(e.target.value)}
            className="border px-3 py-2 rounded-md"
            style={{ borderColor: primary }}
          >
            <option>Vegetarian</option>
            <option>Non Vegetarian</option>
            <option>Juice</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={onChangeDraftImage}
            className="border px-2 py-2 rounded-md"
            style={{ borderColor: primary }}
          />
          <button
            onClick={handleAddSnack}
            className="px-4 py-2 rounded-md text-white font-semibold"
            style={{ backgroundColor: primary }}
          >
            Add Snack
          </button>
        </div>
      )}

      <main className="px-6 py-8 space-y-10">
        {Object.entries(filtered).map(([category, snacks]) => (
          <section key={category}>
            <h2
              className="text-2xl font-bold text-center underline underline-offset-8 mb-6"
              style={{ textDecorationColor: primary }}
            >
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {snacks.map((snack) => {
                const isEditing =
                  editing && editing.cat === category && editing.id === snack._id;
                return (
                  <div
                    key={snack._id}
                    className="border rounded-xl shadow hover:shadow-lg transition relative overflow-hidden"
                    style={{ borderColor: isEditing ? primary : "#ddd" }}
                  >
                    <div className="aspect-[4/2.2] relative">
                      <img
                        src={isEditing && draftImg ? draftImg : snack.img}
                        alt={snack.name}
                        className="h-full w-full object-cover"
                      />
                      {isEditing && (
                        <label className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border shadow-sm">
                          📷 Change
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onChangeDraftImage}
                          />
                        </label>
                      )}
                    </div>
                    <div className="p-4 text-center bg-[#fff6f6]">
                      {!isEditing ? (
                        <>
                          <p className="font-semibold text-lg">{snack.name}</p>
                          <div className="flex justify-center items-center gap-3 mt-2">
                            <span>₹ {snack.price}</span>
                            <button
                              onClick={() => startEdit(category, snack)}
                              className="text-red-500 text-sm"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(snack._id)}
                              className="text-gray-600 text-sm"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            className="w-3/4 border px-2 py-1 rounded-md"
                            style={{ borderColor: primary }}
                          />
                          <input
                            type="number"
                            value={draftPrice}
                            min="0"
                            onChange={(e) => setDraftPrice(e.target.value)}
                            className="w-1/2 border px-2 py-1 rounded-md"
                            style={{ borderColor: primary }}
                          />
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={commitEdit}
                              className="px-4 py-1 rounded bg-red-500 text-white"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-1 rounded border"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
