interface BackgroundPatternProps {
  variant: "geometric" | "grid-circular" | "organic" | "mesh";
}

export const BackgroundPattern = ({ variant }: BackgroundPatternProps) => {
  if (variant === "geometric") {
    return (
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="geometric-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path 
              d="M0,50 Q25,25 50,50 T100,50" 
              stroke="hsl(var(--fintech-light))" 
              strokeWidth="0.5" 
              fill="none"
            />
            <circle cx="25" cy="25" r="15" stroke="hsl(var(--fintech-light))" strokeWidth="0.5" fill="none" />
            <circle cx="75" cy="75" r="20" stroke="hsl(var(--fintech-light))" strokeWidth="0.5" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geometric-pattern)" />
      </svg>
    );
  }

  if (variant === "grid-circular") {
    return (
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-circular-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="25" stroke="hsl(var(--fintech-light))" strokeWidth="0.5" fill="none" />
            <circle cx="40" cy="40" r="15" stroke="hsl(var(--fintech-light))" strokeWidth="0.5" fill="none" />
            <circle cx="40" cy="40" r="5" stroke="hsl(var(--fintech-light))" strokeWidth="0.5" fill="none" />
            <line x1="0" y1="40" x2="80" y2="40" stroke="hsl(var(--fintech-light))" strokeWidth="0.3" />
            <line x1="40" y1="0" x2="40" y2="80" stroke="hsl(var(--fintech-light))" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-circular-pattern)" />
      </svg>
    );
  }

  if (variant === "organic") {
    return (
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="organic-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <path 
              d="M20,60 Q40,20 60,60 Q80,100 100,60" 
              stroke="hsl(var(--fintech-light))" 
              strokeWidth="0.5" 
              fill="none"
            />
            <ellipse cx="30" cy="30" rx="20" ry="30" stroke="hsl(var(--fintech-light))" strokeWidth="0.5" fill="none" opacity="0.6" />
            <ellipse cx="90" cy="90" rx="25" ry="15" stroke="hsl(var(--fintech-light))" strokeWidth="0.5" fill="none" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#organic-pattern)" />
      </svg>
    );
  }

  return null;
};
