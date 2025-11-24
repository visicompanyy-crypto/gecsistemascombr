import { PricingCard } from "./PricingCard";
import { PremiumBackground } from "./PremiumBackground";

export const PricingSection = () => {
  return (
    <PremiumBackground variant="mesh" className="py-20 md:py-32">
      <section id="precos">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-shrikhand text-white mb-4"
              style={{
                textShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 2px rgba(255,255,255,0.8)'
              }}
            >
              Planos acessíveis para qualquer empresa
            </h2>
            <p className="text-lg md:text-xl text-white/80 font-jakarta">
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
    </PremiumBackground>
  );
};
