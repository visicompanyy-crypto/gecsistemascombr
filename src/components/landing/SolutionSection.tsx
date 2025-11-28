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
    <section className="py-20 md:py-28">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-public-sans text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            A Saldar foi criada para organizar o financeiro da sua empresa.
          </h2>

          <p className="text-lg md:text-xl text-gray-300 mb-12">
            Clareza e organização em um único lugar
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 bg-[#0f1410]/40 backdrop-blur-sm rounded-xl p-4 border border-[#00ff88]/20">
                <div className="bg-[#00ff88]/10 p-2 rounded-full flex-shrink-0">
                  <CheckCircle2 className="text-[#00ff88]" size={18} />
                </div>
                <p className="text-sm text-gray-300">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
