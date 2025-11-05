// import axios from "axios";
// import React, { useEffect, useMemo, useState } from "react";

// const backend_url = "http://localhost:8004";

// export default function SnacksPicker() {
//   const primary = "#E54343";
//   const ink = "#060606";

//   const [data, setData] = useState({
//     Vegetarian: [],
//     "Non Vegetarian": [],
//     Juice: [],
//   });

//   const [query, setQuery] = useState("");
//   const [selected, setSelected] = useState<{ [key: string]: number }>({});
//   const [editing, setEditing] = useState<{ cat: string; id: string } | null>(
//     null
//   );
//   const [draftPrice, setDraftPrice] = useState("");

//   const [showUpload, setShowUpload] = useState(false);
//   const [uploadCat, setUploadCat] = useState("Vegetarian");
//   const [uploadName, setUploadName] = useState("");
//   const [uploadPrice, setUploadPrice] = useState("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState("");

//   // ✅ Fetch from backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`${backend_url}/snacks/getsnack`);
//         const snacks = res.data.snacks || [];

//         const grouped = snacks.reduce(
//           (acc: any, item: any) => {
//             const cat =
//               item.category === "Non Vegetarian"
//                 ? "Non Vegetarian"
//                 : item.category === "Juice"
//                 ? "Juice"
//                 : "Vegetarian";
//             const snack = {
//               id: item._id,
//               name: item.name,
//               price: item.price,
//               img: `${item.img}`, // ✅ Use backend image path
//             };
//             acc[cat].push(snack);
//             return acc;
//           },
//           { Vegetarian: [], "Non Vegetarian": [], Juice: [] }
//         );

//         setData(grouped);
//       } catch (err) {
//         console.error("Error fetching snacks:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   // ✅ Filtered search
//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return data;
//     const next: any = {};
//     for (const [cat, items] of Object.entries(data)) {
//       next[cat] = (items as any[]).filter((s) =>
//         s.name.toLowerCase().includes(q)
//       );
//     }
//     return next;
//   }, [data, query]);

//   function toggleSnack(cat: string, snack: any) {
//     setSelected((p) => ({ ...p, [snack.id]: p[snack.id] ? 0 : 1 }));
//   }

//   function startEdit(cat: string, item: any) {
//     setEditing({ cat, id: item.id });
//     setDraftPrice(String(item.price));
//   }

//   function cancelEdit() {
//     setEditing(null);
//     setDraftPrice("");
//   }

//   function commitEdit() {
//     if (!editing) return;
//     const value = Number(draftPrice);
//     if (Number.isNaN(value) || value < 0) {
//       alert("Please enter a valid non-negative price.");
//       return;
//     }

//     const { cat, id } = editing;
//     setData((prev: any) => {
//       const updated = { ...prev };
//       updated[cat] = prev[cat].map((it: any) =>
//         it.id === id ? { ...it, price: value } : it
//       );
//       return updated;
//     });

//     // ✅ Update backend
//     axios
//       .put(`${backend_url}/snacks/updatesnack/${id}`, { price: value })
//       .then(() => console.log("Price updated"))
//       .catch((err) => console.error("Update failed:", err));

//     setEditing(null);
//     setDraftPrice("");
//   }

//   // ✅ Upload image handler
//   function onChooseFile(e: any) {
//     const file = e.target.files?.[0];
//     if (!file) {
//       setSelectedFile(null);
//       setPreviewUrl("");
//       return;
//     }
//     setSelectedFile(file);
//     const reader = new FileReader();
//     reader.onload = () => setPreviewUrl(reader.result as string);
//     reader.readAsDataURL(file);
//   }

//   function resetUpload() {
//     setUploadCat("Vegetarian");
//     setUploadName("");
//     setUploadPrice("");
//     setPreviewUrl("");
//     setSelectedFile(null);
//   }

//   // ✅ Upload to backend using FormData
//   async function submitUpload(e: any) {
//     e.preventDefault();
//     if (!uploadName.trim()) return alert("Please enter a food name.");
//     const priceNum = Number(uploadPrice);
//     if (Number.isNaN(priceNum) || priceNum < 0)
//       return alert("Please enter a valid price.");
//     if (!selectedFile) return alert("Please choose a photo.");

