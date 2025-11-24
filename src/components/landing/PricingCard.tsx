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
    <div
      className={`rounded-3xl p-12 transition-all duration-300 hover:scale-105 ${
        highlighted
          ? "bg-white border-2 border-primary shadow-[0_10px_40px_rgba(60,146,71,0.2)]"
          : "bg-white border border-[#e6e6e6] shadow-[0_5px_20px_rgba(0,0,0,0.06)]"
      }`}
    >
      {badge && (
        <div className="inline-block bg-[#C4FEA1] text-[#252F1D] px-4 py-2 rounded-full text-sm font-semibold mb-6">
          {badge}
        </div>
      )}

      <h3 className="text-2xl font-bold text-[#252F1D] mb-2">
        {name}
      </h3>

      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-extrabold text-[#252F1D]">
            R$ {price}
          </span>
          <span className="text-xl text-[#6b7280]">
            /{period}
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={20} />
            <p className="text-base text-[#4a4a4a]">{benefit}</p>
          </div>
        ))}
      </div>

      <Button
        onClick={() => navigate("/login")}
        className={`w-full py-6 rounded-xl text-base font-semibold transition-all ${
          highlighted
            ? "bg-primary hover:bg-primary/90 text-white"
            : "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white"
        }`}
      >
        {buttonText}
      </Button>
    </div>
  );
};
