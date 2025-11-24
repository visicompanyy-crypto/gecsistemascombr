import { CheckCircle2 } from "lucide-react";
import { PremiumBackground } from "./PremiumBackground";

export const SolutionSection = () => {
  const benefits = [
    "Registre entradas e saídas em segundos",
    "Parcele compras automaticamente",
    "Veja suas projeções atualizadas em tempo real",
    "Receba alertas de vencimentos importantes",
    "Acompanhe o fluxo de caixa do mês",
  ];

  return (
    <PremiumBackground variant="organic" className="py-20 md:py-32">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text */}
          <div className="space-y-6">
            <div className="inline-block bg-fintech-neon/20 border border-fintech-neon/40 text-fintech-neon px-5 py-2 rounded-full text-sm font-semibold tracking-wide backdrop-blur-sm">
              A SOLUÇÃO
            </div>

            <h2 
              className="text-3xl md:text-4xl lg:text-6xl font-shrikhand text-white leading-tight"
              style={{
                textShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 2px rgba(255,255,255,0.8)'
              }}
            >
              A solução criada para organizar o financeiro do seu negócio
            </h2>

            <p className="text-lg md:text-xl text-white/80 font-jakarta">
              Clareza e organização em um único lugar
            </p>

            <div className="space-y-4 pt-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-fintech-light/20 p-2 rounded-full flex-shrink-0">
                    <CheckCircle2 className="text-primary" size={20} />
                  </div>
                  <p className="text-base text-white/90">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Card with Light Sweep */}
          <div className="relative">
            <div className="rounded-3xl bg-white shadow-[0_25px_70px_rgba(0,0,0,0.4)] overflow-hidden relative">
              {/* Light Sweep Effect */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'light-sweep 3s ease-in-out infinite'
                }}
              />
              
              <div className="aspect-video flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="text-7xl mb-4">💰</div>
                  <p className="text-[#4a4a4a] font-semibold text-lg">Dashboard Organizado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PremiumBackground>
  );
};
