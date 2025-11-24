import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth, PLAN_DETAILS } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowLeft, Loader2 } from "lucide-react";

const plans = [
  {
    name: "Plano Anual",
    price: "99",
    period: "ano",
    priceId: "price_1SX0tMHBNcHovPNJRDUQnTd3",
    productId: "prod_TTyrsADHJ2kqDE",
    badge: "Melhor custo-benefício",
    highlighted: true,
  },
  {
    name: "Plano Trimestral",
    price: "119",
    period: "3 meses",
    priceId: "price_1SX0uXHBNcHovPNJu11958UU",
    productId: "prod_TTysnvfLhDnz9L",
  },
  {
    name: "Plano Mensal",
    price: "139",
    period: "mês",
    priceId: "price_1SX0vxHBNcHovPNJcjAdKS7a",
    productId: "prod_TTyt9F1mm17zg6",
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

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para assinar um plano.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setLoadingPlan(priceId);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
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

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o portal de gerenciamento.",
        variant: "destructive",
      });
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

  const isCurrentPlan = (productId: string) => {
    return subscription?.subscribed && subscription.product_id === productId;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Escolha seu plano
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Organize o financeiro da sua empresa com total controle
          </p>
          
          {user && subscription && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshSubscription}
                disabled={isRefreshing}
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
              
              {subscription.subscribed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManageSubscription}
                >
                  Gerenciar assinatura
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const isCurrent = isCurrentPlan(plan.productId);
            
            return (
              <Card
                key={plan.priceId}
                className={`p-8 relative ${
                  plan.highlighted
                    ? "border-2 border-primary shadow-lg"
                    : ""
                } ${isCurrent ? "ring-2 ring-green-500" : ""}`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    {plan.badge}
                  </div>
                )}
                
                {isCurrent && (
                  <div className="absolute -top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Seu Plano
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold">R$ {plan.price}</span>
                    <span className="text-muted-foreground">/ {plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan.priceId, plan.name)}
                  disabled={loadingPlan !== null || isCurrent}
                >
                  {loadingPlan === plan.priceId ? (
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

        <div className="text-center text-sm text-muted-foreground">
          <p>Todos os planos incluem 7 dias de teste grátis</p>
          <p>Cancele a qualquer momento, sem compromisso</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
