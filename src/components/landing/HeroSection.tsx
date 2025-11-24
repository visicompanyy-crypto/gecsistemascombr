import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TrendingUp, DollarSign, BarChart3, ArrowUpRight } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();

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
                className="bg-[hsl(var(--neon-green))] hover:bg-[hsl(var(--neon-green-dim))] text-black px-10 py-7 rounded-2xl text-lg font-bold transition-all hover:scale-105 shadow-[0_0_40px_rgba(138,253,86,0.3)] relative overflow-hidden animate-light-sweep"
              >
                Organizar meu financeiro
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
            <div className="absolute top-0 right-0 w-80 bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] animate-float-soft">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-gray-500">Saldo disponível</span>
                <DollarSign className="w-5 h-5 text-[hsl(var(--primary))]" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">R$ 124.247,82</div>
              <div className="flex items-center gap-2 text-[hsl(var(--neon-green-dim))] text-sm font-semibold">
                <ArrowUpRight className="w-4 h-4" />
                <span>+18,2% este mês</span>
              </div>
            </div>

            {/* Transactions Card */}
            <div className="absolute top-32 left-0 w-72 bg-white rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-float-delayed">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-900">Últimas transações</span>
                <BarChart3 className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fornecedor XYZ</span>
                  <span className="text-sm font-semibold text-red-500">-R$ 2.340</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cliente ABC</span>
                  <span className="text-sm font-semibold text-[hsl(var(--primary))]">+R$ 8.920</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pagamento PIX</span>
                  <span className="text-sm font-semibold text-red-500">-R$ 1.150</span>
                </div>
              </div>
            </div>

            {/* Chart Card */}
            <div className="absolute bottom-0 right-8 w-64 bg-white rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-float-soft" style={{animationDelay: '1s'}}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-900">Fluxo mensal</span>
                <TrendingUp className="w-4 h-4 text-[hsl(var(--neon-green-dim))]" />
              </div>
              <div className="h-32 flex items-end justify-between gap-2">
                {[40, 65, 45, 80, 55, 75, 90].map((height, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-[hsl(var(--neon-green))] to-[hsl(var(--neon-green-dim))] rounded-t-lg animate-graph-grow" style={{height: `${height}%`, animationDelay: `${i * 100}ms`}}></div>
                ))}
              </div>
            </div>

            {/* Total Received Badge */}
            <div className="absolute bottom-32 left-4 bg-white rounded-2xl px-6 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] animate-float-delayed" style={{animationDelay: '2s'}}>
              <div className="text-xs text-gray-500 mb-1">Total recebido</div>
              <div className="text-2xl font-bold text-[hsl(var(--primary))]">R$ 247,8K</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
