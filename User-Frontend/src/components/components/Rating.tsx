import { Star } from "lucide-react";

interface RatingProps {
  score: number;
}

const Rating = ({ score }: RatingProps) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground">
      <Star className="w-4 h-4 fill-current" />
      <span className="text-sm font-bold">{score}</span>
    </div>
  );
};

export default Rating;
