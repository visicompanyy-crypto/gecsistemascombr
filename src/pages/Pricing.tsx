import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth, PLAN_DETAILS } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ArrowLeft, Loader2, CreditCard, Sparkles, Clock, AlertTriangle } from "lucide-react";
import { NeonBackground } from "@/components/landing/NeonBackground";
import { CPFModal } from "@/components/CPFModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const plans = [
  {
    id: "yearly",
    name: "Anual",
    price: "99,90",
    totalPrice: "1.198,80",
    period: "ano",
    billingInfo: "Cobrado R$ 1.198,80 por ano",
    badge: "Melhor custo-benefício",
    highlighted: true,
    neonColor: "green" as const,
  },
  {
    id: "quarterly",
    name: "Trimestral",
    price: "119,90",
    totalPrice: "359,00",
    period: "trimestre",
    billingInfo: "Cobrado R$ 359,00 por trimestre",
    neonColor: "yellow" as const,
  },
  {
    id: "monthly",
    name: "Mensal",
    price: "139,90",
    totalPrice: "139,90",
    period: "mês",
    billingInfo: "Cobrado mensalmente",
    neonColor: "red" as const,
  },
];

const benefits = [
  "Controle completo de receitas e despesas",
  "Gestão de centros de custo",
  "Relatórios e gráficos detalhados",
  "Gestão de equipe e ferramentas",
  "Suporte prioritário",
];

const neonStyles = {
  green: {
    border: "border-[#00ff88]",
    shadow: "shadow-[0_0_30px_rgba(0,255,136,0.5)]",
    glow: "hover:shadow-[0_0_50px_rgba(0,255,136,0.7)]",
    badge: "bg-gradient-to-r from-[#00ff88] to-[#00cc6f]",
    button: "bg-gradient-to-r from-[#00ff88] to-[#00cc6f] hover:from-[#00cc6f] hover:to-[#00ff88]",
    title: "text-[#00ff88]",
    checkColor: "text-[#00ff88]",
  },
  yellow: {
    border: "border-[#ffd700]",
    shadow: "shadow-[0_0_30px_rgba(255,215,0,0.5)]",
    glow: "hover:shadow-[0_0_50px_rgba(255,215,0,0.7)]",
    badge: "bg-gradient-to-r from-[#ffd700] to-[#ffaa00]",
    button: "bg-gradient-to-r from-[#ffd700] to-[#ffaa00] hover:from-[#ffaa00] hover:to-[#ffd700]",
    title: "text-[#ffd700]",
    checkColor: "text-[#ffd700]",
  },
  red: {
    border: "border-[#ff0055]",
    shadow: "shadow-[0_0_30px_rgba(255,0,85,0.5)]",
    glow: "hover:shadow-[0_0_50px_rgba(255,0,85,0.7)]",
    badge: "bg-gradient-to-r from-[#ff0055] to-[#cc0044]",
    button: "bg-gradient-to-r from-[#ff0055] to-[#cc0044] hover:from-[#cc0044] hover:to-[#ff0055]",
    title: "text-[#ff0055]",
    checkColor: "text-[#ff0055]",
  },
};

