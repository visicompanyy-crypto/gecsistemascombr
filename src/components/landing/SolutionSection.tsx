import { TrendingDown, Shield, Zap, Target } from "lucide-react";

export const SolutionSection = () => {
  const benefits = [
    {
      icon: TrendingDown,
      title: "Reduza erros em 90%",
      description: "Automatize lançamentos e elimine retrabalho com parcelamentos inteligentes"
    },
    {
      icon: Shield,
      title: "Mais clareza financeira",
      description: "Visualize entradas, saídas e projeções em tempo real com dashboards intuitivos"
    },
    {
      icon: Zap,
      title: "Agilidade total",
      description: "Registre transações em segundos e tome decisões baseadas em dados atualizados"
    },
    {
      icon: Target,
      title: "Previsibilidade garantida",
      description: "Antecipe cenários e planeje o futuro com projeções automáticas precisas"
    }
  ];

  return (
    <section className="bg-gray-50 py-20 md:py-32">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Benefits */}
          <div className="space-y-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="stagger-item bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--neon-green))]/10 to-[hsl(var(--primary))]/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-7 h-7 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative">
            <div className="rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden p-8">
              <div className="aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-6">📊</div>
                  <p className="text-gray-700 font-semibold text-xl">Dashboard Saldar</p>
                  <p className="text-gray-500 text-sm mt-2">Clareza em tempo real</p>
                </div>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-[hsl(var(--neon-green))]/20 to-[hsl(var(--primary))]/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
