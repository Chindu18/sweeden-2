import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you soon.",
    });
    setName("");
    setEmail("");
    setMessage("");
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-10 h-10 text-accent" />,
      title: "Visit Us",
      content: ["varby gard-varby gard t-bana,varby alle 14,143 40 varby,sweden "],
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: <Phone className="w-10 h-10 text-accent" />,
      title: "Call Us",
      content: ["+46704859228 +46739844564 "],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Mail className="w-10 h-10 text-accent" />,
      title: "Email Us",
      content: ["info@swedentamilfilm.com", "booking@swedentamilfilm.com"],
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Clock className="w-10 h-10 text-accent" />,
      title: "Opening Hours",
      content: ["Monday - Sunday", "9:00 AM - 11:00 PM", "All Days Open"],
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cinema-black via-secondary to-cinema-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in">
          <MessageCircle className="w-20 h-20 mx-auto mb-6 text-accent animate-pulse" />
          <h1 className="text-6xl md:text-8xl font-bold mb-6">Get In Touch</h1>
          <div className="w-32 h-1 bg-accent mx-auto rounded-full mb-6"></div>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card 
                key={index} 
                className="border-2 border-border hover:border-accent transition-all duration-300 hover-lift overflow-hidden group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-2 bg-gradient-to-r ${info.gradient}`}></div>
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-accent/10 rounded-full group-hover:bg-accent/20 transition-colors">
                      {info.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground text-center">
                    {info.title}
                  </h3>
                  <div className="space-y-2">
                    {info.content.map((line, i) => (
                      <p key={i} className="text-muted-foreground text-center font-medium">
                        {line}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-2 border-border shadow-2xl hover:border-accent/50 transition-colors animate-slide-up">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold mb-4 text-foreground flex items-center gap-3">
                    <Send className="w-8 h-8 text-accent" />
                    Send Message
                  </h2>
                  <p className="text-muted-foreground text-lg">Fill out the form below and we'll get back to you shortly</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-foreground font-semibold text-lg">Your Name</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="text-lg p-6 border-2 focus:border-accent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-foreground font-semibold text-lg">Your Email</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-lg p-6 border-2 focus:border-accent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-foreground font-semibold text-lg">Message</label>
                    <Textarea
                      placeholder="Tell us how we can help you..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      className="text-lg p-6 border-2 focus:border-accent resize-none"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-white font-bold text-xl py-6 rounded-xl shadow-xl cinema-glow hover:scale-105 transition-all duration-300"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="border-2 border-border shadow-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="h-full min-h-[600px]">
                <iframe
                  src="https://share.google/2RZXgXTTE8BdlSjl1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Theater Location"
                  className="w-full h-full"
                ></iframe>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Direction Info */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <Card className="border-2 border-border shadow-2xl animate-scale-in">
            <CardContent className="p-10">
              <h2 className="text-4xl font-bold mb-8 text-foreground text-center">
                How to Reach Us
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {/* <div className="space-y-4 p-6 bg-accent/5 rounded-xl hover:bg-accent/10 transition-colors">
                
                 
                  <p className="text-muted-foreground text-center">
                    varby gard-varby gard t-bana,varby alle 14,143 40 varby,sweden         </p>
                </div> */}
                
                <div className="space-y-4 p-6 bg-accent/5 rounded-xl hover:bg-accent/10 transition-colors">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl">🚌</span>
                  </div>
                 
                  <p className="text-muted-foreground text-center">
                   Utbildningsvagen 2A,147 40 Tumba,sweden   </p>
                </div>
                
               
              </div>
              
              <div className="mt-10 p-6 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border-l-4 border-accent rounded-xl">
                <p className="text-lg text-foreground">
                   </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Contact;
