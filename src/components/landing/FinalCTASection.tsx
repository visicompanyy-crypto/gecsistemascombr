import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-landing-green to-landing-green-accent py-24 md:py-32 overflow-hidden relative">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      <div className="relative max-w-[1320px] mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
          Organize o financeiro da sua empresa hoje
        </h2>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
          Comece agora e tenha controle total das suas finanças
        </p>

        <Button
          onClick={() => navigate("/login")}
          className="bg-white hover:bg-white/90 text-landing-green px-16 py-8 rounded-2xl text-xl font-bold transition-all hover:scale-105 shadow-[0_15px_50px_rgba(0,0,0,0.2)]"
        >
          Começar gratuitamente
        </Button>
      </div>
    </section>
  );
};