const Pricing = () => {
  const navigate = useNavigate();
  const { user, subscription, refreshSubscription } = useAuth();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCPFModal, setShowCPFModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const startPaymentPolling = () => {
    setIsCheckingPayment(true);
    pollingRef.current = setInterval(async () => {
      await refreshSubscription();
    }, 5000);
  };

  const stopPaymentPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setIsCheckingPayment(false);
    setShowPaymentModal(false);
  };

  useEffect(() => {
    if (subscription?.subscribed && showPaymentModal) {
      stopPaymentPolling();
      toast({
        title: "Pagamento confirmado!",
        description: "Bem-vindo ao Saldar! Redirecionando para o dashboard...",
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  }, [subscription?.subscribed, showPaymentModal, navigate, toast]);

  const handleSubscribeClick = async (planId: string) => {
    if (!user) {
      navigate(`/signup?redirect=/pricing&plan=${planId}`);
      return;
    }
    
    const userCpf = user.user_metadata?.cpf;
    
    if (userCpf) {
      setLoadingPlan(planId);
      try {
        const { data, error } = await supabase.functions.invoke("create-checkout", {
          body: { planId, cpfCnpj: userCpf },
        });

        if (error) throw error;

        if (data?.url) {
          window.open(data.url, "_blank");
          setShowPaymentModal(true);
          startPaymentPolling();
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
        setShowPaymentModal(true);
        startPaymentPolling();
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
    <div className="min-h-screen relative overflow-hidden">
      <NeonBackground />
      
      <div className="relative z-10 py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 text-white/70 hover:text-white hover:bg-white/10 border border-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          {/* Trial Expired Alert */}
          {subscription?.status === "TRIAL" && subscription?.days_until_renewal !== undefined && subscription.days_until_renewal <= 0 && (
            <div className="mb-12 animate-fade-in">
              <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-[#ff0055]/20 to-[#ff0055]/10 border-2 border-[#ff0055] shadow-[0_0_30px_rgba(255,0,85,0.4)]">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#ff0055]/30 flex items-center justify-center animate-pulse">
                    <AlertTriangle className="h-7 w-7 text-[#ff0055]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white mb-1">
                      Seu período gratuito expirou!
                    </h3>
                    <p className="text-gray-300">
                      Assine agora para continuar usando o Saldar e não perder seus dados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-16">
            {/* Dynamic Trial Badge */}
            {(() => {
              const isTrialActive = subscription?.status === "TRIAL";
              const daysRemaining = subscription?.days_until_renewal;
              const isSubscribed = subscription?.subscribed && subscription?.status !== "TRIAL";
              
              // Don't show badge if user is an active subscriber
              if (isSubscribed) return null;
              
              // Trial expired - don't show badge (alert is shown above)
              if (isTrialActive && daysRemaining !== undefined && daysRemaining <= 0) return null;
              
              // Determine badge content based on trial status
              let badgeText = "3 MESES GRÁTIS PARA TESTAR";
              let badgeColor = "#00ff88";
              let bgColor = "bg-[#00ff88]/20";
              let borderColor = "border-[#00ff88]/50";
              let IconComponent = Sparkles;
              let isPulsing = false;
              
              if (isTrialActive && daysRemaining !== undefined) {
                IconComponent = Clock;
                
                if (daysRemaining === 1) {
                  badgeText = "ÚLTIMO DIA DE ACESSO GRATUITO!";
                  badgeColor = "#ff0055";
                  bgColor = "bg-[#ff0055]/20";
                  borderColor = "border-[#ff0055]/50";
                  isPulsing = true;
                } else if (daysRemaining <= 7) {
                  badgeText = `${daysRemaining} DIAS GRÁTIS RESTANTES`;
                  badgeColor = "#ffd700";
                  bgColor = "bg-[#ffd700]/20";
                  borderColor = "border-[#ffd700]/50";
                } else {
                  badgeText = `${daysRemaining} DIAS GRÁTIS RESTANTES`;
                  // Keep green color for more than 7 days
                }
              }
              
              return (
                <div className={`inline-flex items-center gap-2 ${bgColor} border ${borderColor} rounded-full px-6 py-2 mb-8 ${isPulsing ? 'animate-pulse' : ''}`}>
                  <IconComponent className="h-4 w-4" style={{ color: badgeColor }} />
                  <span className="font-semibold text-sm" style={{ color: badgeColor }}>{badgeText}</span>
                </div>
              );
            })()}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {subscription?.status === "TRIAL" && subscription?.days_until_renewal !== undefined && subscription.days_until_renewal <= 0 ? (
                <>
                  Desbloqueie seu{" "}
                  <span 
                    className="text-[#ff0055]"
                    style={{
                      textShadow: '0 0 30px rgba(255,0,85,0.5), 0 0 60px rgba(255,0,85,0.3)'
                    }}
                  >
                    acesso
                  </span>
                </>
              ) : (
                <>
                  Escolha seu{" "}
                  <span 
                    className="text-[#00ff88]"
                    style={{
                      textShadow: '0 0 30px rgba(0,255,136,0.5), 0 0 60px rgba(0,255,136,0.3)'
                    }}
                  >
                    plano
                  </span>
                </>
              )}
            </h1>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto mb-8">
              {subscription?.status === "TRIAL" && subscription?.days_until_renewal !== undefined && subscription.days_until_renewal <= 0 
                ? "Sua jornada não precisa parar aqui. Escolha um plano e continue crescendo!"
                : "Organize o financeiro da sua empresa com total controle e praticidade"
              }
            </p>
            
            {user && subscription && (
              <div className="flex flex-col items-center gap-4">
                {subscription.subscribed && subscription.status !== "TRIAL" && (
                  <p className="text-[#00ff88] font-medium">
                    Plano atual: {getPlanName(subscription.product_id)}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshSubscription}
                  disabled={isRefreshing}
                  className="border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/10 hover:text-[#00ff88] bg-transparent"
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
              const styles = neonStyles[plan.neonColor];
              
              return (
                <div
                  key={plan.id}
                  className="relative animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <div className={`${styles.badge} text-[#0a0f0b] px-6 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap`}>
                        {plan.badge}
                      </div>
                    </div>
                  )}
                  
                  {isCurrent && (
                    <div className="absolute -top-4 right-4 z-20 bg-[#00ff88] text-[#0a0f0b] px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      Seu Plano
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 relative bg-[#0f1410]/80 backdrop-blur-sm border-2 ${styles.border} ${styles.shadow} ${styles.glow} ${
                      plan.highlighted ? "scale-105" : ""
                    }`}
                  >
                    {/* Glow effect background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 to-transparent opacity-50 rounded-2xl" />
                    
                    <div className="relative z-10">
                      <h3 className={`text-2xl font-bold mb-2 ${styles.title}`}>
                        {plan.name}
                      </h3>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-white">R$</span>
                          <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                          <span className="text-lg text-gray-300">/mês</span>
                        </div>
                        {plan.billingInfo && (
                          <p className="text-sm text-gray-400 mt-2">{plan.billingInfo}</p>
                        )}
                      </div>

                      <div className="space-y-4 mb-8">
                        {benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-start gap-3">
                            <CheckCircle2 className={`flex-shrink-0 mt-0.5 ${styles.checkColor}`} size={20} />
                            <p className="text-base text-gray-300">{benefit}</p>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleSubscribeClick(plan.id)}
                        disabled={loadingPlan !== null || isCurrent}
                        className={`w-full py-6 rounded-xl text-base font-bold transition-all duration-300 hover:scale-105 text-[#0a0f0b] shadow-lg ${styles.button} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {loadingPlan === plan.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : isCurrent ? (
                          "Plano Atual"
                        ) : !user ? (
                          "Começar Teste Grátis"
                        ) : subscription?.status === "TRIAL" && subscription?.days_until_renewal !== undefined && subscription.days_until_renewal <= 0 ? (
                          "Desbloquear Acesso"
                        ) : (
                          "Assinar agora"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

      {/* Payment Status Modal */}
      <Dialog open={showPaymentModal} onOpenChange={(open) => {
        if (!open) stopPaymentPolling();
      }}>
        <DialogContent className="sm:max-w-md bg-[#0f1410] border-[#00ff88]/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <CreditCard className="h-5 w-5 text-[#00ff88]" />
              Aguardando pagamento
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Complete o pagamento na aba do Asaas que foi aberta.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-6 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#00ff88]/20 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-300">
                {isCheckingPayment ? "Verificando pagamento..." : "Aguardando confirmação..."}
              </p>
              <p className="text-xs text-gray-500">
                Assim que o pagamento for confirmado, você será redirecionado automaticamente.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                setIsRefreshing(true);
                await refreshSubscription();
                setIsRefreshing(false);
              }}
              disabled={isRefreshing}
              className="border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/10 bg-transparent"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Já paguei, verificar agora"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={stopPaymentPolling}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
