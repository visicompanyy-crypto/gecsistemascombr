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
    <header className="sticky top-0 z-50 bg-[#FAF7E8]/95 backdrop-blur-md border-b border-black/5">
      <div className="max-w-[1320px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.png" alt="Saldar" className="h-10 w-10" />
          <span className="text-2xl font-bold text-[#252F1D]">Saldar</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("recursos")}
            className="text-base font-medium text-[#4a4a4a] hover:text-primary transition-colors"
          >
            Recursos
          </button>
          <button
            onClick={() => scrollToSection("precos")}
            className="text-base font-medium text-[#4a4a4a] hover:text-primary transition-colors"
          >
            Preços
          </button>
          <button
            onClick={() => scrollToSection("depoimentos")}
            className="text-base font-medium text-[#4a4a4a] hover:text-primary transition-colors"
          >
            Depoimentos
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/login")}
            className="bg-primary hover:bg-primary/90 text-white px-7 py-3 rounded-xl font-semibold transition-all hover:scale-105"
          >
            Entrar
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#252F1D]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7E8] border-t border-black/5 py-4 px-6">
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("recursos")}
              className="text-base font-medium text-[#4a4a4a] hover:text-primary transition-colors text-left py-2"
            >
              Recursos
            </button>
            <button
              onClick={() => scrollToSection("precos")}
              className="text-base font-medium text-[#4a4a4a] hover:text-primary transition-colors text-left py-2"
            >
              Preços
            </button>
            <button
              onClick={() => scrollToSection("depoimentos")}
              className="text-base font-medium text-[#4a4a4a] hover:text-primary transition-colors text-left py-2"
            >
              Depoimentos
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
