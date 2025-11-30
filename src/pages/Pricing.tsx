import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth, PLAN_DETAILS } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import { PremiumBackground } from "@/components/landing/PremiumBackground";
import { CPFModal } from "@/components/CPFModal";

const plans = [
  {
    id: "yearly",
    name: "Plano Anual",
    price: "99,90",
    totalPrice: "1.198,80",
    period: "ano",
    badge: "Melhor custo-benefício",
    highlighted: true,
  },
  {
    id: "quarterly",
    name: "Plano Trimestral",
    price: "119,90",
    totalPrice: "359,00",
    period: "trimestre",
  },
  {
    id: "monthly",
    name: "Plano Mensal",
    price: "1,00", // TESTE - valor original: 139,90
    totalPrice: "1,00",
    period: "mês",
  },
];

const benefits = [
  "Controle completo de receitas e despesas",
  "Gestão de centros de custo",
  "Relatórios e gráficos detalhados",
  "Gestão de equipe e ferramentas",
  "Suporte prioritário",
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user, subscription, refreshSubscription } = useAuth();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCPFModal, setShowCPFModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleSubscribeClick = async (planId: string) => {
    if (!user) {
      navigate(`/signup?redirect=/pricing&plan=${planId}`);
      return;
    }
    
    // Check if user has CPF in metadata (from signup)
    const userCpf = user.user_metadata?.cpf;
    
    if (userCpf) {
      // User already has CPF, go directly to checkout
      setLoadingPlan(planId);
      try {
        const { data, error } = await supabase.functions.invoke("create-checkout", {
          body: { planId, cpfCnpj: userCpf },
        });

        if (error) throw error;

        if (data?.url) {
          window.open(data.url, "_blank");
          toast({
            title: "Redirecionando para pagamento",
            description: "Complete o pagamento na página do Asaas.",
          });
        } else {
          throw new Error("URL de pagamento não recebida");
        }
      } catch (error) {
        console.error("Error creating checkout:", error);
        toast({
          title: "Erro",
          description: "Não foi possível iniciar o checkout. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoadingPlan(null);
      }
    } else {
      // Old user without CPF, show modal
      setSelectedPlanId(planId);
      setShowCPFModal(true);
    }
  };

  const handleConfirmSubscription = async (cpfCnpj: string) => {
    if (!selectedPlanId) return;
    
    setLoadingPlan(selectedPlanId);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { planId: selectedPlanId, cpfCnpj },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        setShowCPFModal(false);
        toast({
          title: "Redirecionando para pagamento",
          description: "Complete o pagamento na página do Asaas.",
        });
      } else {
        throw new Error("URL de pagamento não recebida");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o checkout. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleRefreshSubscription = async () => {
    setIsRefreshing(true);
    await refreshSubscription();
    setIsRefreshing(false);
    toast({
      title: "Status atualizado",
      description: "O status da sua assinatura foi atualizado.",
    });
  };

  const isCurrentPlan = (planId: string) => {
    return subscription?.subscribed && subscription.product_id === planId;
  };

  const getPlanName = (productId: string | null) => {
    if (!productId) return null;
    const plan = PLAN_DETAILS[productId as keyof typeof PLAN_DETAILS];
    return plan?.name || productId;
  };

  return (
    <PremiumBackground variant="mesh" className="min-h-screen py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 text-white hover:text-white/80 hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="text-center mb-12">
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-shrikhand text-white mb-4"
            style={{
              textShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 2px rgba(255,255,255,0.8)'
            }}
          >
            Escolha seu plano
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-jakarta mb-6">
            Organize o financeiro da sua empresa com total controle
          </p>
          
          {user && subscription && (
            <div className="flex flex-col items-center gap-4">
              {subscription.subscribed && (
                <p className="text-green-400 font-medium">
                  Plano atual: {getPlanName(subscription.product_id)}
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshSubscription}
                disabled={isRefreshing}
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  "Atualizar status"
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const isCurrent = isCurrentPlan(plan.id);
            
            return (
              <Card
                key={plan.id}
                className={`p-8 relative bg-white border-0 shadow-xl animate-fade-in ${
                  plan.highlighted
                    ? "ring-2 ring-green-400"
                    : ""
                } ${isCurrent ? "ring-2 ring-green-500" : ""}`}
                style={{
                  animationDelay: `${index * 0.15}s`,
                  animationFillMode: 'both'
                }}
              >
                {plan.badge && (
                  <div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                      boxShadow: '0 4px 12px rgba(132, 204, 22, 0.4)'
                    }}
                  >
                    {plan.badge}
                  </div>
                )}
                
                {isCurrent && (
                  <div className="absolute -top-3 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Seu Plano
                  </div>
                )}

                <div className="text-center mb-6 mt-2">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900">R$ {plan.price}</span>
                    <span className="text-gray-600">/ mês</span>
                  </div>
                  {plan.id !== "monthly" && (
                    <p className="text-sm text-gray-500 mt-1">
                      Total: R$ {plan.totalPrice} / {plan.period}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full font-semibold ${
                    plan.highlighted
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-green-700 hover:bg-green-800 text-white"
                  }`}
                  onClick={() => handleSubscribeClick(plan.id)}
                  disabled={loadingPlan !== null || isCurrent}
                >
                  {loadingPlan === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : isCurrent ? (
                    "Plano Atual"
                  ) : (
                    "Assinar agora"
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      <CPFModal
        isOpen={showCPFModal}
        onClose={() => {
          setShowCPFModal(false);
          setSelectedPlanId(null);
        }}
        onConfirm={handleConfirmSubscription}
        isLoading={loadingPlan !== null}
        planName={plans.find(p => p.id === selectedPlanId)?.name || ""}
      />
    </PremiumBackground>
  );
};

export default Pricing;
