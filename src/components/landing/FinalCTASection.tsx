import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-[hsl(var(--dark-bg))] py-32 md:py-40 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[hsl(var(--neon-green))]/10 rounded-full blur-[120px]"></div>
      
      <div className="max-w-[1320px] mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 max-w-4xl mx-auto leading-tight">
          A forma mais inteligente de organizar o financeiro da sua empresa
        </h2>
        
        <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto">
          Comece agora e tenha clareza total em minutos
        </p>

        <Button
          onClick={() => navigate("/login")}
          className="bg-[hsl(var(--neon-green))] hover:bg-[hsl(var(--neon-green-dim))] text-black px-16 py-8 rounded-2xl text-2xl font-bold transition-all hover:scale-105 shadow-[0_0_60px_rgba(138,253,86,0.4)] relative overflow-hidden animate-light-sweep"
        >
          Começar agora
        </Button>
        
        <p className="text-white/50 text-sm mt-8">
          Sem cartão de crédito • Cancele quando quiser
        </p>
      </div>
    </section>
  );
};
