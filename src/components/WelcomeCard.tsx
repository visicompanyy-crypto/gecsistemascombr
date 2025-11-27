import { useCompanySettings } from "@/contexts/CompanySettingsContext";
import { Card } from "@/components/ui/card";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function WelcomeCard() {
  const { settings } = useCompanySettings();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show welcome card only after onboarding is completed and not dismissed
    const wasDismissed = localStorage.getItem("welcome_card_dismissed");
    if (settings?.onboarding_completed && !wasDismissed) {
      setVisible(true);
    }
  }, [settings]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    localStorage.setItem("welcome_card_dismissed", "true");
  };

  if (!visible || dismissed || !settings) return null;

  return (
    <Card className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 p-6 mb-6 overflow-hidden animate-fade-in">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="relative flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Bem-vindo, {settings.company_name}!
          </h3>
          <p className="text-sm text-muted-foreground">
            Seu sistema está personalizado e pronto para uso.
          </p>
        </div>
      </div>
    </Card>
  );
}
