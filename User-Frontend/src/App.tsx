import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Movies from "./pages/Movies";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import MainMoviePage from "./pages/MainMoviePage";
import BookTicket from "./components/BookTicket/BookTicket";
import UserSnacksShop from "./components/snacksOrder/UserSnacksShop";
import Hero from "./components/components/Hero";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<MainMoviePage />} />
                <Route path="/hero" element={<Hero />}/>
                <Route path="/movie/:title/:id" element={<Movies />} />
                <Route path="/book-ticket/:id" element={<BookTicket />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* ✅ Correct route for snack order */}
                <Route
                  path="/booking/:bookingid/:email/ordersnack"
                  element={<UserSnacksShop />}
                />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
