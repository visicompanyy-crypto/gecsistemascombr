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
    <section className="bg-landing-bg py-20 md:py-32">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text */}
          <div className="space-y-6">
            <div className="inline-block bg-landing-green/10 border border-landing-green/30 text-landing-green px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
              A SOLUÇÃO
            </div>

            <h2 className="font-public-sans text-3xl md:text-4xl lg:text-5xl font-bold text-landing-text leading-tight">
              A solução criada para organizar o financeiro do seu negócio
            </h2>

            <p className="text-lg md:text-xl text-gray-600">
              Clareza e organização em um único lugar
            </p>

            <div className="space-y-4 pt-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-landing-green/10 p-2 rounded-full flex-shrink-0">
                    <CheckCircle2 className="text-landing-green" size={20} />
                  </div>
                  <p className="text-base text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Testimonial */}
          <div className="bg-white rounded-3xl p-10 shadow-[0_15px_50px_rgba(0,0,0,0.1)] border border-gray-200">
            <div className="mb-6">
              <div className="text-6xl text-landing-green/30 font-serif leading-none">"</div>
            </div>
            
            <blockquote className="text-lg italic text-gray-700 leading-relaxed mb-6">
              Antes eu perdia horas tentando fechar as contas no Excel. Com o Saldar, em minutos eu sei exatamente quanto tenho, quanto vou receber e o que preciso pagar.
            </blockquote>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-landing-green text-white flex items-center justify-center font-bold text-lg">
                MC
              </div>
              <div>
                <p className="font-semibold text-landing-text">Maria Clara</p>
                <p className="text-sm text-gray-500">Dona de loja, São Paulo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
