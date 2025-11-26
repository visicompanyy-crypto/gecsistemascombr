import { FeatureCard } from "./FeatureCard";
import { Zap, Calendar, TrendingUp, Target, Bell, BarChart3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const FeaturesSection = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
              }, index * 100);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Zap className="text-white" size={28} />,
      title: "Lançamentos rápidos",
      description: "Adicione receitas e despesas em poucos cliques",
    },
    {
      icon: <Calendar className="text-white" size={28} />,
      title: "Parcelamentos automáticos",
      description: "Divida valores em parcelas fixas ou variáveis",
    },
    {
      icon: <TrendingUp className="text-white" size={28} />,
      title: "Fluxo de caixa organizado",
      description: "Visualize entradas e saídas por período",
    },
    {
      icon: <Target className="text-white" size={28} />,
      title: "Projeção automática",
      description: "Veja quanto vai entrar e sair nos próximos meses",
    },
    {
      icon: <Bell className="text-white" size={28} />,
      title: "Alertas de vencimento",
      description: "Nunca mais esqueça uma conta a pagar",
    },
    {
      icon: <BarChart3 className="text-white" size={28} />,
      title: "Relatórios claros",
      description: "Gráficos simples para entender seu financeiro",
    },
  ];

  return (
    <section id="recursos" className="py-20 md:py-28">
      <div ref={sectionRef} className="max-w-[1320px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-public-sans text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            O que você encontra na Saldar
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${
                visibleCards.includes(index) ? 'animate-stagger-reveal' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
