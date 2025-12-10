import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

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
    <header className="sticky top-0 z-50 bg-[#0a0f0b]/95 backdrop-blur-md border-b border-[#00ff88]/20 shadow-lg shadow-[#00ff88]/5">
      <div className="max-w-[1320px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Saldar" className="h-10 w-10" />
          <span className="text-2xl font-bold text-white">Saldar</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("recursos")}
            className="text-base font-medium text-gray-300 hover:text-[#00ff88] transition-colors"
          >
            Recursos
          </button>
          <button
            onClick={() => scrollToSection("precos")}
            className="text-base font-medium text-gray-300 hover:text-[#00ff88] transition-colors"
          >
            Preços
          </button>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="hidden md:flex text-gray-300 hover:text-white hover:bg-white/10 px-5 py-2 rounded-xl font-medium transition-all"
          >
            Entrar
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            className="bg-landing-green hover:bg-landing-green/90 text-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-xl font-bold transition-all hover:scale-105 shadow-[0_4px_15px_rgba(0,110,93,0.2)]"
          >
            Teste Grátis
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
        <div className="md:hidden bg-[#0f1410]/95 backdrop-blur-md border-t border-[#00ff88]/20 py-4 px-6">
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("recursos")}
              className="text-base font-medium text-gray-300 hover:text-[#00ff88] transition-colors text-left py-2"
            >
              Recursos
            </button>
            <button
              onClick={() => scrollToSection("precos")}
              className="text-base font-medium text-gray-300 hover:text-[#00ff88] transition-colors text-left py-2"
            >
              Preços
            </button>
            <Button
              variant="outline"
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
              className="w-full border-[#00ff88]/30 text-white hover:bg-[#00ff88]/10"
            >
              Entrar
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
