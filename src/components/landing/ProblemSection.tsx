import { ProblemCard } from "./ProblemCard";
import { FileSpreadsheet, AlertCircle, EyeOff } from "lucide-react";

export const ProblemSection = () => {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-[1320px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-public-sans text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            A realidade financeira das empresas brasileiras
          </h2>
          <p className="text-lg md:text-xl text-gray-300">
            Desafios que atrapalham o crescimento todos os dias
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <ProblemCard
            icon={<FileSpreadsheet className="text-[#ff2d55]" size={24} />}
            title="Planilhas confusas"
            description="Fórmulas quebradas, versões desatualizadas e informações espalhadas em vários arquivos"
          />
          
          <ProblemCard
            icon={<AlertCircle className="text-[#ff2d55]" size={24} />}
            title="Informações soltas"
            description="Extratos bancários, notas fiscais e boletos em lugares diferentes. Difícil ter visão do todo"
          />
          
          <ProblemCard
            icon={<EyeOff className="text-[#ff2d55]" size={24} />}
            title="Decisões no escuro"
            description="Sem saber quanto entra, quanto sai e quanto sobra. Impossível planejar o próximo mês"
          />
        </div>
      </div>
    </section>
  );
};
