import { PricingCard } from "./PricingCard";

export const PricingSection = () => {
  return (
    <section id="precos" className="py-20 md:py-28">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-public-sans text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Mesma plataforma, três formas de pagar. Você escolhe.
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Todos os planos incluem acesso completo ao sistema e suporte via WhatsApp.
            A única diferença está em como você prefere pagar e quanto quer economizar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            name="Plano Anual"
            price="99,90"
            period="mês"
            billingInfo="Pagamento único de R$ 1.188,00"
            badge="Mais econômico"
            description="Perfeito para quem quer tranquilidade o ano todo com o melhor custo-benefício."
            highlighted={true}
            neonColor="green"
            buttonText="Assinar plano anual"
            benefits={[
              "Acesso total a todos os recursos",
              "Lançamentos ilimitados",
              "Alertas, fluxo de caixa e relatórios completos",
              "Suporte via WhatsApp",
              "Pagamento único, sem preocupação com renovações mensais",
              "Economia de até 30% comparado ao plano mensal"
            ]}
          />
          
          <PricingCard
            name="Plano Trimestral"
            price="119,90"
            period="mês"
            billingInfo="Cobrança a cada 3 meses: R$ 359,70"
            description="Mais flexibilidade, ideal para quem quer experimentar com mais tempo."
            neonColor="yellow"
            buttonText="Assinar plano trimestral"
            benefits={[
              "Acesso total ao sistema",
              "Suporte via WhatsApp",
              "Mesmos recursos do plano anual",
              "Compromisso mais curto, ideal para testar",
              "Pagamento a cada 3 meses"
            ]}
          />
          
          <PricingCard
            name="Plano Mensal"
            price="139,90"
            period="mês"
            billingInfo="Cobrança recorrente mensal"
            description="Liberdade total para começar no seu ritmo, sem fidelidade."
            neonColor="red"
            buttonText="Assinar plano mensal"
            benefits={[
              "Acesso total à plataforma",
              "Todos os recursos disponíveis",
              "Suporte via WhatsApp",
              "Sem compromisso de longo prazo",
              "Cancele quando quiser"
            ]}
          />
        </div>
      </div>
    </section>
  );
};
