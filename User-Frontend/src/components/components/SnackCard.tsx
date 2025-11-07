interface SnackCardProps {
  name: string;
  image: string;
}

const SnackCard = ({ name, image }: SnackCardProps) => {
  return (
    <div className="group bg-card rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer border border-transparent hover:border-primary/20">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={`${name} snack`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4 text-center">
        <h4 className="font-bold text-card-foreground">{name}</h4>
      </div>
    </div>
  );
};

export default SnackCard;