//     try {
//       const formData = new FormData();
//       formData.append("name", uploadName);
//       formData.append("price", uploadPrice);
//       formData.append("category", uploadCat);
//       formData.append("img", selectedFile);

//       const res = await axios.post(`${backend_url}/snacks/addsnack`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data.success) {
//         alert("✅ Snack added successfully!");
//         window.location.reload();
//       } else {
//         alert("❌ Failed to add snack.");
//       }
//     } catch (err) {
//       console.error("Upload failed:", err);
//       alert("Error uploading snack");
//     }

//     setShowUpload(false);
//     resetUpload();
//   }

//   async function handleDelete(id: string) {
//   if (!confirm("Are you sure you want to delete this snack?")) return;

//   try {
//     const res = await axios.delete(`${backend_url}/snacks/deletesnack/${id}`);

//     if (res.status === 200) {
//       alert("✅ Snack deleted successfully!");
//       window.location.reload(); // simple reload, or you can re-fetch data instead
//     } else {
//       alert("❌ Failed to delete snack.");
//     }
//   } catch (err) {
//     console.error("Delete failed:", err);
//     alert("Error deleting snack");
//   }
// }


//   return (
//     <div className="min-h-screen bg-white" style={{ color: ink }}>
//       {/* ===== NAVBAR: Mobile ===== */}
//       <header
//         className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b shadow-sm sm:hidden"
//         style={{ borderColor: primary }}
//       >
//         <div className="px-4 py-3 space-y-3">
//           <div className="flex items-center gap-2">
//             <span
//               className="inline-flex h-9 w-9 items-center justify-center rounded-full"
//               style={{ backgroundColor: primary, color: "#fff" }}
//             >
//               🎬
//             </span>
//             <span className="text-sm font-semibold">Theatre Admin</span>
//           </div>

//           <h1
//             className="text-3xl font-extrabold tracking-wide text-center"
//             style={{ color: "#060606", letterSpacing: "0.04em" }}
//           >
//             Snacks <span style={{ color: primary }}>Cart</span>
//           </h1>

//           <div className="flex items-center gap-2">
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search snacks..."
//               className="flex-1 rounded-full px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2"
//               style={{ border: `2px solid ${primary}`, backgroundColor: "#fff" }}
//             />
//             <button
//               onClick={() => alert("All saved to backend")}
//               className="px-3 py-2 text-sm font-semibold rounded-full shadow whitespace-nowrap"
//               style={{ backgroundColor: primary, color: "#fff" }}
//             >
//               Save
//             </button>
//           </div>
//         </div>
//         <div style={{ height: 2, backgroundColor: primary }} />
//       </header>

//       {/* ===== NAVBAR: Desktop ===== */}
//       <header
//         className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b shadow-sm hidden sm:block"
//         style={{ borderColor: primary }}
//       >
//         <div className="mx-auto max-w-7xl px-6">
//           <div className="h-16 grid grid-cols-3 items-center gap-3">
//             <div className="flex items-center gap-2">
//               <span
//                 className="inline-flex h-9 w-9 items-center justify-center rounded-full"
//                 style={{ backgroundColor: primary, color: "#fff" }}
//               >
//                 🎬
//               </span>
//               <span className="text-sm font-semibold">Theatre Admin</span>
//             </div>

//             <div className="flex items-center justify-center">
//               <h1
//                 className="text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-sm"
//                 style={{ color: "#060606", letterSpacing: "0.05em" }}
//               >
//                 Snacks <span style={{ color: primary }}>Cart</span>
//               </h1>
//             </div>

//             <div className="flex items-center justify-end gap-3">
//               <input
//                 type="text"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search snacks..."
//                 className="rounded-full px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 w-56 lg:w-72"
//                 style={{ border: `2px solid ${primary}`, backgroundColor: "#fff" }}
//               />
//               <button
//                 onClick={() => alert("Saved to backend")}
//                 className="px-4 py-2 text-sm font-semibold rounded-full shadow"
//                 style={{ backgroundColor: primary, color: "#fff" }}
//               >
//                 Save Prices
//               </button>
//             </div>
//           </div>
//         </div>
//         <div style={{ height: 2, backgroundColor: primary }} />
//       </header>

