import { CompanyMenu } from "./header/CompanyMenu";
import { UserMenu } from "./header/UserMenu";
import { NotificationBell } from "./NotificationBell";
import logo from "@/assets/logo.png";

interface HeaderProps {
  currentMonth: Date;
  onOpenCompanySettings?: () => void;
  onOpenCostCenterManager?: () => void;
  onNewTransaction?: () => void;
  onAddClient?: () => void;
}

export function Header({ 
  currentMonth, 
  onOpenCompanySettings,
  onOpenCostCenterManager,
  onNewTransaction,
  onAddClient,
}: HeaderProps) {
  return (
    <header className="bg-background border-b border-border/20 h-[72px] sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
        {/* Esquerda - Menu da Empresa */}
        <CompanyMenu 
          onOpenCompanySettings={onOpenCompanySettings}
          onOpenCostCenterManager={onOpenCostCenterManager}
          onNewTransaction={onNewTransaction}
          onAddClient={onAddClient}
        />

        {/* Centro - Logo Saldar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
          <img src={logo} alt="Saldar" className="w-11 h-11" />
          <span className="text-xl font-semibold text-foreground">Saldar</span>
        </div>

        {/* Direita - Notificações + Usuário */}
        <div className="flex items-center gap-3">
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
