import { PricingCard } from "./PricingCard";

export const PricingSection = () => {
  return (
    <section id="precos" className="bg-landing-bg py-20 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-public-sans text-3xl md:text-4xl lg:text-5xl font-bold text-landing-text mb-4">
            Planos acessíveis para qualquer empresa
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Escolha o melhor plano para o seu negócio
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            name="Plano Anual"
            price="99"
            period="ano"
            badge="Melhor custo-benefício"
            highlighted={true}
            buttonText="Quero o plano anual"
          />
          
          <PricingCard
            name="Plano Trimestral"
            price="119"
            period="3 meses"
            buttonText="Assinar trimestral"
          />
          
          <PricingCard
            name="Plano Mensal"
            price="139"
            period="mês"
            buttonText="Assinar mensal"
          />
        </div>
      </div>
    </section>
  );
};
