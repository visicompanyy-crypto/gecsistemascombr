import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PremiumBackground } from "./PremiumBackground";
import heroDashboard from "@/assets/hero-dashboard.png";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <PremiumBackground variant="geometric" className="py-24 md:py-32">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid md:grid-cols-[1.2fr,1fr] gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block">
              <div className="flex items-center gap-2 bg-fintech-light/20 border border-fintech-light/30 rounded-full px-4 py-2 backdrop-blur-sm">
                <span className="text-fintech-neon text-sm font-semibold">🇧🇷 Feito para empresas brasileiras</span>
              </div>
            </div>

            <h1 
              className="text-4xl md:text-5xl lg:text-7xl font-shrikhand text-white leading-tight max-w-2xl"
              style={{
                textShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 2px rgba(255,255,255,0.8)'
              }}
            >
              Controle financeiro simples e completo
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl font-jakarta">
              Organize receitas, despesas e projeções da sua empresa em um único lugar. Feito para a realidade do empreendedor brasileiro.
            </p>

            <div className="pt-4">
              <Button
                onClick={() => navigate("/login")}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-[0_8px_30px_rgba(60,146,71,0.4)]"
              >
                Começar agora
              </Button>
            </div>
          </div>

          {/* Right Column - Dashboard Card with Light Sweep */}
          <div className="relative min-h-[500px]">
            {/* Main Dashboard Card */}
            <div className="relative rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500 overflow-hidden">
              {/* Light Sweep Effect */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'light-sweep 3s ease-in-out infinite'
                }}
              />
              
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                <img 
                  src={heroDashboard} 
                  alt="Dashboard Saldar Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating Mini Cards */}
            <div className="absolute -top-6 -left-6 bg-white rounded-2xl px-5 py-4 shadow-[0_15px_40px_rgba(0,0,0,0.3)] animate-float-smooth border border-fintech-light/20 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-fintech-light/20 flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-bold text-primary">Entrada registrada</p>
                </div>
              </div>
            </div>
            
            <div 
              className="absolute top-12 -right-8 bg-white rounded-2xl px-5 py-4 shadow-[0_15px_40px_rgba(0,0,0,0.3)] border border-fintech-light/20 backdrop-blur-md animate-float-smooth"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Saldo</p>
                <p className="text-2xl font-bold text-primary">R$ 128,7K</p>
                <p className="text-xs text-green-600">+12.5%</p>
              </div>
            </div>
            
            <div 
              className="absolute -bottom-4 left-8 bg-white rounded-2xl px-5 py-4 shadow-[0_15px_40px_rgba(0,0,0,0.3)] border border-fintech-light/20 backdrop-blur-md animate-float-smooth"
              style={{ animationDelay: '1s' }}
            >
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
    </PremiumBackground>
  );
};
