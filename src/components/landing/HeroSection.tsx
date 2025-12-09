import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HeroIllustration } from "./HeroIllustration";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-28">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6 md:gap-16 items-center">
          {/* Left Column - Text */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-public-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              O dinheiro entra e some?
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Descubra onde sua empresa realmente está perdendo dinheiro. Organize seu financeiro, corte gastos desnecessários e saiba quanto pode investir no próximo mês. Sem planilhas e sem complicação.
            </p>

            <div className="pt-4 flex flex-col items-center md:items-start gap-4">
              <Button
                onClick={() => navigate("/signup")}
                className="bg-landing-green hover:bg-landing-green/90 text-white px-12 py-7 rounded-2xl text-xl font-bold transition-all hover:scale-105 shadow-[0_8px_30px_rgba(0,110,93,0.3)]"
              >
                Comece grátis por 5 dias
              </Button>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 inline-block">
                <p className="text-gray-300 text-sm text-center">
                  Empreender já é difícil. Seu financeiro não precisa ser também.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="relative h-[280px] sm:h-[350px] md:h-[600px] lg:h-[650px]">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
};
