import { Button } from "@/components/ui/button";
import Badge from "@/components/components/Badge";
import Rating from "@/components/components/Rating";

interface MovieCardProps {
  title: string;
  genre: string;
  cast: string;
  status: "Now Showing" | "Coming Soon";
  rating: number;
  image: string;
}

const MovieCard = ({ title, genre, cast, status, rating, image }: MovieCardProps) => {
  return (
    <div className="group bg-card rounded-2xl shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Movie Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={image}
          alt={`${title} movie poster`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge status={status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-card-foreground mb-2 line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-1">{genre}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">Cast: {cast}</p>
        </div>

        <div className="h-px bg-border"></div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between gap-4">
          <Rating score={rating} />
          <Button variant="gradient" size="sm" className="rounded-full flex-1">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
