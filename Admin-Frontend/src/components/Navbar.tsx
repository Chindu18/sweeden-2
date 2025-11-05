// import { Film, LogOut } from "lucide-react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

//   const handleLogout = () => {
//     sessionStorage.removeItem("isLoggedIn");
//     navigate("/");
//   };

//   const navLinks = [
//     { name: "Dashboard", path: "/dashboard" },
//     { name: "Movies", path: "/movies" },
//     { name: "Scanner", path: "/scanner" },
//     { name: "Revenue", path: "/revenue" },
//     { name: "Contact Us", path: "/contact" },
//   ];

//   if (!isLoggedIn) return null;

//   return (
//     <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           <Link to="/dashboard" className="flex items-center gap-2 group">
//             <div className="p-2 bg-gradient-to-br from-primary to-red-700 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
//               <Film className="h-6 w-6 text-primary-foreground" />
//             </div>
//             <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-700 bg-clip-text text-transparent">
//               Tamil Film Sweden
//             </span>
//           </Link>

//           <div className="flex items-center gap-6">
//             <div className="hidden md:flex items-center gap-1">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                     location.pathname === link.path
//                       ? "bg-primary text-primary-foreground shadow-md"
//                       : "text-foreground hover:bg-secondary"
//                   }`}
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//             </div>

//             <Button
//               onClick={handleLogout}
//               variant="outline"
//               size="sm"
//               className="gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
//             >
//               <LogOut className="h-4 w-4" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import { Film, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Movies", path: "/movies" },
    { name: "Snacks", path: "/snacks" },
    { name: "Scanner", path: "/scanner" },
    { name: "Revenue", path: "/revenue" },
    { name: "Contact", path: "/contact" },
    
  ];

  if (!isLoggedIn) return null;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-br from-primary to-red-700 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
            <Film className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-700 bg-clip-text text-transparent">
            Tamil Film Sweden
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                location.pathname === link.path
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg border border-destructive text-destructive font-medium hover:bg-destructive hover:text-destructive-foreground transition-all"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 pb-4 space-y-2 animate-scale-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block w-full text-center px-4 py-2 rounded-lg font-medium transition-all ${
                location.pathname === link.path
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Logout */}
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-center px-4 py-2 rounded-lg border border-destructive text-destructive font-medium hover:bg-destructive hover:text-destructive-foreground transition-all"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
