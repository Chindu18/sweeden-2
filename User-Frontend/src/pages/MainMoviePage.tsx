"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Badge from "@/components/components/Badge";
import Rating from "@/components/components/Rating";
import moviePosterFallback from "@/assets/movie-poster-1.jpg";
import { Sparkles, Ticket } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import Footer from "@/components/components/Footer";

interface Movie {
  _id: string;
  title: string;
  genre?: string;
  cast: { actor: string; actress: string };
  posters: string[];
  rating?: number;
}


const snacks = [
  {
    id: 1,
    name: "Popcorn",
    image: heroImage,
  },
  {
    id: 2,
    name: "Nachos",
    image: heroImage,
  },
  {
    id: 3,
    name: "Coca-Cola",
    image: heroImage,
  },
  {
    id: 4,
    name: "French Fries",
    image: heroImage,
  },
];



// 🌟 Hero Section
const Hero = () => {
  
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Cinema theater interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 opacity-95"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
        
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
          <span className="text-sm font-medium text-primary-foreground">Tamil Cinema Magic Awaits</span>
        </div>

        

         {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in">
          <span className="text-primary-foreground">Experience </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7]">
            Cinematic Moments
          </span>
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed animate-fade-in">
          Book your favorite Tamil films with instant QR code tickets, pre-order delicious snacks, 
          and enjoy a seamless cinema experience in Sweden.
        </p>

        <Button
          
          className="gap-3 px-10 text-md py-8 rounded-full font-semibold shadow-2xl animate-fade-in bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white"
          onClick={() => {
            const section = document.getElementById("now-showing");
            if (section) section.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Ticket className="w-5 h-5" />
          Browse Movies Now
        </Button>
      </div>
    </section>
  );
};

// 🎬 Movie Card
const MovieCard = ({ movie }: { movie: Movie }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.title}/${movie._id}`)}
      // className="group bg-gradient-to-b from-[#101010] to-[#181818] rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(255,75,75,0.4)] hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer"
      className="group rounded-2xl hover:shadow-[0_0_35px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.posters[0] || moviePosterFallback}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-blue-700/90 rounded-full">
          <Badge status="Now Showing" />
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-black mb-1 line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-400 mb-1">
            {movie.genre || "Drama / Action"}
          </p>
          <p className="text-xs text-gray-500 line-clamp-1">
            Cast: {movie.cast.actor} & {movie.cast.actress}
          </p>
        </div>

        <div className="h-px bg-gray-700"></div>

        <div className="flex items-center justify-between gap-4">
          <Rating score={movie.rating || 4.5} />
          <Button
            variant="default"
            size="sm"
            className="rounded-full flex-1 text-white font-semibold bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movie/${movie.title}/${movie._id}`);
            }}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

// 🎞️ Main Page
const MainMoviePage = () => {
  const [snacks, setSnacks] = useState([]);

useEffect(() => {
  const fetchSnacks = async () => {
    try {
      const res = await axios.get(`${backend_url}/snacks/getsnack`);
      if (res.data.success) {
        setSnacks(res.data.snacks);
      }
    } catch (err) {
      console.error("Error fetching snacks:", err);
    }
  };
  fetchSnacks();
}, []);
  const backend_url = "http://localhost:8004";
  const [movies, setMovies] = useState<Movie[]>([]);

  const fetchCurrentMovies = async () => {
    try {
      const res = await axios.get(`${backend_url}/movie/currentMovie`);
      const data = res.data.data[0];
      if (data) {
        const allMovies = [
          data.movie1,
          data.movie2,
          data.movie3,
          data.movie4,
          data.movie5,
        ].filter(Boolean);
        setMovies(allMovies);
      }
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    }
  };

  useEffect(() => {
    fetchCurrentMovies();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <Hero />

      {/* ✅ Now Showing Section */}
      <section id="now-showing" className="py-20 bg-white">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7]">
                Tamil Blockbusters
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the latest and greatest Tamil films showing in Swedish theaters
            </p>
          </div>
          <div className="px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-10 justify-center">
          {movies.length > 0 ? (
            movies.map((m) => <MovieCard key={m._id} movie={m} />)
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              No movies currently showing.
            </p>
          )}
        </div>

        
        </div>
      </section>
      
      {/* Snacks Section */}
{/* Snacks Section */}
<section className="py-20 bg-[#bbbec3]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
<div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Delicious Snacks
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pre-order your favorite cinema treats and have them ready when you arrive
            </p>
          </div>

    {/* Snack Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {snacks.map((snack) => (
        <div
          key={snack.id}
          className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer border border-transparent hover:border-blue-400"
        >
          {/* Image */}
          <div className="aspect-square overflow-hidden">
            <img
              src={snack.img}
              alt={`${snack.name} snack`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Text */}
          <div className="p-4 text-center bg-white">
            <h4 className="font-bold text-lg text-black">{snack.name}</h4>
          </div>
        </div>
      ))}
    </div>

   
  </div>
</section>
    </div>
  );
};




export default MainMoviePage;