//       {/* ===== BODY ===== */}
//       <main className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 space-y-12 sm:space-y-16">
//         {Object.entries(filtered).map(([category, snacks]) => (
//           <section key={category}>
//             <h2
//               className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center underline underline-offset-8"
//               style={{ color: ink, textDecorationColor: primary }}
//             >
//               {category}
//             </h2>

//             <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-x-10 sm:gap-y-10">
//               {(snacks as any[]).map((snack) => {
//                 const isSelected = !!selected[snack.id];
//                 const isEditing =
//                   editing &&
//                   editing.cat === category &&
//                   editing.id === snack.id;

//                 return (
//                   <div
//                     key={snack.id}
//                     onClick={() => toggleSnack(category, snack)}
//                     className="relative rounded-xl w-full max-w-[22rem] bg-white border-2 transition-transform duration-300 cursor-pointer overflow-hidden hover:scale-[1.02] sm:hover:scale-105 mx-auto"
//                     style={{
//                       borderColor: isSelected ? primary : "#e5e5e5",
//                       boxShadow: isSelected
//                         ? "0 6px 16px rgba(229,67,67,0.35)"
//                         : "0 4px 10px rgba(0,0,0,0.08)",
//                     }}
//                   >
//                     <div className="aspect-[4/2.2] overflow-hidden">
//                       <img
//                         src={snack.img}
//                         alt={snack.name}
//                         className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-300"
//                       />
//                     </div>

//                     <div
//                       className="p-4 text-center"
//                       style={{ backgroundColor: "#fff6f6" }}
//                     >
//                       <p
//                         className="font-semibold text-base sm:text-lg"
//                         style={{ color: ink }}
//                       >
//                         {snack.name}
//                       </p>

//                       {!isEditing ? (
//                         <div className="mt-2 flex items-center justify-center gap-2">
//                           <span className="text-sm text-gray-600 sm:text-base">
//                             ₹{snack.price}
//                           </span>
//                           <button
//                             className="h-7 w-7 inline-flex items-center justify-center rounded-md border"
//                             style={{ borderColor: "#e5e5e5", color: primary }}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               startEdit(category, snack);
//                             }}
//                             title="Edit price"
//                           >
//                             ✏️
//                           </button>
//                           <button
//   className="h-7 w-7 inline-flex items-center justify-center rounded-md border ml-2"
//   style={{ borderColor: "#e5e5e5", color: "red" }}
//   onClick={(e) => {
//     e.stopPropagation();
//     handleDelete(snack.id);
//   }}
//   title="Delete snack"
// >
//   🗑️
// </button>

//                         </div>
//                       ) : (
//                         <div className="mt-3 flex items-center justify-center gap-2">
//                           <span className="text-sm">₹</span>
//                           <input
//                             type="number"
//                             min="0"
//                             value={draftPrice}
//                             onChange={(e) => setDraftPrice(e.target.value)}
//                             onClick={(e) => e.stopPropagation()}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter") commitEdit();
//                               if (e.key === "Escape") cancelEdit();
//                             }}
//                             className="w-24 rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2"
//                             style={{ borderColor: primary }}
//                           />
//                           <button
//                             className="px-2 py-1 rounded-md text-white text-sm"
//                             style={{ backgroundColor: primary }}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               commitEdit();
//                             }}
//                           >
//                             ✓
//                           </button>
//                           <button
//                             className="px-2 py-1 rounded-md text-sm border"
//                             style={{ borderColor: "#ccc", color: ink }}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               cancelEdit();
//                             }}
//                           >
//                             ✕
//                           </button>
//                         </div>
//                       )}
//                     </div>

//                     {isSelected && (
//                       <span
//                         className="absolute top-2 right-2 text-xs px-3 py-1 rounded"
//                         style={{ backgroundColor: primary, color: "#fff" }}
//                       >
//                         Added
//                       </span>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         ))}

//         <div className="flex items-center justify-center">
//           <button
//             onClick={() => setShowUpload(true)}
//             className="px-6 py-3 rounded-full font-semibold shadow text-white w-full max-w-xs sm:max-w-none sm:w-auto"
//             style={{ backgroundColor: primary }}
//           >
//             Upload photo & price
//           </button>
//         </div>
//       </main>

