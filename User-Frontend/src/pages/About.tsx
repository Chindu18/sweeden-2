import { Card, CardContent } from "@/components/ui/card";
import { Star, Armchair, Coffee, Film } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Armchair className="w-12 h-12 text-accent" />,
      title: "Comfortable Seats",
      description:
        "Experience luxury with our premium recliner seats designed for maximum comfort during your movie experience.",
    },
    {
      icon: <Coffee className="w-12 h-12 text-accent" />,
      title: "Modern Canteen",
      description:
        "Enjoy a variety of snacks, beverages, and meals at our well-equipped canteen with authentic Tamil delicacies.",
    },
    {
      icon: <Film className="w-12 h-12 text-accent" />,
      title: "Multiple Screens",
      description:
        "We feature 3 state-of-the-art screens with the latest projection and sound technology for an immersive experience.",
    },
  ];

  const reviews = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment:
        "Best Tamil cinema experience in Sweden! Great sound quality and comfortable seating.",
    },
    {
      name: "Priya Sharma",
      rating: 5,
      comment:
        "Love watching Tamil movies here. The atmosphere is amazing and staff is very friendly.",
    },
    {
      name: "Vijay Anand",
      rating: 4,
      comment:
        "Good theater with latest Tamil releases. Canteen food is authentic and delicious.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Sweden Tamil Film Theater</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Your premier destination for Tamil cinema in Sweden, bringing you the
            latest blockbusters and timeless classics.
          </p>
        </div>
      </section>

      {/* About Theater */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-2 border-border">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                About Our Theater
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Welcome to Sweden Tamil Film Theater, the heart of Tamil cinema
                  entertainment in Sweden. Since our establishment, we have been
                  dedicated to bringing the magic of Tamil cinema to the Tamil
                  community and cinema enthusiasts in Sweden.
                </p>
                <p>
                  Our theater is equipped with cutting-edge technology, including
                  digital projection systems and Dolby Digital sound, ensuring
                  that every movie-watching experience is nothing short of
                  spectacular. We pride ourselves on maintaining the highest
                  standards of comfort and cleanliness.
                </p>
                <p>
                  We showcase a wide range of Tamil films, from the latest
                  blockbusters to critically acclaimed independent cinema, catering
                  to diverse tastes and preferences. Our commitment is to provide
                  an authentic cinema experience that connects the Tamil diaspora
                  with their cultural roots.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 border-border hover:border-accent transition-colors"
              >
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card key={index} className="border-2 border-border">
                <CardContent className="p-6">
                  <div className="flex mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{review.comment}"
                  </p>
                  <p className="font-semibold text-foreground">- {review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Theater Stats */}
      {/* <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">3</div>
              <div className="text-muted-foreground font-medium">Screens</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">500</div>
              <div className="text-muted-foreground font-medium">Seats</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">100+</div>
              <div className="text-muted-foreground font-medium">Movies/Year</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">10K+</div>
              <div className="text-muted-foreground font-medium">Happy Customers</div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default About;
