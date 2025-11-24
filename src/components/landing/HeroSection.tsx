import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TrendingUp, DollarSign, BarChart3, ArrowUpRight } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  const balanceCount = useCountUp({ 
    end: 124247.82, 
    duration: 2000, 
    decimals: 2,
    prefix: 'R$ ',
    suffix: '' 
  });
  
  const totalCount = useCountUp({ 
    end: 247.8, 
    duration: 2000, 
    decimals: 1,
    prefix: 'R$ ',
    suffix: 'K' 
  });

  return (
    <section className="relative overflow-hidden bg-[hsl(var(--dark-bg))] py-24 md:py-32 lg:py-40">
      {/* Ambient shapes */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[hsl(var(--neon-green))]/5 rounded-full blur-3xl animate-ambient"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[hsl(var(--primary))]/5 rounded-full blur-3xl animate-ambient" style={{animationDelay: '5s'}}></div>
      
      <div className="max-w-[1320px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1fr,1fr] gap-16 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8 animate-fade-slide-up">
            <h1 className="title-outlined text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
              Suite de produtos financeiros e soluções de pagamento
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl">
              A Saldar entrega clareza, controle e previsibilidade para empresas brasileiras crescerem com segurança.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => navigate("/login")}
                className="bg-[hsl(var(--neon-green))] hover:bg-[hsl(var(--neon-green-dim))] text-black px-12 py-8 rounded-2xl text-xl font-bold transition-premium hover:scale-105 hover:brightness-110 shadow-[0_0_60px_rgba(138,253,86,0.4)] hover:shadow-[0_0_80px_rgba(138,253,86,0.6)] relative overflow-hidden"
                style={{ willChange: 'transform' }}
              >
                <span className="relative z-10">Organizar meu financeiro</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-light-sweep"></div>
              </Button>
              
              <Button
                variant="outline"
                className="border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-7 rounded-2xl text-lg font-semibold transition-all"
              >
                Conhecer a plataforma
              </Button>
            </div>
          </div>

          {/* Right Column - Floating Cards */}
          <div className="relative h-[600px] hidden lg:block">
            {/* Main Balance Card */}
            <div 
              ref={balanceCount.ref}
              className="glass-card absolute top-0 right-0 w-80 rounded-3xl p-8 shadow-premium shadow-premium-hover animate-float-soft transition-premium hover:scale-[1.02] hover:-translate-y-1"
              style={{ willChange: 'transform' }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-base font-semibold text-gray-700">Saldo disponível</span>
                <DollarSign className="w-5 h-5 text-[hsl(var(--primary))]" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {balanceCount.value}
              </div>
              <div className="flex items-center gap-2 text-[hsl(var(--neon-green))] text-base font-bold bg-[hsl(var(--neon-green))]/10 px-3 py-1.5 rounded-xl w-fit">
                <ArrowUpRight className="w-5 h-5" />
                <span>+18,2% este mês</span>
              </div>
            </div>

            {/* Transactions Card */}
            <div className="glass-card absolute top-32 left-0 w-72 rounded-3xl p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] shadow-premium-hover animate-float-delayed transition-premium hover:scale-[1.02] hover:-translate-y-1" style={{ willChange: 'transform' }}>
              <div className="flex items-center justify-between mb-5">
                <span className="text-base font-bold text-gray-800">Últimas transações</span>
                <BarChart3 className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base text-gray-800 font-semibold">Fornecedor XYZ</span>
                  <span className="text-base font-bold text-red-500">-R$ 2.340</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base text-gray-800 font-semibold">Cliente ABC</span>
                  <span className="text-base font-bold text-[hsl(var(--neon-green))]">+R$ 8.920</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base text-gray-800 font-semibold">Pagamento PIX</span>
                  <span className="text-base font-bold text-red-500">-R$ 1.150</span>
                </div>
              </div>
            </div>

            {/* Chart Card */}
            <div className="glass-card absolute bottom-0 right-8 w-64 rounded-3xl p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] shadow-premium-hover animate-float-soft transition-premium hover:scale-[1.02] hover:-translate-y-1" style={{animationDelay: '1s', willChange: 'transform'}}>
              <div className="flex items-center justify-between mb-5">
                <span className="text-base font-bold text-gray-800">Fluxo mensal</span>
                <TrendingUp className="w-4 h-4 text-[hsl(var(--neon-green-dim))]" />
              </div>
              <div className="h-32 flex items-end justify-between gap-2">
                {[40, 65, 45, 80, 55, 75, 90].map((height, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-[hsl(var(--neon-green))] to-[hsl(var(--neon-green-dim))] rounded-t-lg animate-bar-grow" style={{height: `${height}%`, animationDelay: `${i * 100}ms`}}></div>
                ))}
              </div>
            </div>

            {/* Total Received Badge */}
            <div 
              ref={totalCount.ref}
              className="glass-card absolute bottom-32 left-4 rounded-2xl px-6 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.3)] shadow-premium-hover animate-float-delayed transition-premium hover:scale-[1.02] hover:-translate-y-1" 
              style={{animationDelay: '2s', willChange: 'transform'}}
            >
              <div className="text-sm text-gray-700 font-semibold mb-1">Total recebido</div>
              <div className="text-2xl font-bold text-[hsl(var(--primary))]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {totalCount.value}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
