import Navbar from "@/components/Navbar";
import Hero from "@/components/components/Hero";
import MovieCard from "@/components/components/MovieCard";
import SnackCard from "@/components/components/SnackCard";
import Footer from "@/components/components/Footer";
import { Button } from "@/components/components/ui/button";

// Import movie images
import movieJailer from "@/assets/movie-jailer.jpg";
import movieLeo from "@/assets/movie-leo.jpg";
import moviePS from "@/assets/movie-ps.jpg";
import movieVarisu from "@/assets/movie-varisu.jpg";

// Import snack images
import snackPopcorn from "@/assets/snack-popcorn.jpg";
import snackNachos from "@/assets/snack-nachos.jpg";
import snackSamosa from "@/assets/snack-samosa.jpg";
import snackCoke from "@/assets/snack-coke.jpg";

const movies = [
  {
    title: "Jailer",
    genre: "Action/Thriller",
    cast: "Rajinikanth, Ramya Krishnan",
    status: "Now Showing" as const,
    rating: 8.2,
    image: movieJailer,
  },
  {
    title: "Leo",
    genre: "Action/Drama",
    cast: "Thalapathy Vijay, Trisha",
    status: "Now Showing" as const,
    rating: 7.8,
    image: movieLeo,
  },
  {
    title: "Ponniyin Selvan",
    genre: "Historical/Drama",
    cast: "Vikram, Aishwarya Rai",
    status: "Coming Soon" as const,
    rating: 8.5,
    image: moviePS,
  },
  {
    title: "Varisu",
    genre: "Family/Drama",
    cast: "Thalapathy Vijay, Rashmika",
    status: "Now Showing" as const,
    rating: 7.5,
    image: movieVarisu,
  },
];

const snacks = [
  { name: "Popcorn", image: snackPopcorn },
  { name: "Nachos", image: snackNachos },
  { name: "Samosa", image: snackSamosa },
  { name: "Coke", image: snackCoke },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Featured Movies Section */}
      <section id="movies" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured{" "}
              <span className="bg-gradient-brand bg-clip-text text-transparent">
                Tamil Blockbusters
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the latest and greatest Tamil films showing in Swedish theaters
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.title} {...movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Snacks Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Delicious Snacks
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pre-order your favorite cinema treats and have them ready when you arrive
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {snacks.map((snack) => (
              <SnackCard key={snack.name} {...snack} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="default" size="lg" className="rounded-full">
              Order Snacks with Your Booking
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
