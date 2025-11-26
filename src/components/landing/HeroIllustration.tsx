import { TrendingUp, FileSpreadsheet, X } from "lucide-react";

export const HeroIllustration = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Organized Dashboard - Left Side (Green) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-lg border-2 border-landing-green w-[45%] animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-landing-green flex items-center justify-center">
            <TrendingUp className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <div className="h-2 bg-landing-green/20 rounded-full">
              <div className="h-2 bg-landing-green rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-landing-green"></div>
            <div className="h-2 bg-gray-200 rounded flex-1"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-landing-green"></div>
            <div className="h-2 bg-gray-200 rounded flex-1"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-landing-green"></div>
            <div className="h-2 bg-gray-200 rounded flex-1 w-2/3"></div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs font-bold text-landing-green">✓ Organizado</p>
        </div>
      </div>

      {/* Crumpled Paper - Right Side (Being discarded) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="relative transform rotate-12 opacity-60">
          {/* Paper texture effect */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-300 relative overflow-hidden">
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
            <div className="space-y-2 relative">
              <FileSpreadsheet className="text-gray-400 mb-2" size={24} />
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-3 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Red X overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-landing-negative flex items-center justify-center shadow-lg">
              <X className="text-white" size={32} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Arrow pointing from right to left (old to new) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="text-4xl opacity-50">→</div>
      </div>
    </div>
  );
};
