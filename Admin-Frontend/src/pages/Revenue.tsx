// // "use client";
// // import { useState, useEffect } from "react";
// // import { X } from "lucide-react";
// // import { Card, CardContent } from "@/components/ui/card";
// // import axios from "axios";

// // interface Cast {
// //   actor: string;
// //   actress: string;
// //   villan: string;
// //   supporting: string;
// // }

// // interface Crew {
// //   director: string;
// //   producer: string;
// //   musicDirector: string;
// //   cinematographer: string;
// // }

// // interface ShowPrices {
// //   adult: string;
// //   kids: string;
// // }

// // interface Show {
// //   date: string;
// //   time: string;
// //   prices: {
// //     online: ShowPrices;
// //     videoSpeed: ShowPrices;
// //     soder: ShowPrices;
// //   };
// // }

// // interface Movie {
// //   _id: string;
// //   title: string;
// //   cast: Cast;
// //   crew: Crew;
// //   posters: string[];
// //   shows: Show[];
// // }

// // const Revenue = () => {
// //   const backend_url = "http://localhost:8004";

// //   const [movies, setMovies] = useState<Movie[]>([]);
// //   const [revenueData, setRevenueData] = useState<
// //     Record<string, { paid: number; pending: number }>
// //   >({});
// //   const [modalMovie, setModalMovie] = useState<Movie | null>(null);

// //   const formatTime = (timeString: string) => {
// //     const [hour, minute] = timeString.split(":");
// //     const date = new Date();
// //     date.setHours(Number(hour), Number(minute));
// //     return date.toLocaleTimeString(undefined, {
// //       hour: "numeric",
// //       minute: "2-digit",
// //     });
// //   };

// //   const formatDate = (dateString: string) => {
// //     const options: Intl.DateTimeFormatOptions = {
// //       weekday: "short",
// //       day: "numeric",
// //       month: "short",
// //     };
// //     return new Date(dateString).toLocaleDateString(undefined, options);
// //   };

// //   // ---------------------- Fetch Movies & Revenue ----------------------
// //   const fetchMovies = async () => {
// //     try {
// //       const res = await axios.get(`${backend_url}/movie/getmovie`);

// //       // ✅ Safely extract movie data
// //       const moviesData: Movie[] =
// //         Array.isArray(res.data?.data) ? res.data.data : [];

// //       setMovies(moviesData);

// //       const revData: Record<string, { paid: number; pending: number }> = {};

// //       // ✅ Fetch revenue for each movie in parallel
// //       await Promise.all(
// //         moviesData.map(async (movie) => {
// //           try {
// //             const [pendingResp, paidResp] = await Promise.all([
// //               axios.get(`${backend_url}/dashboard/pending`, {
// //                 params: {
// //                   movieName: movie.title,
// //                   paymentStatus: "pending",
// //                 },
// //               }),
// //               axios.get(`${backend_url}/dashboard/pending`, {
// //                 params: {
// //                   movieName: movie.title,
// //                   paymentStatus: "paid",
// //                 },
// //               }),
// //             ]);

// //             revData[movie.title] = {
// //               pending:
// //                 pendingResp.data?.data?.reduce(
// //                   (sum: number, b: any) => sum + (b.totalAmount || 0),
// //                   0
// //                 ) || 0,
// //               paid:
// //                 paidResp.data?.data?.reduce(
// //                   (sum: number, b: any) => sum + (b.totalAmount || 0),
// //                   0
// //                 ) || 0,
// //             };
// //           } catch (err) {
// //             console.warn(`Error fetching revenue for ${movie.title}:`, err);
// //             revData[movie.title] = { paid: 0, pending: 0 };
// //           }
// //         })
// //       );

// //       setRevenueData(revData);
// //     } catch (err) {
// //       console.error("Error fetching movies or revenue:", err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchMovies();
// //   }, []);

// //   const getPosterSrc = (poster: File | string) =>
// //     poster instanceof File ? URL.createObjectURL(poster) : poster;

