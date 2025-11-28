import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  billingInfo?: string;
  badge?: string;
  description?: string;
  highlighted?: boolean;
  neonColor?: "green" | "yellow" | "red";
  buttonText: string;
  benefits?: string[];
}

export const PricingCard = ({ 
  name, 
  price, 
  period, 
  billingInfo,
  badge, 
  description,
  highlighted,
  neonColor = "green",
  buttonText,
  benefits = [
    "Acesso completo ao sistema",
    "Lançamentos ilimitados",
    "Parcelamentos automáticos",
    "Suporte prioritário",
  ]
}: PricingCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const neonStyles = {
    green: {
      border: "border-[#00ff88]",
      shadow: "shadow-[0_0_30px_rgba(0,255,136,0.5)]",
      glow: "hover:shadow-[0_0_50px_rgba(0,255,136,0.7)]",
      badge: "bg-gradient-to-r from-[#00ff88] to-[#00cc6f]",
      button: "bg-gradient-to-r from-[#00ff88] to-[#00cc6f] hover:from-[#00cc6f] hover:to-[#00ff88]",
      title: "text-[#00ff88]"
    },
    yellow: {
      border: "border-[#ffd700]",
      shadow: "shadow-[0_0_30px_rgba(255,215,0,0.5)]",
      glow: "hover:shadow-[0_0_50px_rgba(255,215,0,0.7)]",
      badge: "bg-gradient-to-r from-[#ffd700] to-[#ffaa00]",
      button: "bg-gradient-to-r from-[#ffd700] to-[#ffaa00] hover:from-[#ffaa00] hover:to-[#ffd700]",
      title: "text-[#ffd700]"
    },
    red: {
      border: "border-[#ff0055]",
      shadow: "shadow-[0_0_30px_rgba(255,0,85,0.5)]",
      glow: "hover:shadow-[0_0_50px_rgba(255,0,85,0.7)]",
      badge: "bg-gradient-to-r from-[#ff0055] to-[#cc0044]",
      button: "bg-gradient-to-r from-[#ff0055] to-[#cc0044] hover:from-[#cc0044] hover:to-[#ff0055]",
      title: "text-[#ff0055]"
    }
  };

  const styles = neonStyles[neonColor];

  const handleClick = () => {
    if (!user) {
      navigate("/auth");
    } else {
      navigate("/pricing");
    }
  };

  return (
    <div className="relative">
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className={`${styles.badge} text-[#0a0f0b] px-6 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap`}>
            {badge}
          </div>
        </div>
      )}

      <div
        className={`rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 relative bg-[#0f1410]/80 backdrop-blur-sm border-2 ${styles.border} ${styles.shadow} ${styles.glow} ${
          highlighted ? "scale-105" : ""
        }`}
      >
        {/* Glow effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 to-transparent opacity-50 rounded-2xl" />
        
        <div className="relative z-10">
          <h3 className={`text-2xl font-bold mb-2 ${styles.title}`}>
            {name}
          </h3>

          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">
                R$
              </span>
              <span className="text-5xl font-extrabold text-white">
                {price}
              </span>
            </div>
            <span className="text-lg text-gray-300 block mt-1">
              por {period}
            </span>
            {billingInfo && (
              <p className="text-sm text-gray-400 mt-1">{billingInfo}</p>
            )}
          </div>

          {description && (
            <p className="text-base text-gray-300 mb-6">{description}</p>
          )}

          <div className="space-y-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="flex-shrink-0 mt-0.5 text-[#00ff88]" size={20} />
                <p className="text-base text-gray-300">{benefit}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={handleClick}
            className={`w-full py-6 rounded-xl text-base font-bold transition-all duration-300 hover:scale-105 text-[#0a0f0b] shadow-lg ${styles.button}`}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
