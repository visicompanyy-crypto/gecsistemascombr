import { ChevronDown, Home, CreditCard, Settings } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanySettings } from "@/contexts/CompanySettingsContext";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationBell } from "./NotificationBell";
import logo from "@/assets/logo.png";

interface HeaderProps {
  currentMonth: Date;
  onOpenCompanySettings?: () => void;
}

export function Header({ currentMonth, onOpenCompanySettings }: HeaderProps) {
  const navigate = useNavigate();
  const { user, subscription, signOut } = useAuth();
  const { settings } = useCompanySettings();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    // Clear all cached data before logout (security: prevent data leakage)
    queryClient.clear();
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-background border-b border-border/20 h-[72px] sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
        {/* Company Logo/Name or Back Button */}
        <div className="flex items-center gap-3">
          {settings?.logo_url ? (
            <img 
              src={settings.logo_url} 
              alt={settings.company_name} 
              className="w-10 h-10 object-contain rounded-lg"
            />
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-primary gap-2"
            >
              <Home className="h-4 w-4" />
              Voltar para home
            </Button>
          )}
          {settings?.company_name && (
            <h1 className="text-lg font-semibold text-foreground">
              {settings.company_name}
            </h1>
          )}
        </div>

        {/* System Logo - Center */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-11 h-11" />
          <span className="text-xl font-semibold text-foreground">Finance</span>
        </div>

        {/* Dropdowns e Actions */}
        <div className="flex items-center gap-4">
          {/* Dropdown Empresa */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 text-sm font-medium">
                Minha Empresa
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Empresas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Minha Empresa</DropdownMenuItem>
              <DropdownMenuItem>Empresa 2</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Adicionar empresa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notificações */}
          <NotificationBell />

          {/* Avatar e Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 border-2 border-border">
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    US
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user?.email?.split('@')[0] || 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  {subscription?.subscribed && (
                    <div className="flex items-center gap-1 mt-1">
                      <CreditCard className="h-3 w-3 text-green-500" />
                      <span className="text-xs font-medium text-green-500">
                        Assinante
                      </span>
                    </div>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/pricing")}>
                {subscription?.subscribed ? "Gerenciar assinatura" : "Ver planos"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOpenCompanySettings}>
                <Settings className="h-4 w-4 mr-2" />
                Configurações da Empresa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
