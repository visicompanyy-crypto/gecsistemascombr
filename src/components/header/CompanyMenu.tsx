import { Building2, Settings, FolderKanban, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCompanySettings } from "@/contexts/CompanySettingsContext";

interface CompanyMenuProps {
  onOpenCompanySettings?: () => void;
  onOpenCostCenterManager?: () => void;
}

function getInitials(name: string): string {
  if (!name) return "ME";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function CompanyMenu({ onOpenCompanySettings, onOpenCostCenterManager }: CompanyMenuProps) {
  const { settings } = useCompanySettings();
  
  const companyName = settings?.company_name || "Minha Empresa";
  const initials = getInitials(companyName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 h-11 px-3 hover:bg-muted/50">
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            {settings?.logo_url ? (
              <AvatarImage src={settings.logo_url} alt={companyName} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 bg-popover border border-border shadow-lg">
        <DropdownMenuLabel className="flex items-center gap-3 py-3">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-foreground">{companyName}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onOpenCompanySettings}
          className="gap-3 py-2.5 cursor-pointer"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span>Configurações da Empresa</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onOpenCostCenterManager}
          className="gap-3 py-2.5 cursor-pointer"
        >
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
          <span>Gerenciar Centros de Custo</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
