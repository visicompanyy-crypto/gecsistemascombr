import { TrendingUp, FileSpreadsheet, X } from "lucide-react";
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
      {/* Organized Dashboard Card */}
      <div 
        className={`absolute bg-white rounded-2xl p-8 shadow-lg border-2 border-landing-green w-[52%] transition-all duration-700 ease-in-out ${
          showOrganized 
            ? 'left-0 top-1/2 -translate-y-1/2 opacity-100 z-10 scale-100' 
            : 'left-[48%] top-1/2 -translate-y-1/2 opacity-40 z-0 scale-90'
        }`}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-landing-green flex items-center justify-center">
            <TrendingUp className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <div className="h-3 bg-landing-green/20 rounded-full">
              <div className="h-3 bg-landing-green rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-landing-green"></div>
            <div className="h-3 bg-gray-200 rounded flex-1"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-landing-green"></div>
            <div className="h-3 bg-gray-200 rounded flex-1"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-landing-green"></div>
            <div className="h-3 bg-gray-200 rounded flex-1 w-2/3"></div>
          </div>
        </div>
        <div className="mt-6 text-center">
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
