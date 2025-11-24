import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BrazilFlag } from "./BrazilFlag";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#FAF7E8] py-24 md:py-32">
      <BrazilFlag />
      
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid md:grid-cols-[1.2fr,1fr] gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#252F1D] leading-tight max-w-2xl">
              Empresas brasileiras merecem um financeiro simples, claro e confiável.
            </h1>
            
            <p className="text-lg md:text-xl text-[#4a4a4a] leading-relaxed max-w-xl">
              A Saldar foi criada para a realidade do empreendedor brasileiro. Organização, previsibilidade e clareza em um único lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => navigate("/login")}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg"
              >
                Quero organizar meu financeiro agora
              </Button>
              
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 rounded-xl text-lg font-semibold transition-all"
              >
                Ver a Saldar em ação
              </Button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#C4FEA1]/20 to-[#8AFD56]/20 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <div className="aspect-video bg-white rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-[#4a4a4a] font-medium">Dashboard Saldar</p>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl px-4 py-3 shadow-lg animate-float">
                <p className="text-sm font-semibold text-primary">✓ Entrada registrada</p>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-white rounded-xl px-4 py-3 shadow-lg animate-float-delayed">
                <p className="text-sm font-semibold text-primary">✓ Projeção atualizada</p>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-3 shadow-lg animate-float">
                <p className="text-sm font-semibold text-primary">✓ Pagamento confirmado</p>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl px-4 py-3 shadow-lg animate-float-delayed">
                <p className="text-sm font-semibold text-primary">✓ Fluxo positivo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
