"use client";

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import Contact from "./pages/Contact";

// ✅ Protected Route
// ProtectedRoute.tsx
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const loggedIn = sessionStorage.getItem("loggedIn");
  if (!loggedIn) return <Navigate to="/" replace />;
  return <>{children}</>;
};


// ✅ Layout for all protected pages (includes Navbar)
const ProtectedLayout = () => (
  <div>
    <Navbar />
    <div className="p-4">
      <Outlet /> {/* Renders nested protected pages */}
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/" element={<Login />} />

            {/* Protected layout */}
            <Route
              element={
                <ProtectedRoute>
                  <ProtectedLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
