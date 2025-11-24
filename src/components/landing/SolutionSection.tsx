import { CheckCircle2 } from "lucide-react";

export const SolutionSection = () => {
  const benefits = [
    "Registre entradas e saídas em segundos",
    "Parcele compras automaticamente",
    "Veja suas projeções atualizadas em tempo real",
    "Receba alertas de vencimentos importantes",
    "Acompanhe o fluxo de caixa do mês",
  ];

  return (
    <section className="bg-[#FAF7E8] py-20 md:py-32">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text */}
          <div className="space-y-6">
            <div className="inline-block bg-[#C4FEA1] text-[#252F1D] px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
              A SOLUÇÃO
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#252F1D] leading-tight">
              A solução criada para organizar o financeiro do seu negócio
            </h2>

            <p className="text-lg md:text-xl text-[#4a4a4a]">
              Clareza e organização em um único lugar
            </p>

            <div className="space-y-4 pt-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={24} />
                  <p className="text-base text-[#4a4a4a]">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
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
    </section>
  );
};
