import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshSubscription } = useAuth();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const updateSubscription = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await refreshSubscription();
    };

    if (sessionId) {
      updateSubscription();
    }
  }, [sessionId, refreshSubscription]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">
          Assinatura confirmada!
        </h1>

        <p className="text-muted-foreground mb-8">
          Parabéns! Sua assinatura foi processada com sucesso. Agora você tem acesso completo a todas as funcionalidades do Saldar.
        </p>

        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={() => navigate("/dashboard")}
          >
            Ir para o Dashboard
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/pricing")}
          >
            Ver minha assinatura
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
