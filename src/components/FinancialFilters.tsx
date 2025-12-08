import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CostCenter {
  id: string;
  name: string;
  type: string;
}

interface FinancialFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  paymentMethodFilter: string;
  onPaymentMethodFilterChange: (value: string) => void;
  costCenterFilter: string;
  onCostCenterFilterChange: (value: string) => void;
  onClearFilters: () => void;
  costCenters?: CostCenter[];
}

export function FinancialFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  paymentMethodFilter,
  onPaymentMethodFilterChange,
  costCenterFilter,
  onCostCenterFilterChange,
  onClearFilters,
  costCenters = [],
}: FinancialFiltersProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-3 block text-secondary">Buscar por nome</label>
        <Input
          placeholder="Digite o nome do lançamento..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md shadow-sm"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium mb-3 block text-secondary">Tipo</label>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="bg-primary text-primary-foreground shadow-sm">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block text-secondary">Forma de pagamento</label>
          <Select value={paymentMethodFilter} onValueChange={onPaymentMethodFilterChange}>
            <SelectTrigger className="bg-primary text-primary-foreground shadow-sm">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Pix">Pix</SelectItem>
              <SelectItem value="Boleto">Boleto</SelectItem>
              <SelectItem value="Cartão">Cartão</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block text-secondary">Centro de custo</label>
          <Select value={costCenterFilter} onValueChange={onCostCenterFilterChange}>
            <SelectTrigger className="bg-primary text-primary-foreground shadow-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {costCenters.map((cc) => (
                <SelectItem key={cc.id} value={cc.id}>
                  {cc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="default" size="sm" onClick={onClearFilters} className="gap-2 shadow-sm">
          <X className="h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
