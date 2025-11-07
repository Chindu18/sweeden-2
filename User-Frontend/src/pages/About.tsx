

import { Card, CardContent } from "@/components/ui/card";
import { Armchair, Coffee, Film } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Armchair className="w-12 h-12 text-[#00c6a7]" />,
      title: "Comfortable Seats",
      description:
        "Experience luxury with our premium recliner seats designed for maximum comfort during your movie experience.",
    },
    {
      icon: <Coffee className="w-12 h-12 text-[#00c6a7]" />,
      title: "Modern Canteen",
      description:
        "Enjoy a variety of snacks, beverages, and meals at our well-equipped canteen with authentic Tamil delicacies.",
    },
    {
      icon: <Film className="w-12 h-12 text-[#00c6a7]" />,
      title: "Multiple Screens",
      description:
        "We feature 3 state-of-the-art screens with the latest projection and sound technology for an immersive experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7]">
            Sweden Tamil Film Theater
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Your premier destination for Tamil cinema in Sweden, bringing you
            the latest blockbusters and timeless classics.
          </p>
          <a
            href="/movies"
            className="inline-block bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:opacity-90 transition-opacity"
          >
            Browse Movies Now
          </a>
        </div>
      </section>

      {/* About Theater */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-2 border-[#00c6a7] shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7]">
                About Our Theater
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Welcome to Sweden Tamil Film Theater, the heart of Tamil
                  cinema entertainment in Sweden. Since our establishment, we
                  have been dedicated to bringing the magic of Tamil cinema to
                  the Tamil community and cinema enthusiasts in Sweden.
                </p>
                <p>
                  Our theater is equipped with cutting-edge technology,
                  including digital projection systems and Dolby Digital sound,
                  ensuring that every movie-watching experience is nothing short
                  of spectacular. We pride ourselves on maintaining the highest
                  standards of comfort and cleanliness.
                </p>
                <p>
                  We showcase a wide range of Tamil films, from the latest
                  blockbusters to critically acclaimed independent cinema,
                  catering to diverse tastes and preferences. Our commitment is
                  to provide an authentic cinema experience that connects the
                  Tamil diaspora with their cultural roots.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7]">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 border-[#00c6a7] shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7]">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;