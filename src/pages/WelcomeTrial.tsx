import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Sparkles, BarChart3, Users, Bot, ArrowRight, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

export default function WelcomeTrial() {
  const navigate = useNavigate();
  const { subscription, subscriptionLoading, refreshSubscription } = useAuth();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    
    try {
      // If subscription not loaded or not subscribed, force refresh
      if (subscriptionLoading || !subscription?.subscribed) {
        await refreshSubscription();
        
        // Small delay to allow state to propagate
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error starting:", error);
      navigate("/dashboard");
    } finally {
      setIsStarting(false);
    }
  };

  const benefits = [
    { icon: BarChart3, text: "Controle total das suas finanças" },
    { icon: CheckCircle, text: "Categorização de receitas e despesas" },
    { icon: Users, text: "Gestão de clientes e centros de custo" },
    { icon: Bot, text: "Assistente IA para tirar dúvidas" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f3f4] via-[#eef1f3] to-[#e4e8eb] p-4">
      <Card className="w-full max-w-lg bg-white/80 backdrop-blur-md border border-white/40 shadow-[0_20px_80px_rgba(0,0,0,0.08)] rounded-[28px] p-10">
        {/* Logo e Ícone de Celebração */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <img 
              src={logo} 
              alt="Saldar Logo" 
              className="w-20 h-20 object-contain"
            />
            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-[#252F1D] text-center mb-3 tracking-tight">
            Bem-vindo ao Saldar! 🎉
          </h1>
          
          <div className="bg-gradient-to-r from-[#3c9247]/10 to-[#2e6b38]/10 border border-[#3c9247]/20 rounded-2xl px-6 py-3 mb-4">
            <p className="text-center text-[#3c9247] font-semibold">
              Você tem 3 meses de acesso gratuito! 🎉
            </p>
          </div>
          
          <p className="text-center text-[#6b7280] text-sm">
            Aproveite todos os recursos do sistema gratuitamente durante esse período.
          </p>
        </div>

        {/* Lista de Benefícios */}
        <div className="space-y-3 mb-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 bg-[#f8faf8] rounded-xl border border-[#e4e8eb]"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#3c9247] to-[#2e6b38] rounded-xl flex items-center justify-center">
                <benefit.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#252F1D] font-medium">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Botão CTA */}
        <Button 
          onClick={handleStart}
          disabled={isStarting}
          className="w-full h-14 bg-gradient-to-b from-[#3c9247] to-[#2e6b38] hover:from-[#45a352] hover:to-[#357042] text-white font-semibold text-lg rounded-full shadow-[0_6px_25px_rgba(60,146,71,0.3)] hover:shadow-[0_8px_30px_rgba(60,146,71,0.4)] transition-all duration-300 group"
        >
          {isStarting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Preparando...
            </>
          ) : (
            <>
              Começar a usar o Saldar
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        <p className="text-center text-[#9ca3af] text-xs mt-4">
          Após os 3 meses gratuitos, escolha um plano para continuar usando.
        </p>
      </Card>
    </div>
  );
}
