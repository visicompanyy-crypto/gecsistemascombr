import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const LandingHeader = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-fintech-dark/95 backdrop-blur-md border-b border-fintech-light/10">
      <div className="max-w-[1320px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.png" alt="Saldar" className="h-10 w-10" />
          <span className="text-2xl font-bold text-white">Saldar</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("recursos")}
            className="text-base font-medium text-white/70 hover:text-fintech-neon transition-colors"
          >
            Recursos
          </button>
          <button
            onClick={() => scrollToSection("precos")}
            className="text-base font-medium text-white/70 hover:text-fintech-neon transition-colors"
          >
            Preços
          </button>
          <button
            onClick={() => scrollToSection("depoimentos")}
            className="text-base font-medium text-white/70 hover:text-fintech-neon transition-colors"
          >
            Depoimentos
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/login")}
            className="bg-fintech-neon hover:bg-fintech-neon/90 text-fintech-dark px-7 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(138,253,86,0.3)]"
          >
            Entrar
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-fintech-dark border-t border-fintech-light/10 py-4 px-6">
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("recursos")}
              className="text-base font-medium text-white/70 hover:text-fintech-neon transition-colors text-left py-2"
            >
              Recursos
            </button>
            <button
              onClick={() => scrollToSection("precos")}
              className="text-base font-medium text-white/70 hover:text-fintech-neon transition-colors text-left py-2"
            >
              Preços
            </button>
            <button
              onClick={() => scrollToSection("depoimentos")}
              className="text-base font-medium text-white/70 hover:text-fintech-neon transition-colors text-left py-2"
            >
              Depoimentos
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
