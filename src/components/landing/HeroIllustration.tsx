import { TrendingUp, FileSpreadsheet, X } from "lucide-react";

export const HeroIllustration = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Organized Dashboard - Left Side (Green) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-8 shadow-lg border-2 border-landing-green w-[52%] animate-fade-in">
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

      {/* Crumpled Paper - Right Side (Being discarded) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[52%] animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="relative transform rotate-12 opacity-60">
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
          
          {/* Red X overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-landing-negative flex items-center justify-center shadow-lg">
              <X className="text-white" size={40} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Arrow pointing from right to left (old to new) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="text-5xl opacity-50">→</div>
      </div>
    </div>
  );
};
