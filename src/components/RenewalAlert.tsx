import { AlertTriangle, Clock, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function RenewalAlert() {
  const { subscription } = useAuth();
  const navigate = useNavigate();

  // Don't show if no subscription data or whitelisted user
  if (!subscription || subscription.product_id === "whitelisted") {
    return null;
  }

  const { days_until_renewal, status } = subscription;

  // Show alert for PENDING status (payment not confirmed yet)
  if (status === "PENDING") {
    return (
      <Alert variant="destructive" className="mb-4">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Pagamento Pendente</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>Seu pagamento ainda não foi confirmado. Complete o pagamento para acessar o sistema.</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/pricing')}
            className="ml-4 shrink-0"
          >
            Ver Planos
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Show alert for OVERDUE status
  if (status === "OVERDUE") {
    return (
      <Alert variant="destructive" className="mb-4">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Assinatura Vencida</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>Sua assinatura está vencida. Renove agora para continuar usando o sistema.</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/pricing')}
            className="ml-4 shrink-0"
          >
            Renovar Agora
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Show warning if renewal is coming soon (7 days or less)
  if (days_until_renewal !== null && days_until_renewal <= 7 && days_until_renewal >= 0) {
    const isUrgent = days_until_renewal <= 3;
    
    return (
      <Alert 
        variant={isUrgent ? "destructive" : "default"} 
        className={`mb-4 ${!isUrgent ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20" : ""}`}
      >
        {isUrgent ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4 text-yellow-600" />}
        <AlertTitle className={!isUrgent ? "text-yellow-700 dark:text-yellow-500" : ""}>
          {days_until_renewal === 0 
            ? "Assinatura vence hoje!" 
            : days_until_renewal === 1 
              ? "Assinatura vence amanhã!" 
              : `Assinatura vence em ${days_until_renewal} dias`}
        </AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span className={!isUrgent ? "text-yellow-700 dark:text-yellow-500" : ""}>
            Renove sua assinatura para continuar usando o Saldar sem interrupções.
          </span>
          <Button 
            variant={isUrgent ? "outline" : "default"}
            size="sm" 
            onClick={() => navigate('/pricing')}
            className={`ml-4 shrink-0 ${!isUrgent ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}`}
          >
            Renovar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Show alert if subscription is expired (negative days)
  if (days_until_renewal !== null && days_until_renewal < 0) {
    return (
      <Alert variant="destructive" className="mb-4">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Assinatura Expirada</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>Sua assinatura expirou há {Math.abs(days_until_renewal)} dias. Renove para continuar.</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/pricing')}
            className="ml-4 shrink-0"
          >
            Renovar Agora
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
