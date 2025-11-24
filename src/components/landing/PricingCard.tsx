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
      className={`rounded-3xl p-10 transition-all duration-300 hover:-translate-y-2 ${
        highlighted
          ? "bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))] border-2 border-[hsl(var(--accent-green))]/30 shadow-[0_20px_60px_rgba(138,253,86,0.2)]"
          : "bg-white border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      }`}
    >
      {badge && (
        <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-6 ${
          highlighted
            ? "bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))] border border-[hsl(var(--accent-green))]/30"
            : "bg-[hsl(var(--accent-green))]/10 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/20"
        }`}>
          {badge}
        </div>
      )}

      <h3 className={`text-2xl font-bold mb-2 ${highlighted ? "text-white" : "text-gray-900"}`}>
        {name}
      </h3>

      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          <span className={`text-6xl font-extrabold ${highlighted ? "text-white" : "text-gray-900"}`}>
            R$ {price}
          </span>
          <span className={`text-xl ${highlighted ? "text-white/70" : "text-gray-500"}`}>
            /{period}
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle2 className={`flex-shrink-0 mt-0.5 ${highlighted ? "text-[hsl(var(--accent-green))]" : "text-[hsl(var(--primary))]"}`} size={20} />
            <p className={`text-base ${highlighted ? "text-white/90" : "text-gray-600"}`}>{benefit}</p>
          </div>
        ))}
      </div>

      <Button
        onClick={() => navigate("/login")}
        className={`w-full py-6 rounded-xl text-base font-bold transition-all hover:scale-105 ${
          highlighted
            ? "bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green-light))] text-[hsl(var(--hero-dark))] shadow-[0_0_20px_rgba(138,253,86,0.3)]"
            : "bg-transparent border-2 border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-white"
        }`}
      >
        {buttonText}
      </Button>
    </div>
  );
};
