import { PricingCard } from "./PricingCard";

export const PricingSection = () => {
  return (
    <section id="precos" className="bg-gray-50 py-20 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="title-outlined text-4xl md:text-5xl lg:text-6xl mb-6">
            Planos acessíveis para qualquer empresa
          </h2>
          <p className="text-xl text-gray-600">
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
