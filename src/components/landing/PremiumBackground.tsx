import { ReactNode } from "react";
import { BackgroundPattern } from "./BackgroundPattern";

interface PremiumBackgroundProps {
  variant?: "geometric" | "grid-circular" | "organic" | "mesh";
  children?: ReactNode;
  className?: string;
}

export const PremiumBackground = ({ 
  variant = "geometric", 
  children,
  className = "" 
}: PremiumBackgroundProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-fintech-dark">
        {variant === "mesh" && (
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(circle at 20% 50%, hsl(160, 40%, 15%) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, hsl(160, 35%, 12%) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, hsl(160, 30%, 10%) 0%, transparent 50%)
              `
            }}
          />
        )}
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.08]">
        <BackgroundPattern variant={variant} />
      </div>

      {/* Ambient motion effect */}
      <div 
        className="absolute inset-0 opacity-5 animate-ambient-motion"
        style={{
          background: `radial-gradient(circle at 50% 50%, hsl(var(--fintech-light)) 0%, transparent 70%)`
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
