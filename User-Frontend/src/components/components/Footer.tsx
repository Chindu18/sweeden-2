import { Film, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-hero-start text-primary-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-brand flex items-center justify-center">
                <Film className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Tamil Film Sweden</span>
            </div>
            <p className="text-secondary text-sm">
              Experience the magic of Tamil cinema in Sweden.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Movies", "About Us", "Contact Us"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-secondary hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-secondary">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@tamilfilmsweden.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+46 70 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Stockholm, Sweden</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-border/20 text-center">
          <p className="text-secondary text-sm">
            © 2025 Tamil Film Sweden. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
