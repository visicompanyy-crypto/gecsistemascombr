import { useTheme } from "next-themes";
import { Sun, Moon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetOnboardingTour } from "@/components/OnboardingTour";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderControlsProps {
  onRestartTour?: () => void;
}

export function HeaderControls({ onRestartTour }: HeaderControlsProps) {
  const { theme, setTheme } = useTheme();

  const handleRestartTour = () => {
    resetOnboardingTour();
    onRestartTour?.();
  };

  return (
    <div className="flex items-center gap-1">
      {/* Toggle Tema */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-lg hover:bg-muted"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-foreground" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{theme === "dark" ? "Modo claro" : "Modo escuro"}</p>
        </TooltipContent>
      </Tooltip>

      {/* Rever Tutorial */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRestartTour}
            className="h-9 w-9 rounded-lg hover:bg-muted"
          >
            <HelpCircle className="h-5 w-5 text-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Rever tutorial</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