//       {/* ✅ Upload Modal */}
//       {showUpload && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
//           <div
//             className="absolute inset-0 bg-black/50"
//             onClick={() => {
//               setShowUpload(false);
//               resetUpload();
//             }}
//           />
//           <div className="relative bg-white rounded-2xl w-[96vw] sm:w-[92vw] max-w-md sm:max-w-xl shadow-xl flex max-h-[92vh] sm:max-h-[90vh] flex-col overflow-hidden">
//             <div className="px-5 sm:px-6 pt-5 pb-3 border-b">
//               <h3
//                 className="text-xl sm:text-2xl font-bold"
//                 style={{ color: primary }}
//               >
//                 Add New Food
//               </h3>
//             </div>

//             <div className="px-5 sm:px-6 py-4 flex-1 overflow-y-auto">
//               <form id="uploadForm" onSubmit={submitUpload} className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <label className="text-sm">
//                     Category
//                     <select
//                       value={uploadCat}
//                       onChange={(e) => setUploadCat(e.target.value)}
//                       className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
//                       style={{ borderColor: primary }}
//                     >
//                       {Object.keys(data).map((c) => (
//                         <option key={c} value={c}>
//                           {c}
//                         </option>
//                       ))}
//                     </select>
//                   </label>

//                   <label className="text-sm">
//                     Price (₹)
//                     <input
//                       type="number"
//                       min="0"
//                       value={uploadPrice}
//                       onChange={(e) => setUploadPrice(e.target.value)}
//                       className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
//                       style={{ borderColor: primary }}
//                       required
//                     />
//                   </label>

//                   <label className="text-sm sm:col-span-2">
//                     Food name
//                     <input
//                       type="text"
//                       value={uploadName}
//                       onChange={(e) => setUploadName(e.target.value)}
//                       className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
//                       style={{ borderColor: primary }}
//                       required
//                     />
//                   </label>
//                 </div>

//                 <label className="block text-sm">
//                   Photo
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={onChooseFile}
//                     className="w-full rounded-md border px-3 py-2 bg-white"
//                     style={{ borderColor: primary }}
//                   />
//                 </label>

//                 {previewUrl && (
//                   <div
//                     className="mt-2 rounded-lg border overflow-hidden"
//                     style={{ borderColor: "#e5e5e5" }}
//                   >
//                     <img
//                       src={previewUrl}
//                       alt="Preview"
//                       className="w-full max-h-64 object-cover"
//                     />
//                   </div>
//                 )}
//               </form>
//             </div>

//             <div className="bg-white border-t px-5 sm:px-6 py-3 flex items-center justify-end gap-3 shrink-0">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowUpload(false);
//                   resetUpload();
//                 }}
//                 className="px-4 py-2 rounded-md border"
//                 style={{ borderColor: "#ccc", color: ink }}
//               >
//                 Cancel
//               </button>
//               <button
//                 form="uploadForm"
//                 type="submit"
//                 className="px-5 py-2 rounded-md text-white font-semibold"
//                 style={{ backgroundColor: primary }}
//               >
//                 Add Item
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <footer
//         className="text-center text-xs sm:text-sm mt-12 sm:mt-16 border-t-2 pt-4"
//         style={{ borderColor: primary, color: ink }}
//       >
//         © {new Date().getFullYear()} Theatre Admin • Red & Black Theme
//       </footer>
//     </div>
//   );
// }



import React, { useMemo, useState } from "react";

// Local images (initial seeds)
import popcorn from "../../assets/popcorn.jpg";
import nachos from "../../assets/nachos.jpg";
import samosa from "../../assets/samosa.jpg";
import frenchfries from "../../assets/FrenchFries.jpg";
import Brownie from "../../assets/Brownie.jpg";
import Caramol from "../../assets/caramol.jpg";
import Hotdog from "../../assets/hotdog.webp";
import Burger from "../../assets/burger.avif";
import nuggets from "../../assets/nuggets.jpg";
import bbq from "../../assets/bbq.jpg";
import chickenroll from "../../assets/chickenroll.jpg";
import chickenpopcorn from "../../assets/chickenpopcorn.jpg";
import cola from "../../assets/cola.jpeg";
import lemon from "../../assets/lemonjuice.avif";
import orange from "../../assets/orangejuice.jpg";
import apple from "../../assets/applejuice.png";
import tea from "../../assets/icedtea.jpg";
import water from "../../assets/water.webp";

