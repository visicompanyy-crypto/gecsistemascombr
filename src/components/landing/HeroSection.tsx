import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HeroIllustration } from "./HeroIllustration";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text */}
          <div className="space-y-5 animate-fade-in">
            <h1 className="font-public-sans text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Você sente que o dinheiro entra e some? Descubra onde sua empresa realmente está perdendo dinheiro.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Organize seu financeiro e tenha clareza sobre o que pode cortar, onde investir e quando crescer. Sem planilhas, sem complicação.
            </p>

            <div className="pt-2 flex justify-center md:justify-start">
              <Button
                onClick={() => navigate("/signup")}
                className="bg-landing-green hover:bg-landing-green/90 text-white px-12 py-7 rounded-2xl text-xl font-bold transition-all hover:scale-105 shadow-[0_8px_30px_rgba(0,110,93,0.3)]"
              >
                ✅ Comece grátis por 5 dias
              </Button>
            </div>

            <div className="pt-3 flex justify-center md:justify-start">
              <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-2xl px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-white text-lg md:text-xl font-bold leading-tight">Empreender já é difícil.</span>
                  <span className="text-[#00ff88] text-lg md:text-xl font-extrabold leading-tight">Seu financeiro não precisa ser também.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="relative h-[450px] md:h-[600px] lg:h-[650px]">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
};
