import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowLeft, Loader2, CreditCard, QrCode } from "lucide-react";
import { TrashBackground } from "@/components/checkout/TrashBackground";

const plans = [
  {
    id: "yearly",
    name: "Plano Anual",
    price: "99,90",
    totalPrice: "1.198,80",
    period: "ano",
    value: 1198.80,
  },
  {
    id: "quarterly",
    name: "Plano Trimestral",
    price: "119,90",
    totalPrice: "359,00",
    period: "trimestre",
    value: 359.00,
  },
  {
    id: "monthly",
    name: "Plano Mensal",
    price: "139,90",
    totalPrice: "139,90",
    period: "mês",
    value: 139.90,
  },
];

const benefits = [
  "Controle completo de receitas e despesas",
  "Gestão de centros de custo",
  "Relatórios e gráficos detalhados",
  "Gestão de equipe e ferramentas",
  "Suporte prioritário via WhatsApp",
];

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const planId = searchParams.get("plan");
  const selectedPlan = plans.find(p => p.id === planId);

  useEffect(() => {
    if (!planId || !selectedPlan) {
      navigate("/pricing");
    }
  }, [planId, selectedPlan, navigate]);

  useEffect(() => {
    if (!user) {
      navigate(`/auth?redirect=/checkout&plan=${planId}`);
    }
  }, [user, navigate, planId]);

  const handleFinishCheckout = async () => {
    if (!user || !selectedPlan) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { planId: selectedPlan.id },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        toast({
          title: "Redirecionando para pagamento",
          description: "Complete o pagamento na página do Asaas. Você pode pagar via PIX ou Cartão.",
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
      setLoading(false);
    }
  };

  if (!selectedPlan) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <TrashBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/pricing")}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-200/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        {/* Main content */}
        <div className="max-w-lg w-full">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Diga adeus às planilhas!
            </h1>
            <p className="text-lg text-gray-700">
              Chegou a hora de organizar suas finanças de verdade
            </p>
          </div>

          {/* Plan Card */}
          <Card className="p-8 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl">
            <div className="text-center mb-6">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
                Plano Selecionado
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedPlan.name}
              </h2>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  R$ {selectedPlan.totalPrice}
                </span>
                <span className="text-gray-600">/ {selectedPlan.period}</span>
              </div>
              {selectedPlan.id !== "monthly" && (
                <p className="text-sm text-green-600 mt-1">
                  Equivalente a R$ {selectedPlan.price}/mês
                </p>
              )}
            </div>

            {/* Payment methods */}
            <div className="flex items-center justify-center gap-4 mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <QrCode className="h-5 w-5 text-green-600" />
                <span>PIX</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span>Cartão de Crédito</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-4">
                O que está incluso:
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={handleFinishCheckout}
              disabled={loading}
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Gerando link de pagamento...
                </>
              ) : (
                "Finalizar assinatura"
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Pagamento seguro via Asaas. Cancele quando quiser.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
