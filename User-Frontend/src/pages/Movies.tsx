import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Calendar, Clock, Ticket, Sparkles } from "lucide-react";
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
  const backend_url='https://swedenn-backend.onrender.com'
 
  const navigate = useNavigate();
 const [Movielist, setMovielist] = useState({
  title: "movie title",
  cast: { hero: "hero", heroine: "", villain: "", supportArtists: [] },
  crew: { director: "", producer: "", musicDirector: "", cinematographer: "" },
  photos: [],
  showTimings: [],
  ticketPrice: { kids: 0, adults: 0 },
  bookingOpenDays: 3,
});



  const fetchdata=async()=>{
      try {
        console.log('working')
        const response = await axios.get(`${backend_url}/movie/getmovie`);
      let data = response.data.data; // Use 'let' if you want to reassign
          if (data !== undefined && data.length > 0) {
        const lastMovie = data[data.length - 1];
        console.log(lastMovie)
        setMovielist(lastMovie);
      }

      
    } catch (error) {
      console.log('Movie fetch error', error);
    }
  }
  
  useEffect(()=>{
     fetchdata();
  },[])
  

const posters = Movielist.posters && Movielist.posters.length > 0
  ? Movielist.posters.map((photo, index) => ({
      id: index + 1,
      image: `${photo}`, // ✅ full backend path
      title: Movielist.title || `Movie ${index + 1}`,
    }))
  : [
      { id: 1, image: moviePoster1, title: Movielist.title || "Default Movie" },
      { id: 2, image: moviePoster2, title: "Latest Blockbuster" },
      { id: 3, image: moviePoster3, title: "Classic Tamil Films" },
    ];









const castMembers = [
  { id: 1, name: Movielist.cast?.actor || "Hero Name", role: "Hero" },
  { id: 2, name: Movielist.cast?.actress || "Heroine Name", role: "Heroine" },
  { id: 3, name: Movielist.cast?.villan || "Villain Name", role: "Villain" },
  { id: 4, name: Movielist.cast?.supporting|| "Support Artists", role: "Comic" },
];


  const crewMembers = [
    { id: 1, name:Movielist.crew?.director|| "Director", role: "Direction" },
    { id: 2, name:Movielist.crew?.musicDirector|| "Music Director", role: "Music" },
    { id: 3, name:Movielist.crew?.cinematographer|| "Cinematographer", role: "Cinematography" },
    { id: 4, name:Movielist.crew?.producer|| "Producer", role: "Production" },
  ];

  const prices = [
    { type: "Adult", price: "₹140", icon: "👤" },
    { type: "Video Speed Adult", price: "₹120", icon: "⚡" },
    { type: "Pay at Sodertalije", price: "₹120", icon: "💳" },
    { type: "Extra Seat (Video Speed)", price: "₹80", icon: "🪑" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Poster Carousel - Full Width */}
      <section className="relative bg-gradient-to-b from-cinema-black to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-lg">
              Now Showing
            </h1>
            <div className="w-32 h-1 bg-accent mx-auto rounded-full"></div>
          </div>
          
          <Carousel className="w-full animate-slide-up">
            <CarouselContent>
              {posters.map((poster) => (
                <CarouselItem key={poster.id}>
                  <div className="relative group">
                    <div className="overflow-hidden rounded-2xl shadow-2xl">
                      <img
                        src={poster.image}
                        alt={poster.title}
                        className="w-full h-[100vh] object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h3 className="text-4xl md:text-5xl font-bold mb-2">{poster.title}</h3>
                        <p className="text-lg text-white/80">Sweden’s Home for Tamil Cinema</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 h-14 w-14 bg-white/10 backdrop-blur-md border-white/20 hover:bg-accent hover:border-accent" />
            <CarouselNext className="right-4 h-14 w-14 bg-white/10 backdrop-blur-md border-white/20 hover:bg-accent hover:border-accent" />
          </Carousel>
        </div>
      </section>
  

      {/* Cast Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              Star Cast
            </h2>
            <p className="text-muted-foreground text-lg">Meet the talented artists</p>
          </div>
          
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
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
          </div> */}
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
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              Creative Crew
            </h2>
            <p className="text-muted-foreground text-lg">The masterminds behind the magic</p>
          </div>
          
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
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
          </div> */}
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

      {/* Pricing & Details Section */}
      <section className="py-20 bg-gradient-to-br from-cinema-black via-secondary to-cinema-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              Discount & Contact
            </h2>
            <div className="w-32 h-1 bg-accent mx-auto rounded-full"></div>
          </div>

         

          

          
          {/* Book Button */}
          {/* <div className="text-center mb-12">
            <Button
              onClick={() => navigate("/book-ticket")}
              className="bg-accent hover:bg-accent/90 text-white font-bold text-2xl py-8 px-16 rounded-full cinema-glow hover:scale-105 transition-all duration-300 shadow-2xl"
              size="lg"
            >
              Book Ticket Now
            </Button>
          </div> */}
                <div className="text-center mb-12 px-4 sm:px-0">
                  <Button
                    onClick={() => navigate("/book-ticket")}
                    className="bg-accent hover:bg-accent/90 text-white font-bold 
                              text-sm sm:text-lg md:text-2xl py-3 sm:py-4 md:py-8 
                              px-4 sm:px-8 md:px-16 rounded-full cinema-glow 
                              hover:scale-105 transition-all duration-300 shadow-2xl
                              w-full sm:w-auto"
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
                  ₹20 Discount at Video Speed & Pay at Sodertalije!
                </h3>
                <Sparkles className="w-8 h-8 animate-pulse text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          {/* Location & Contact */}
          {/* <div className="grid md:grid-cols-2 gap-8 ">
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-8 h-8 text-accent" />
                  <h3 className="text-3xl font-bold text-white">Location</h3>
                </div>
                <p className="text-lg mb-4 text-white">Nanganallur, Chennai</p>
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-semibold text-lg transition-colors"
                >
                  View in Google Maps →
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-8 h-8 text-accent" />
                  <h3 className="text-3xl font-bold text-white">Contact</h3>
                </div>
                <div className="space-y-2 text-lg text-white">
                  <p>+91 98765 43210</p>
                  <p>+91 98765 43211</p>
                </div>
              </CardContent>
            </Card>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
  {/* Location Card */}
  <Card className="bg-white/5 backdrop-blur-md border-white/10 hover-lift w-full">
    <CardContent className="p-6 sm:p-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
        <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
        <h3 className="text-2xl sm:text-3xl font-bold text-white">Location</h3>
      </div>
      <p className="text-base sm:text-lg mb-2 sm:mb-4 text-white">Nanganallur, Chennai</p>
      <a
        href="https://www.google.com/maps"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 sm:gap-2 text-accent hover:text-accent/80 font-semibold text-base sm:text-lg transition-colors"
      >
        View in Google Maps →
      </a>
    </CardContent>
  </Card>

  {/* Contact Card */}
  <Card className="bg-white/5 backdrop-blur-md border-white/10 hover-lift w-full">
    <CardContent className="p-6 sm:p-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
        <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
        <h3 className="text-2xl sm:text-3xl font-bold text-white">Contact</h3>
      </div>
      <div className="space-y-1 sm:space-y-2 text-base sm:text-lg text-white">
        <p>+91 98765 43210</p>
        <p>+91 98765 43211</p>
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



