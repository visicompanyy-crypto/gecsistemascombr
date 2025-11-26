import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-[#00ff88] to-[#00cc6f] py-24 md:py-32 overflow-hidden relative">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(10, 15, 11, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10, 15, 11, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      <div className="relative max-w-[1320px] mx-auto px-6 text-center">
        <h2 className="font-public-sans text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a0f0b] mb-6 max-w-3xl mx-auto">
          Organize o financeiro da sua empresa hoje
        </h2>
        
        <p className="text-xl md:text-2xl text-[#0a0f0b]/90 mb-12 max-w-2xl mx-auto">
          Comece agora e tenha controle total das suas finanças
        </p>

        <Button
          onClick={() => navigate("/login")}
          className="bg-[#0a0f0b] hover:bg-[#0f1410] text-[#00ff88] px-16 py-8 rounded-2xl text-xl font-bold transition-all hover:scale-105 shadow-[0_15px_50px_rgba(10,15,11,0.3)]"
        >
          Começar gratuitamente
        </Button>
      </div>
    </section>
  );
};
