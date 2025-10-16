import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import moviePoster1 from "@/assets/movie-poster-1.jpg";
import moviePoster2 from "@/assets/movie-poster-2.jpg";
import moviePoster3 from "@/assets/movie-poster-3.jpg";
import axios from "axios";

import { useEffect, useState } from "react";

const Movies = () => {
  const backend_url = "https://swedenn-backend.onrender.com";
  const [playTrailer, setPlayTrailer] = useState(false);
  const [Movielist, setMovielist] = useState({
    title: "movie title",
    cast: { hero: "Hero", heroine: "Heroine", villain: "Villain", supportArtists: [] },
    crew: { director: "Director", producer: "Producer", musicDirector: "Music Director", cinematographer: "Cinematographer" },
    posters: [],
    trailer: "",
    showTimings: [],
    ticketPrice: { kids: 0, adults: 0 },
    bookingOpenDays: 3,
  });

  const navigate = useNavigate();

  const fetchdata = async () => {
    try {
      const response = await axios.get(`${backend_url}/movie/getmovie`);
      const data = response.data.data;
      if (data && data.length > 0) {
        const lastMovie = data[data.length - 1];
        setMovielist(lastMovie);
      }
    } catch (error) {
      console.log("Movie fetch error", error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  // Prepare carousel items
  const carouselItems = [];

  if (Movielist.trailer) {
    carouselItems.push({
      id: "trailer",
      type: "trailer",
      poster: Movielist.posters?.[0] || moviePoster1,
      video: Movielist.trailer,
      title: Movielist.title,
    });
  }

  const posterItems =
    Movielist.posters && Movielist.posters.length > 0
      ? Movielist.posters.map((photo, index) => ({
          id: index + 1,
          type: "poster",
          image: `${photo}`,
          title: Movielist.title || `Movie ${index + 1}`,
        }))
      : [
          { id: 1, type: "poster", image: moviePoster1, title: Movielist.title || "Default Movie" },
          { id: 2, type: "poster", image: moviePoster2, title: "Latest Blockbuster" },
          { id: 3, type: "poster", image: moviePoster3, title: "Classic Tamil Films" },
        ];

  carouselItems.push(...posterItems);

  // Cast & Crew members
 

const castMembers = [
    { id: 1, name: Movielist.cast?.actor || "Hero Name", role: "Hero" },
    { id: 2, name: Movielist.cast?.actress || "Heroine Name", role: "Heroine" },
    { id: 3, name: Movielist.cast?.villan || "Villain Name", role: "Villain" },
    { id: 4, name: Movielist.cast?.supporting || "Support Artists", role: "Support" },
  ];


  const crewMembers = [
    { id: 1, name: Movielist.crew?.director || "Director", role: "Direction" },
    { id: 2, name: Movielist.crew?.musicDirector || "Music Director", role: "Music" },
    { id: 3, name: Movielist.crew?.cinematographer || "Cinematographer", role: "Cinematography" },
    { id: 4, name: Movielist.crew?.producer || "Producer", role: "Production" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Poster Carousel */}
      <section className="relative bg-gradient-to-b from-cinema-black to-background overflow-hidden">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-lg">
              Now Showing
            </h1>
            <div className="w-32 h-1 bg-accent mx-auto rounded-full"></div>
          </div>

         <Carousel className="w-full animate-slide-up">
  <CarouselContent>
    {carouselItems.map((item) => (
      <CarouselItem key={item.id}>
        <div
          className="relative group w-full 
          h-[250px] sm:h-[400px] md:h-[600px] lg:h-[700px] 
          flex items-center justify-center overflow-hidden rounded-2xl"
        >
          {/* 🎬 Trailer Poster Before Play */}
          {item.type === "trailer" && !playTrailer && (
            <>
              <img
                src={item.poster}
                alt="Trailer Poster"
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
              <div
                className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                onClick={() => setPlayTrailer(true)}
              >
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-black/60 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <span className="text-white text-3xl sm:text-4xl">&#9658;</span>
                </div>
              </div>
            </>
          )}

          {/* 🎥 Trailer Playing */}
          {item.type === "trailer" && playTrailer && (
            <video
              src={item.video}
              controls
              autoPlay
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          )}

          {/* 🎞️ Poster Items */}
          {item.type === "poster" && (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          )}

          {/* 🏷️ Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-b-2xl">
            <h3 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1 drop-shadow-lg">
              {item.title}
            </h3>
            {item.type === "trailer" && (
              <p className="text-xs sm:text-sm md:text-lg text-white/80">Trailer</p>
            )}
          </div>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>

  {/* Navigation Buttons */}
  <CarouselPrevious className="left-2 sm:left-4 h-8 w-8 sm:h-10 sm:w-10 bg-white/10 backdrop-blur-md border-white/20 hover:bg-accent hover:border-accent" />
  <CarouselNext className="right-2 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 bg-white/10 backdrop-blur-md border-white/20 hover:bg-accent hover:border-accent" />
</Carousel>


        </div>
      </section>

      {/* Cast Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Star Cast</h2>
            <p className="text-muted-foreground text-lg">Meet the talented artists</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {castMembers.map((cast, index) => (
              <Card
                key={cast.id}
                className="border-2 border-border hover:border-accent transition-all duration-300 hover-lift animate-scale-in overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full flex items-center justify-center border-4 border-accent/20 group-hover:border-accent transition-colors">
                    <span className="text-5xl group-hover:scale-110 transition-transform">👤</span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">{cast.name}</h3>
                  <p className="text-accent text-sm font-semibold">{cast.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Crew Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Creative Crew</h2>
            <p className="text-muted-foreground text-lg">The masterminds behind the magic</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {crewMembers.map((crew, index) => (
              <Card
                key={crew.id}
                className="border-2 border-border hover:border-accent transition-all duration-300 hover-lift animate-scale-in overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full flex items-center justify-center border-4 border-accent/20 group-hover:border-accent transition-colors">
                    <span className="text-5xl group-hover:scale-110 transition-transform">🎬</span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">{crew.name}</h3>
                  <p className="text-accent text-sm font-semibold">{crew.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Discount & Contact Section */}
      <section className="py-20 bg-gradient-to-br from-cinema-black via-secondary to-cinema-black text-white relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">Discount & Contact</h2>
            <div className="w-32 h-1 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="text-center mb-12 px-4 sm:px-0">
            <Button
              onClick={() => navigate("/book-ticket")}
              className="bg-accent hover:bg-accent/90 text-white font-bold text-sm sm:text-lg md:text-2xl py-3 sm:py-4 md:py-8 px-4 sm:px-8 md:px-16 rounded-full cinema-glow hover:scale-105 transition-all duration-300 shadow-2xl w-full sm:w-auto"
              size="lg"
            >
              Book Ticket Now
            </Button>
          </div>

          {/* Discount Banner */}
          <Card className="bg-gradient-to-r from-accent to-accent/80 border-accent cinema-glow mb-12 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Sparkles className="w-8 h-8 animate-pulse text-yellow-600" />
                <h3 className="text-3xl md:text-4xl font-bold text-center text-white">
                   Discount at Video Speed 
                </h3>
                <Sparkles className="w-8 h-8 animate-pulse text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          {/* Location & Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Location */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover-lift w-full">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                  <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">Location</h3>
                </div>
                <p className="text-base sm:text-lg mb-2 sm:mb-4 text-white">varby gard-varby gard t-bana,varby alle 14,143 40 varby,sweden</p>
                <a
                  href="https://share.google/reJxV2DULn5kWR8p9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 sm:gap-2 text-accent hover:text-accent/80 font-semibold text-base sm:text-lg transition-colors"
                >
                  Utbildningsvagen 2A,147 40 Tumba,sweden
                </a>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover-lift w-full">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                  <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">Contact</h3>
                </div>
                <div className="space-y-1 sm:space-y-2 text-base sm:text-lg text-white">
                  <p>+46704859228</p>
                  <p>+46739844564</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Movies;