// //   return (
// //     <div className="min-h-screen bg-background p-8">
// //       {/* Movie Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {Array.isArray(movies) && movies.length > 0 ? (
// //           [...movies].reverse().map((movie) => (
// //             <div
// //               key={movie._id}
// //               className="cursor-pointer hover:shadow-lg transition rounded-lg overflow-hidden"
// //               onClick={() => setModalMovie(movie)}
// //             >
// //               <Card>
// //                 <img
// //                   src={getPosterSrc(movie.posters?.[0] || "/placeholder.png")}
// //                   alt={movie.title}
// //                   className="w-full h-64 object-cover rounded-t"
// //                 />
// //                 <CardContent className="flex flex-col gap-2 p-3">
// //                   <span className="font-bold text-lg">{movie.title}</span>
// //                   <span>
// //                     <strong>Paid:</strong> SEK
// //                     {revenueData[movie.title]?.paid ?? 0} &nbsp;
// //                     <strong>Pending:</strong> SEK
// //                     {revenueData[movie.title]?.pending ?? 0}
// //                   </span>
// //                 </CardContent>
// //               </Card>
// //             </div>
// //           ))
// //         ) : (
// //           <p className="col-span-full text-center text-gray-500 mt-10">
// //             No movies available
// //           </p>
// //         )}
// //       </div>

// //       {/* Modal */}
// //       {modalMovie && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-lg p-6 w-3/4 max-w-xl relative overflow-auto max-h-[90vh] shadow-lg">
// //             <button
// //               className="absolute top-3 right-3 hover:text-red-500"
// //               onClick={() => setModalMovie(null)}
// //             >
// //               <X />
// //             </button>
// //             <h2 className="text-2xl font-bold mb-4">{modalMovie.title}</h2>
// //             <p className="mb-2">
// //               <strong>Cast:</strong>{" "}
// //               {Object.values(modalMovie.cast).filter(Boolean).join(", ")}
// //             </p>
// //             <p className="mb-2">
// //               <strong>Crew:</strong>{" "}
// //               {Object.values(modalMovie.crew).filter(Boolean).join(", ")}
// //             </p>
// //             <p className="mb-2 font-semibold">Shows:</p>
// //             <ul className="list-disc pl-5 space-y-1">
// //               {modalMovie.shows.map((show, idx) => (
// //                 <li key={idx}>
// //                   {formatDate(show.date)} - {formatTime(show.time)} —{" "}
// //                   <span className="text-sm text-gray-700">
// //                     Online: {show.prices.online.adult}/
// //                     {show.prices.online.kids}, Video:{" "}
// //                     {show.prices.videoSpeed.adult}/
// //                     {show.prices.videoSpeed.kids}, Soder:{" "}
// //                     {show.prices.soder.adult}/{show.prices.soder.kids}
// //                   </span>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Revenue;




// import { useState, useEffect } from "react";
// import { IndianRupee, X } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import axios from "axios";

// interface Cast {
//   actor: string;
//   actress: string;
//   villan: string;
//   supporting: string;
// }

// interface Crew {
//   director: string;
//   producer: string;
//   musicDirector: string;
//   cinematographer: string;
// }

// interface ShowPrices {
//   adult: string;
//   kids: string;
// }

// interface Show {
//   date: string;
//   time: string;
//   prices: {
//     online: ShowPrices;
//     videoSpeed: ShowPrices;
//     soder: ShowPrices;
//   };
// }

// interface Movie {
//   _id: string;
//   title: string;
//   cast: Cast;
//   crew: Crew;
//   posters: string[];
//   shows: Show[];
// }

// const Revenue = () => {
//   const backend_url = "http://localhost:8004";

//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [revenueData, setRevenueData] = useState<Record<string, { paid: number; pending: number }>>({});
//   const [modalMovie, setModalMovie] = useState<Movie | null>(null);

//   const formatTime = (timeString: string) => {
//     const [hour, minute] = timeString.split(":");
//     const date = new Date();
//     date.setHours(Number(hour), Number(minute));
//     return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
//   };

//   const formatDate = (dateString: string) => {
//     const options = { weekday: "short", day: "numeric", month: "short" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   // ---------------------- Fetch Movies & Revenue ----------------------
//   const fetchMovies = async () => {
//     try {
//       const res = await axios.get(`${backend_url}/movie/getmovie`);
//       const moviesData: Movie[] = res.data.data;
//       setMovies(moviesData);

//       const revData: Record<string, { paid: number; pending: number }> = {};

//       // Fetch revenue for each movie
//       await Promise.all(
//         moviesData.map(async (movie) => {
//           const [pendingResp, paidResp] = await Promise.all([
//             axios.get(`${backend_url}/dashboard/pending`, { params: { movieName: movie.title, paymentStatus: "pending" } }),
//             axios.get(`${backend_url}/dashboard/pending`, { params: { movieName: movie.title, paymentStatus: "paid" } }),
//           ]);

