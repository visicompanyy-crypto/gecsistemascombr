import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-primary py-24 md:py-32">
      <div className="max-w-[1320px] mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
          Organize o financeiro da sua empresa hoje
        </h2>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
          A clareza que seu negócio precisa está aqui
        </p>

        <Button
          onClick={() => navigate("/login")}
          className="bg-white text-primary hover:bg-white/90 px-12 py-7 rounded-2xl text-xl font-bold transition-all hover:scale-105 shadow-2xl"
        >
          Quero organizar meu financeiro agora
        </Button>
      </div>
    </section>
  );
};
