import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BrazilFlag } from "./BrazilFlag";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))] py-24 md:py-32">
      {/* Animated Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(138, 253, 86, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(138, 253, 86, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-flow 20s linear infinite'
        }}
      />
      
      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--hero-dark))]/40" />
      
      <div className="relative max-w-[1320px] mx-auto px-6">
        <div className="grid md:grid-cols-[1.2fr,1fr] gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block">
              <div className="flex items-center gap-2 bg-[hsl(var(--accent-green))]/20 border border-[hsl(var(--accent-green))]/30 rounded-full px-4 py-2">
                <span className="text-[hsl(var(--accent-green))] text-sm font-semibold">🇧🇷 Feito para empresas brasileiras</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl">
              Controle financeiro simples e completo
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl">
              Organize receitas, despesas e projeções da sua empresa em um único lugar. Feito para a realidade do empreendedor brasileiro.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => navigate("/login")}
                className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green-light))] text-[hsl(var(--hero-dark))] px-8 py-6 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-[0_0_30px_rgba(138,253,86,0.3)]"
              >
                Começar agora
              </Button>
              
              <Button
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-6 rounded-xl text-lg font-semibold transition-all backdrop-blur-sm"
              >
                Ver demonstração
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8">
              <p className="text-white/50 text-sm mb-4">Confiado por centenas de empresas</p>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <span className="text-white/70 text-xs font-medium">100+ Empresas</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <span className="text-white/70 text-xs font-medium">Seguro e Confiável</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <span className="text-white/70 text-xs font-medium">Suporte em PT-BR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Floating Cards */}
          <div className="relative min-h-[500px]">
            {/* Main Dashboard Card */}
            <div className="relative rounded-3xl bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.4)] transform hover:scale-105 transition-transform duration-500">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-600 font-semibold">Dashboard Saldar</p>
                </div>
              </div>
            </div>

            {/* Floating Mini Cards */}
            <div className="absolute -top-6 -left-6 bg-white rounded-2xl px-5 py-4 shadow-[0_15px_40px_rgba(0,0,0,0.3)] animate-float border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--accent-green))]/20 flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-bold text-[hsl(var(--primary))]">Entrada registrada</p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-12 -right-8 bg-white rounded-2xl px-5 py-4 shadow-[0_15px_40px_rgba(0,0,0,0.3)] animate-float-delayed border border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Saldo</p>
                <p className="text-2xl font-bold text-[hsl(var(--primary))]">R$ 128,7K</p>
                <p className="text-xs text-green-600">+12.5%</p>
              </div>
            </div>
            
            <div className="absolute -bottom-4 left-8 bg-white rounded-2xl px-5 py-4 shadow-[0_15px_40px_rgba(0,0,0,0.3)] animate-float border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xl">📈</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Projeção</p>
                  <p className="text-sm font-bold text-gray-800">Fluxo positivo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
