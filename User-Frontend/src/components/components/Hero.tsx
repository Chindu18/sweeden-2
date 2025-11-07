import { Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Cinema theater interior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
          <span className="text-sm font-medium text-primary-foreground">Tamil Cinema Magic Awaits</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in">
          <span className="text-primary-foreground">Experience </span>
          <span className="bg-gradient-brand bg-clip-text text-transparent">
            Cinematic Moments
          </span>
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-secondary mb-10 leading-relaxed animate-fade-in">
          Book your favorite Tamil films with instant QR code tickets, pre-order delicious snacks, 
          and enjoy a seamless cinema experience in Sweden.
        </p>

        {/* CTA Button */}
        <Button 
          variant="gradient" 
          size="xl" 
          className="gap-3 font-semibold shadow-2xl animate-fade-in"
        >
          <Ticket className="w-5 h-5" />
          Browse Movies Now
        </Button>
      </div>
    </section>
  );
};

export default Hero;
