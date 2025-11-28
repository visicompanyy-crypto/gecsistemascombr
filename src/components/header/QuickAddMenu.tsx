import { Plus, DollarSign, UserPlus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuickAddMenuProps {
  onNewTransaction?: () => void;
  onAddClient?: () => void;
  onAddCostCenter?: () => void;
}

export function QuickAddMenu({ onNewTransaction, onAddClient, onAddCostCenter }: QuickAddMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="gap-2 h-10 px-4 bg-muted/50 hover:bg-muted rounded-lg font-medium text-foreground"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56 bg-popover border border-border shadow-lg">
        <DropdownMenuItem 
          onClick={onNewTransaction}
          className="gap-3 py-3 cursor-pointer"
        >
          <DollarSign className="h-4 w-4 text-primary" />
          <span className="font-medium">Novo lançamento</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onAddClient}
          className="gap-3 py-3 cursor-pointer"
        >
          <UserPlus className="h-4 w-4 text-primary" />
          <span className="font-medium">Adicionar cliente</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onAddCostCenter}
          className="gap-3 py-3 cursor-pointer"
        >
          <FolderPlus className="h-4 w-4 text-primary" />
          <span className="font-medium">Adicionar centro de custo</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