//           revData[movie.title] = {
//             pending: pendingResp.data.data?.reduce((sum: number, b: any) => sum + b.totalAmount, 0) || 0,
//             paid: paidResp.data.data?.reduce((sum: number, b: any) => sum + b.totalAmount, 0) || 0,
//           };
//         })
//       );

//       setRevenueData(revData);
//     } catch (err) {
//       console.error("Error fetching movies or revenue:", err);
//     }
//   };

//   useEffect(() => {
//     fetchMovies();
//   }, []);

//   const getPosterSrc = (poster: File | string) =>
//     poster instanceof File ? URL.createObjectURL(poster) : poster;

//   return (
//     <div className="min-h-screen bg-background p-8">
//       {/* Movie Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[...movies].reverse().map((movie) => (
//           <Card key={movie._id} className="cursor-pointer hover:shadow-lg" onClick={() => setModalMovie(movie)}>
//             <img src={getPosterSrc(movie.posters[0])} alt={movie.title} className="w-full h-64 object-cover" />
//             <CardContent className="flex flex-col gap-2 p-3">
//               <span className="font-bold">{movie.title}</span>
//               <span>
//                 <strong>Paid:</strong> SEK{revenueData[movie.title]?.paid || 0} &nbsp;
//                 <strong>Pending:</strong> SEK{revenueData[movie.title]?.pending || 0}
//               </span>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Modal */}
//       {modalMovie && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded p-6 w-3/4 max-w-xl relative overflow-auto max-h-[90vh]">
//             <button className="absolute top-2 right-2" onClick={() => setModalMovie(null)}>
//               <X />
//             </button>
//             <h2 className="text-2xl font-bold mb-4">{modalMovie.title}</h2>
//             <p className="mb-2">
//               <strong>Cast:</strong> {Object.values(modalMovie.cast).join(", ")}
//             </p>
//             <p className="mb-2">
//               <strong>Crew:</strong> {Object.values(modalMovie.crew).join(", ")}
//             </p>
//             <p className="mb-2">
//               <strong>Shows:</strong>
//             </p>
//             <ul className="list-disc pl-5">
//               {modalMovie.shows.map((show, idx) => (
//                 <li key={idx}>
//                   {formatDate(show.date)} - {formatTime(show.time)} - Online: {show.prices.online.adult}/{show.prices.online.kids}, Video: {show.prices.videoSpeed.adult}/{show.prices.videoSpeed.kids}, Soder: {show.prices.soder.adult}/{show.prices.soder.kids}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Revenue;
"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

interface Cast { actor: string; actress: string; villan: string; supporting: string; }
interface Crew { director: string; producer: string; musicDirector: string; cinematographer: string; }
interface ShowPrices { adult: string; kids: string; }
interface Show {
  date: string;
  time: string;
  prices: {
    online: ShowPrices;
    videoSpeed: ShowPrices;
    soder: ShowPrices;
  };
}
interface Movie {
  _id: string;
  title: string;
  cast: Cast;
  crew: Crew;
  posters: string[];
  shows: Show[];
}

