import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export const TrialBanner = () => {
  const { subscription } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  // Only show for trial subscriptions
  if (!subscription || subscription.status !== "TRIAL" || dismissed) {
    return null;
  }

  const daysRemaining = subscription.days_until_renewal ?? 0;

  // Determine urgency level and styling
  const getUrgencyStyles = () => {
    if (daysRemaining <= 1) {
      return {
        bgClass: "bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/50",
        textClass: "text-red-100",
        iconClass: "text-red-400",
        buttonClass: "bg-red-500 hover:bg-red-600 text-white",
        animate: true,
      };
    } else if (daysRemaining <= 3) {
      return {
        bgClass: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50",
        textClass: "text-yellow-100",
        iconClass: "text-yellow-400",
        buttonClass: "bg-yellow-500 hover:bg-yellow-600 text-black",
        animate: false,
      };
    } else {
      return {
        bgClass: "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-500/50",
        textClass: "text-emerald-100",
        iconClass: "text-emerald-400",
        buttonClass: "bg-emerald-500 hover:bg-emerald-600 text-white",
        animate: false,
      };
    }
  };

  const styles = getUrgencyStyles();

  const getMessage = () => {
    if (daysRemaining <= 0) {
      return "Seu período de teste expirou! Assine agora para continuar usando.";
    } else if (daysRemaining === 1) {
      return "⚠️ ÚLTIMO DIA! Assine agora para não perder acesso ao sistema.";
    } else if (daysRemaining <= 3) {
      return `Seu teste está acabando! ${daysRemaining} dias restantes - Assine agora!`;
    } else {
      return `Período de teste: ${daysRemaining} dias restantes`;
    }
  };

  return (
    <div
      className={`relative w-full py-3 px-4 border ${styles.bgClass} backdrop-blur-sm ${
        styles.animate ? "animate-pulse" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {daysRemaining <= 1 ? (
            <AlertTriangle className={`h-5 w-5 ${styles.iconClass}`} />
          ) : (
            <Clock className={`h-5 w-5 ${styles.iconClass}`} />
          )}
          <p className={`text-sm font-medium ${styles.textClass}`}>
            {getMessage()}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/pricing")}
            size="sm"
            className={`${styles.buttonClass} font-semibold shadow-lg`}
          >
            {daysRemaining <= 1 ? "Assinar Agora!" : "Escolher Plano"}
          </Button>
          
          {daysRemaining > 3 && (
            <button
              onClick={() => setDismissed(true)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className={`h-4 w-4 ${styles.iconClass}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
