import { ProblemCard } from "./ProblemCard";
import { FileSpreadsheet, AlertCircle, EyeOff } from "lucide-react";

export const ProblemSection = () => {
  return (
    <section className="bg-white py-20 md:py-28 relative overflow-hidden">
      {/* Decorative SVG Curve */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.3 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-100,300 Q400,100 900,300 T1900,300"
          stroke="hsl(var(--fintech-light))"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <div className="max-w-[1320px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#252F1D] mb-4">
            A realidade financeira das empresas brasileiras
          </h2>
          <p className="text-lg md:text-xl text-[#4a4a4a]">
            Desafios que atrapalham o crescimento todos os dias
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <ProblemCard
            icon={<FileSpreadsheet className="text-primary" size={48} />}
            title="Planilhas confusas"
            description="Fórmulas quebradas, versões desatualizadas e informações espalhadas em vários arquivos"
          />
          
          <ProblemCard
            icon={<AlertCircle className="text-primary" size={48} />}
            title="Informações soltas"
            description="Extratos bancários, notas fiscais e boletos em lugares diferentes. Difícil ter visão do todo"
          />
          
          <ProblemCard
            icon={<EyeOff className="text-primary" size={48} />}
            title="Decisões no escuro"
            description="Sem saber quanto entra, quanto sai e quanto sobra. Impossível planejar o próximo mês"
          />
        </div>
      </div>
    </section>
  );
};
