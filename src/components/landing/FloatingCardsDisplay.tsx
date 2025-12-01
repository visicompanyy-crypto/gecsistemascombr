import { useState, useEffect } from "react";

interface FloatingCardsDisplayProps {
  images: string[];
  variant: "polluted" | "clean";
}

export const FloatingCardsDisplay = ({ images, variant }: FloatingCardsDisplayProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const getCardStyles = (index: number) => {
    const position = (index - activeIndex + images.length) % images.length;
    
    const baseClasses = "absolute rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-700 ease-in-out";
    
    const borderColor = variant === "polluted" 
      ? "border-[#ff2d55]" 
      : "border-[#00ff88]";
    
    // Position configurations for 3 cards
    if (position === 0) {
      // Front card - center, no rotation, full opacity
      return {
        className: `${baseClasses} ${borderColor} z-30`,
        style: {
          transform: "translateX(-50%) rotate(0deg) scale(1)",
          left: "50%",
          opacity: 1,
          borderWidth: "3px",
        }
      };
    } else if (position === 1) {
      // Right card - rotated right, behind
      return {
        className: `${baseClasses} ${borderColor}/50 z-20`,
        style: {
          transform: `translateX(-50%) translateX(10%) rotate(${variant === "polluted" ? "6deg" : "5deg"}) scale(0.9)`,
          left: "50%",
          opacity: 0.7,
        }
      };
    } else {
      // Left card - rotated left, furthest back
      return {
        className: `${baseClasses} ${borderColor}/30 z-10`,
        style: {
          transform: `translateX(-50%) translateX(-10%) rotate(${variant === "polluted" ? "-6deg" : "-5deg"}) scale(0.85)`,
          left: "50%",
          opacity: 0.5,
        }
      };
    }
  };

  const dotActiveColor = variant === "polluted" ? "bg-[#ff2d55]" : "bg-[#00ff88]";

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      {/* Cards container */}
      <div className="relative h-[350px] sm:h-[450px] md:h-[400px] lg:h-[500px]">
        {images.map((image, index) => {
          const { className, style } = getCardStyles(index);
          return (
            <div
              key={index}
              className={className}
              style={style}
            >
              <img
                src={image}
                alt={`${variant === "polluted" ? "Sistema complexo" : "Sistema Saldar"} ${index + 1}`}
                className="w-[520px] sm:w-[680px] md:w-[600px] lg:w-[800px] h-auto object-cover"
              />
            </div>
          );
        })}
      </div>

    </div>
  );
};
