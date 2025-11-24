import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  badge?: string;
  highlighted?: boolean;
  buttonText: string;
}

export const PricingCard = ({ name, price, period, badge, highlighted, buttonText }: PricingCardProps) => {
  const navigate = useNavigate();
  
  const benefits = [
    "Acesso completo ao sistema",
    "Lançamentos ilimitados",
    "Parcelamentos automáticos",
    "Suporte prioritário",
  ];

  return (
    <div className="relative">
      {/* Badge for highlighted card */}
      {badge && highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-fintech-neon to-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
            {badge}
          </div>
        </div>
      )}

      <div
        className={`rounded-3xl p-10 transition-all duration-300 hover:-translate-y-2 relative ${
          highlighted
            ? "bg-white border-2 border-fintech-neon shadow-[0_15px_50px_rgba(138,253,86,0.3)]"
            : "bg-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        }`}
      >
        <h3 className="text-2xl font-bold mb-2 text-gray-900">
          {name}
        </h3>

        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-extrabold text-gray-900">
              R$ {price}
            </span>
            <span className="text-xl text-gray-500">
              /{period}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="flex-shrink-0 mt-0.5 text-primary" size={20} />
              <p className="text-base text-gray-600">{benefit}</p>
            </div>
          ))}
        </div>

        <Button
          onClick={() => navigate("/pricing")}
          className={`w-full py-6 rounded-xl text-base font-bold transition-all hover:scale-105 ${
            highlighted
              ? "bg-gradient-to-r from-fintech-neon to-primary hover:opacity-90 text-white shadow-[0_8px_25px_rgba(138,253,86,0.3)]"
              : "bg-primary hover:bg-primary/90 text-white"
          }`}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