const initialData = {
  Vegetarian: [
    { id: 1, name: "Popcorn", img: popcorn, price: 120 },
    { id: 2, name: "Nachos", img: nachos, price: 150 },
    { id: 3, name: "Samosa", img: samosa, price: 90 },
    { id: 4, name: "French Fries", img: frenchfries, price: 140 },
    { id: 5, name: "Brownie", img: Brownie, price: 120 },
    { id: 6, name: "Caramel Popcorn", img: Caramol, price: 180 },
  ],
  "Non Vegetarian": [
    { id: 7, name: "Hot Dog", img: Hotdog, price: 160 },
    { id: 8, name: "Chicken Burger", img: Burger, price: 240 },
    { id: 9, name: "Nuggets", img: nuggets, price: 210 },
    { id: 10, name: "BBQ Wings", img: bbq, price: 260 },
    { id: 11, name: "Chicken Roll", img: chickenroll, price: 180 },
    { id: 12, name: "Chicken Popcorn", img: chickenpopcorn, price: 190 },
  ],
  Juice: [
    { id: 13, name: "Cola", img: cola, price: 80 },
    { id: 14, name: "Lemonade", img: lemon, price: 90 },
    { id: 15, name: "Orange Juice", img: orange, price: 110 },
    { id: 16, name: "Apple Juice", img: apple, price: 110 },
    { id: 17, name: "Iced Tea", img: tea, price: 100 },
    { id: 18, name: "Water", img: water, price: 40 },
  ],
};

export default function SnacksPicker() {
  const primary = "#E54343";
  const ink = "#060606";

  const [data, setData] = useState(initialData);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState({});
  const [editing, setEditing] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [draftPrice, setDraftPrice] = useState("");
  const [draftImg, setDraftImg] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    const next = {};
    for (const [cat, items] of Object.entries(data)) {
      next[cat] = items.filter((s) => s.name.toLowerCase().includes(q));
    }
    return next;
  }, [data, query]);

  function toggleSnack(cat, snack) {
    setSelected((p) => ({ ...p, [snack.id]: p[snack.id] ? 0 : 1 }));
  }

  function startEdit(cat, item) {
    setEditing({ cat, id: item.id });
    setDraftName(item.name);
    setDraftPrice(String(item.price));
    setDraftImg(item.img);
  }

  function cancelEdit() {
    setEditing(null);
    setDraftName("");
    setDraftPrice("");
    setDraftImg("");
  }

  function commitEdit() {
    if (!editing) return;
    const { cat, id } = editing;
    const value = Number(draftPrice);
    if (Number.isNaN(value) || value < 0) {
      alert("Please enter a valid price.");
      return;
    }
    if (!draftName.trim()) {
      alert("Please enter a valid name.");
      return;
    }
    setData((prev) => {
      const updated = { ...prev };
      updated[cat] = prev[cat].map((it) =>
        it.id === id ? { ...it, name: draftName.trim(), price: value, img: draftImg } : it
      );
      return updated;
    });
    cancelEdit();
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
        className="sticky top-0 z-40 bg-white border-b shadow-sm"
        style={{ borderColor: primary }}
      >
        <div className="flex justify-between items-center px-6 py-3">
          <h1 className="text-3xl font-extrabold tracking-wide">
            Snacks <span style={{ color: primary }}>Cart</span>
          </h1>
          <input
            type="text"
            placeholder="Search snacks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded-full px-4 py-2 text-sm"
            style={{ borderColor: primary }}
          />
        </div>
      </header>

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
                  editing && editing.cat === category && editing.id === snack.id;
                return (
                  <div
                    key={snack.id}
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
                          <div className="flex justify-center items-center gap-2 mt-2">
                            <span>SEK {snack.price}</span>
                            <button
                              onClick={() => startEdit(category, snack)}
                              className="text-red-500 text-sm"
                            >
                              ✏️ Edit
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