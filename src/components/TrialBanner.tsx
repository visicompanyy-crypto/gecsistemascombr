import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export const TrialBanner = () => {
  const { subscription } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  // Only show for trial or free period subscriptions
  if (!subscription || dismissed) {
    return null;
  }

  const isTrial = subscription.status === "TRIAL";

  // Don't show banner for other statuses
  if (!isTrial) {
    return null;
  }

  const daysRemaining = subscription.days_until_renewal ?? 0;

  // For trial/free period subscriptions
  const getUrgencyStyles = () => {
    if (daysRemaining <= 1) {
      return {
        bgClass: "bg-gradient-to-r from-red-600 to-red-700 border-red-600",
        textClass: "text-white font-semibold drop-shadow-sm",
        iconClass: "text-white",
        buttonClass: "bg-white hover:bg-gray-100 text-red-600 font-bold",
        animate: true,
      };
    } else if (daysRemaining <= 3) {
      return {
        bgClass: "bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-500",
        textClass: "text-amber-950 font-semibold",
        iconClass: "text-amber-900",
        buttonClass: "bg-amber-900 hover:bg-amber-950 text-white font-bold",
        animate: false,
      };
    } else {
      return {
        bgClass: "bg-gradient-to-r from-emerald-600 to-green-600 border-emerald-600",
        textClass: "text-white font-semibold drop-shadow-sm",
        iconClass: "text-white",
        buttonClass: "bg-white hover:bg-gray-100 text-emerald-700 font-bold",
        animate: false,
      };
    }
  };

  const styles = getUrgencyStyles();

  const getMessage = () => {
    if (daysRemaining <= 0) {
      return "Seu período gratuito expirou! Assine agora para continuar usando.";
    } else if (daysRemaining === 1) {
      return "⚠️ ÚLTIMO DIA! Assine agora para não perder acesso ao sistema.";
    } else if (daysRemaining <= 7) {
      return `Seu acesso gratuito está acabando! ${daysRemaining} dias restantes - Assine agora!`;
    } else {
      return `🎉 Acesso gratuito: ${daysRemaining} dias restantes`;
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
