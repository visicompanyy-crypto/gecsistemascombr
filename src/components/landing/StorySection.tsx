import { FloatingCardsDisplay } from "./FloatingCardsDisplay";

// Import polluted system images
import pollutedSystem1 from "@/assets/polluted-system-1.png";
import pollutedSystem2 from "@/assets/polluted-system-2.png";
import pollutedSystem3 from "@/assets/polluted-system-3.png";

// Import clean system images
import cleanSystem1 from "@/assets/clean-system-1.png";
import cleanSystem2 from "@/assets/clean-system-2.png";
import cleanSystem3 from "@/assets/clean-system-3.png";

const pollutedImages = [pollutedSystem1, pollutedSystem2, pollutedSystem3];
const cleanImages = [cleanSystem1, cleanSystem2, cleanSystem3];

export const StorySection = () => {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-[1320px] mx-auto px-6 relative z-10">
        
        {/* Opening narrative */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="font-public-sans text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            A Saldar nasceu da realidade de quem empreende no Brasil.
          </h2>
          <p className="text-xl md:text-2xl text-gray-300">
            Porque controlar o financeiro não deveria ser complicado.
          </p>
        </div>

        {/* Problem description */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            Durante anos, pequenas empresas, autônomos e MEIs enfrentaram dois problemas:{" "}
            <span className="text-white font-medium">planilhas confusas</span> ou{" "}
            <span className="text-white font-medium">sistemas caros</span>, cheios de funções 
            desnecessárias e telas poluídas.
          </p>
        </div>

        {/* Polluted systems - Floating Cards */}
        <div className="mb-12">
          <FloatingCardsDisplay images={pollutedImages} variant="polluted" />
        </div>

        {/* Highlight quotes */}
        <div className="text-center space-y-4 mb-20 max-w-3xl mx-auto">
          <p className="text-2xl md:text-3xl font-bold text-white">
            "Você só queria saber quanto entrou e quanto saiu."
          </p>
          <p className="text-xl md:text-2xl font-semibold text-[#ff2d55]">
            "Informação demais, clareza de menos."
          </p>
        </div>

        {/* Divider */}
        <div className="w-24 h-1 bg-gradient-to-r from-[#00ff88] to-[#00ff88]/50 mx-auto mb-20 rounded-full" />

        {/* Solution introduction */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h3 className="font-public-sans text-3xl md:text-4xl lg:text-5xl font-bold text-[#00ff88] mb-6">
            A Saldar foi criada para mudar isso.
          </h3>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-4">
            É um sistema feito para simplificar o seu dia a dia financeiro.
          </p>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            Sem menus escondidos, sem fórmulas, sem linguagem difícil.
          </p>
        </div>

        {/* Value proposition */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-2xl md:text-3xl font-bold text-white">
            Tudo direto ao ponto, fácil de entender e acessível de verdade.
          </p>
        </div>

        {/* Clean systems - Floating Cards */}
        <div className="mb-16">
          <FloatingCardsDisplay images={cleanImages} variant="clean" />
        </div>

        {/* Closing subtitle */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            Simples de usar, feito para o empreendedor brasileiro que precisa de{" "}
            <span className="text-[#00ff88] font-medium">controle com clareza</span> e{" "}
            <span className="text-[#00ff88] font-medium">praticidade</span>.
          </p>
        </div>

      </div>
    </section>
  );
};
