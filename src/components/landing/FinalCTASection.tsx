import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))] py-24 md:py-32 overflow-hidden">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(138, 253, 86, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(138, 253, 86, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      <div className="relative max-w-[1320px] mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
          Organize o financeiro da sua empresa hoje
        </h2>
        
        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
          Comece agora e tenha controle total das suas finanças
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/login")}
            className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green-light))] text-[hsl(var(--hero-dark))] px-12 py-7 rounded-2xl text-xl font-bold transition-all hover:scale-105 shadow-[0_0_40px_rgba(138,253,86,0.4)]"
          >
            Começar gratuitamente
          </Button>
          
          <Button
            variant="outline"
            className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-7 rounded-2xl text-xl font-semibold transition-all backdrop-blur-sm"
          >
            Falar com vendas
          </Button>
        </div>
      </div>
    </section>
  );
};
