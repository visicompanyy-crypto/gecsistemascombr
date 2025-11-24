import { Zap, LineChart, PieChart, RefreshCw, Clock } from "lucide-react";

export const ProblemSection = () => {
  const features = [
    { icon: Zap, label: "Fluxo de caixa" },
    { icon: LineChart, label: "Gestão de pagamentos" },
    { icon: PieChart, label: "Controle de despesas" },
    { icon: RefreshCw, label: "Atualização em tempo real" },
    { icon: Clock, label: "Histórico completo" },
  ];

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="title-outlined text-4xl md:text-5xl lg:text-6xl mb-6">
            A plataforma financeira completa que você estava buscando
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="stagger-item bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--neon-green))]/10 to-[hsl(var(--primary))]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-[hsl(var(--primary))]" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                {feature.label}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
