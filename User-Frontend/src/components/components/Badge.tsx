import { cn } from "@/lib/utils";

interface BadgeProps {
  status: "Now Showing" | "Coming Soon";
  className?: string;
}

const Badge = ({ status, className }: BadgeProps) => {
  const isNowShowing = status === "Now Showing";

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold",
        isNowShowing
          ? "bg-brand-blue text-primary-foreground"
          : "bg-brand-green text-accent-foreground",
        className
      )}
    >
      {status}
    </span>
  );
};

export default Badge;
