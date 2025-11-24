import { FeatureCard } from "./FeatureCard";
import { Zap, Calendar, TrendingUp, Target, Bell, Clock, BarChart3, Smile } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Zap className="text-primary" size={40} />,
      title: "Lançamentos rápidos",
      description: "Adicione receitas e despesas em poucos cliques",
    },
    {
      icon: <Calendar className="text-primary" size={40} />,
      title: "Parcelamentos automáticos",
      description: "Divida valores em parcelas fixas, variáveis ou recorrentes",
    },
    {
      icon: <TrendingUp className="text-primary" size={40} />,
      title: "Fluxo de caixa organizado",
      description: "Visualize entradas e saídas por período",
    },
    {
      icon: <Target className="text-primary" size={40} />,
      title: "Projeção automática",
      description: "Veja quanto vai entrar e sair nos próximos meses",
    },
    {
      icon: <Bell className="text-primary" size={40} />,
      title: "Alertas de vencimento",
      description: "Nunca mais esqueça uma conta a pagar",
    },
    {
      icon: <Clock className="text-primary" size={40} />,
      title: "Histórico claro",
      description: "Consulte todas as transações já realizadas",
    },
    {
      icon: <BarChart3 className="text-primary" size={40} />,
      title: "Relatórios básicos",
      description: "Gráficos simples para entender seu financeiro",
    },
    {
      icon: <Smile className="text-primary" size={40} />,
      title: "Interface simples",
      description: "Design intuitivo, sem complicações",
    },
  ];

  return (
    <section id="recursos" className="bg-white py-20 md:py-28">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#252F1D]">
            O que você encontra na Saldar
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
