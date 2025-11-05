import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import Scanner from "./pages/Scanner";
import Contact from "./pages/Contact";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Revenue from "./pages/Revenue";
import Collector from "./pages/Collector";
import SnacksPicker from "./components/Snacks/SnacksPicker";
import SnackRevenew from "../src/components/Snacks/SnackRevenew"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/collectors" element={<Collector />} />
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <Movies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scanner"
            element={
              <ProtectedRoute>
                <Scanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Revenue"
            element={
              <ProtectedRoute>
                <Revenue/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/snacks"
            element={
              <ProtectedRoute>
                <SnacksPicker/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/snacksrevenue"
            element={
              <ProtectedRoute>
                 <SnackRevenew/>
              </ProtectedRoute>
            }
          />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
