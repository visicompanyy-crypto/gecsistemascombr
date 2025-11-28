import { TrendingUp, FileSpreadsheet, X, CheckSquare, Calendar, DollarSign, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export const HeroIllustration = () => {
  const [showOrganized, setShowOrganized] = useState(true);
  const [showBounce, setShowBounce] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowOrganized(prev => {
        if (prev) {
          // When switching to spreadsheet, trigger bounce
          setTimeout(() => setShowBounce(true), 300);
          setTimeout(() => setShowBounce(false), 1000);
        }
        return !prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Organized Dashboard Card - Mini Dashboard */}
      <div 
        className={`absolute bg-white rounded-2xl p-4 shadow-lg border-2 border-landing-green w-[56%] transition-all duration-700 ease-in-out ${
          showOrganized 
            ? 'left-0 top-1/2 -translate-y-1/2 opacity-100 z-10 scale-100' 
            : 'left-[44%] top-1/2 -translate-y-1/2 opacity-40 z-0 scale-90'
        }`}
      >
        {/* Header verde com resultado */}
        <div className="bg-gradient-to-r from-landing-green/20 to-landing-green/10 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-1 mb-1">
            <CheckSquare className="w-3 h-3 text-landing-green" />
            <span className="text-[8px] text-landing-green font-medium uppercase tracking-wide">Resultado do Mês</span>
          </div>
          <p className="text-landing-green font-bold text-lg leading-tight">R$ 4.450,00</p>
          <p className="text-[7px] text-landing-green/80">Sobrará R$ 4.450,00 este mês</p>
        </div>

        {/* Mini cards de resumo */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <TrendingUp className="w-3 h-3 text-landing-green mx-auto mb-0.5" />
            <p className="text-[6px] text-gray-500 leading-tight">Receita Total</p>
            <p className="text-[8px] font-bold text-gray-700">R$ 58.900</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <Calendar className="w-3 h-3 text-landing-green mx-auto mb-0.5" />
            <p className="text-[6px] text-gray-500 leading-tight">Receitas Futuras</p>
            <p className="text-[8px] font-bold text-gray-700">R$ 6.250</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <DollarSign className="w-3 h-3 text-landing-green mx-auto mb-0.5" />
            <p className="text-[6px] text-gray-500 leading-tight">Receita do Mês</p>
            <p className="text-[8px] font-bold text-gray-700">R$ 4.950</p>
          </div>
        </div>

        {/* Botão de novo lançamento + seletor de mês */}
        <div className="flex items-center justify-between mb-2">
          <div className="bg-landing-green text-white text-[7px] px-2 py-1 rounded-md flex items-center gap-1 font-medium">
            <Plus className="w-2 h-2" />
            Novo Lançamento
          </div>
          <div className="text-[7px] text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <ChevronLeft className="w-2 h-2" />
            <span className="font-medium">NOV 2025</span>
            <ChevronRight className="w-2 h-2" />
          </div>
        </div>

        {/* Mini tabela de lançamentos */}
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-[7px] font-medium text-gray-600 mb-1.5">Lista de Lançamentos</p>
          <div className="space-y-1.5">
            {[
              { color: "bg-landing-green", width: "w-20" },
              { color: "bg-landing-green", width: "w-16" },
              { color: "bg-red-400", width: "w-24" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${item.color}`}></div>
                <div className={`h-2 bg-gray-200 rounded ${item.width}`}></div>
                <div className="h-2 w-10 bg-gray-200 rounded ml-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Label ✓ Organizado */}
        <div className="mt-3 text-center">
          <p className="text-sm font-bold text-landing-green">✓ Organizado</p>
        </div>
      </div>

      {/* Crumpled Paper - Spreadsheet Card */}
      <div 
        className={`absolute w-[52%] transition-all duration-700 ease-in-out ${
          showOrganized 
            ? 'right-0 top-1/2 -translate-y-1/2 opacity-60 z-0 scale-90' 
            : 'right-[48%] top-1/2 -translate-y-1/2 opacity-100 z-10 scale-100'
        }`}
      >
        <div className={`relative ${showOrganized ? 'rotate-12' : 'rotate-0'} transition-transform duration-700`}>
          {/* Paper texture effect */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-300 relative overflow-hidden">
            {/* Crumpled effect with diagonal lines */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-full h-full"
                   style={{
                     background: `repeating-linear-gradient(
                       45deg,
                       transparent,
                       transparent 10px,
                       rgba(0,0,0,0.1) 10px,
                       rgba(0,0,0,0.1) 11px
                     )`
                   }}
              />
            </div>
            
            {/* Excel-like grid */}
            <div className="space-y-3 relative">
              <FileSpreadsheet className="text-gray-400 mb-3" size={32} />
              <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Red X overlay with bounce animation */}
          <div 
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              showBounce ? 'animate-bounce-x' : ''
            }`}
          >
            <div className={`w-20 h-20 rounded-full bg-[#ff2d55] flex items-center justify-center shadow-lg transition-transform duration-300 ${
              showBounce ? 'scale-150' : 'scale-100'
            }`}>
              <X className="text-white" size={40} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Arrow indicator */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
        showOrganized ? 'opacity-50' : 'opacity-30'
      }`}>
        <div className="text-5xl text-white/50">⇄</div>
      </div>
    </div>
  );
};