const Revenue = () => {
  const backend_url = "http://localhost:8004";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [revenueData, setRevenueData] = useState<Record<string, { paid: number; pending: number }>>({});
  const [modalMovie, setModalMovie] = useState<Movie | null>(null);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hour), Number(minute));
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // ---------------------- Fetch Movies & Revenue ----------------------
  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${backend_url}/movie/getmovie`);
      const moviesData: Movie[] = Array.isArray(res.data?.data) ? res.data.data : [];
      setMovies(moviesData);

      const revData: Record<string, { paid: number; pending: number }> = {};
      await Promise.all(
        moviesData.map(async (movie) => {
          try {
            const [pendingResp, paidResp] = await Promise.all([
              axios.get(`${backend_url}/dashboard/pending`, { params: { movieName: movie.title, paymentStatus: "pending" } }),
              axios.get(`${backend_url}/dashboard/pending`, { params: { movieName: movie.title, paymentStatus: "paid" } }),
            ]);

            revData[movie.title] = {
              pending: pendingResp.data?.data?.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0) || 0,
              paid: paidResp.data?.data?.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0) || 0,
            };
          } catch (err) {
            console.warn(`Error fetching revenue for ${movie.title}:`, err);
            revData[movie.title] = { paid: 0, pending: 0 };
          }
        })
      );

      setRevenueData(revData);
    } catch (err) {
      console.error("Error fetching movies or revenue:", err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const getPosterSrc = (poster: File | string) => (poster instanceof File ? URL.createObjectURL(poster) : poster);

  const toggleFlip = (id: string) => setFlipped((f) => ({ ...f, [id]: !f[id] }));

  const currency = (n: number) => new Intl.NumberFormat(undefined, { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);

  const RatioBar = ({ paid, pending }: { paid: number; pending: number }) => {
    const total = Math.max(paid + pending, 1);
    const paidPct = Math.round((paid / total) * 100);
    const pendingPct = 100 - paidPct;
    return (
      <div className="w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
        <div className="h-2" style={{ width: `${paidPct}%` }} className="bg-emerald-500"></div>
        <div className="h-2" style={{ width: `${pendingPct}%` }} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Movie Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(movies) && movies.length > 0 ? (
          [...movies].reverse().map((movie) => {
            const rev = revenueData[movie.title] || { paid: 0, pending: 0 };
            const isFlipped = !!flipped[movie._id];
            const total = rev.paid + rev.pending;
            return (
              <div key={movie._id} className="[perspective:1000px]">
                <div
                  className={`relative h-full min-h-[360px] w-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
                >
                  {/* FRONT */}
                  <Card
                    className="absolute inset-0 [backface-visibility:hidden] overflow-hidden cursor-pointer"
                    onClick={() => toggleFlip(movie._id)}
                    title="Tap to see revenue"
                  >
                    <img
                      src={getPosterSrc(movie.posters?.[0] || "/placeholder.png")}
                      alt={movie.title}
                      className="h-64 w-full object-cover"
                    />
                    <CardContent className="flex flex-col gap-2 p-4">
                      <span className="text-lg font-extrabold leading-tight">{movie.title}</span>
                      <span className="text-sm text-slate-600">Tap image to flip and view revenue</span>
                    </CardContent>
                  </Card>

                  {/* BACK */}
                  <Card
                    className="absolute inset-0 rotate-y-180 [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden"
                  >
                    <CardContent className="flex h-full flex-col justify-between p-5">
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Revenue</div>
                        <div className="mb-4 text-xl font-extrabold leading-tight">{movie.title}</div>
                        <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
                            <div className="text-xs font-semibold uppercase">Paid</div>
                            <div className="text-lg font-bold">{currency(rev.paid)}</div>
                          </div>
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
                            <div className="text-xs font-semibold uppercase">Pending</div>
                            <div className="text-lg font-bold">{currency(rev.pending)}</div>
                          </div>
                        </div>
                        <div className="mb-1 text-xs text-slate-600 dark:text-slate-400">Paid vs Pending</div>
                        <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div className="absolute left-0 top-0 h-3 bg-emerald-500" style={{ width: `${(rev.paid / Math.max(total, 1)) * 100}%` }} />
                          <div className="absolute right-0 top-0 h-3 bg-amber-500/60" style={{ width: `${(rev.pending / Math.max(total, 1)) * 100}%` }} />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                          <span>Total</span>
                          <span className="font-semibold">{currency(total)}</span>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between text-sm">
                        <button
                          type="button"
                          onClick={() => toggleFlip(movie._id)}
                          className="rounded-full border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                          title="Flip back"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalMovie(movie)}
                          className="rounded-full bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                        >
                          Details
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-full mt-10 text-center text-gray-500">No movies available</p>
        )}
      </div>

      {/* Modal */}
      {modalMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative max-h-[90vh] w-3/4 max-w-xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
            <button className="absolute right-3 top-3 hover:text-red-500" onClick={() => setModalMovie(null)}>
              <X />
            </button>
            <h2 className="mb-4 text-2xl font-bold">{modalMovie.title}</h2>
            <p className="mb-2"><strong>Cast:</strong> {Object.values(modalMovie.cast).filter(Boolean).join(", ")}</p>
            <p className="mb-2"><strong>Crew:</strong> {Object.values(modalMovie.crew).filter(Boolean).join(", ")}</p>
            <p className="mb-2 font-semibold">Shows:</p>
            <ul className="list-disc space-y-1 pl-5">
              {modalMovie.shows.map((show, idx) => (
                <li key={idx}>
                  {formatDate(show.date)} - {formatTime(show.time)} — {" "}
                  <span className="text-sm text-gray-700">
                    Online: {show.prices.online.adult}/{show.prices.online.kids}, Video: {show.prices.videoSpeed.adult}/{show.prices.videoSpeed.kids}, Soder: {show.prices.soder.adult}/{show.prices.soder.kids}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Revenue;