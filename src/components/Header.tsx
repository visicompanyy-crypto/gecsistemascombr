import { CompanyMenu } from "./header/CompanyMenu";
import { QuickAddMenu } from "./header/QuickAddMenu";
import { UserMenu } from "./header/UserMenu";
import { NotificationBell } from "./NotificationBell";

interface HeaderProps {
  currentMonth: Date;
  onOpenCompanySettings?: () => void;
  onOpenCostCenterManager?: () => void;
  onNewTransaction?: () => void;
  onAddClient?: () => void;
  onAddCostCenter?: () => void;
}

export function Header({ 
  currentMonth, 
  onOpenCompanySettings,
  onOpenCostCenterManager,
  onNewTransaction,
  onAddClient,
  onAddCostCenter,
}: HeaderProps) {
  return (
    <header className="bg-background border-b border-border/20 h-[72px] sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
        {/* Esquerda - Menu da Empresa */}
        <CompanyMenu 
          onOpenCompanySettings={onOpenCompanySettings}
          onOpenCostCenterManager={onOpenCostCenterManager}
        />

        {/* Centro - Botão Adicionar */}
        <QuickAddMenu 
          onNewTransaction={onNewTransaction}
          onAddClient={onAddClient}
          onAddCostCenter={onAddCostCenter}
        />

        {/* Direita - Notificações + Usuário */}
        <div className="flex items-center gap-3">
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
