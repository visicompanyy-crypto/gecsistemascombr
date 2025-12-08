import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { useCustomColumns } from "@/hooks/useCustomColumns";
import { cn } from "@/lib/utils";

interface CustomColumnBarProps {
  selectedColumnId: string | null;
  onSelectColumn: (columnId: string | null) => void;
  onManageColumns: () => void;
}

export function CustomColumnBar({
  selectedColumnId,
  onSelectColumn,
  onManageColumns,
}: CustomColumnBarProps) {
  const { columns, isLoading } = useCustomColumns();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Colunas personalizadas</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onManageColumns}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Settings2 className="h-4 w-4" />
          Gerenciar
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {/* "Todas" chip - always first */}
        <button
          onClick={() => onSelectColumn(null)}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
            "border shadow-sm whitespace-nowrap",
            selectedColumnId === null
              ? "bg-primary text-primary-foreground border-primary shadow-md"
              : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
          )}
        >
          Todas
        </button>

        {/* Custom column chips */}
        {isLoading ? (
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-9 w-24 bg-muted animate-pulse rounded-full"
              />
            ))}
          </div>
        ) : columns.length === 0 ? (
          <span className="text-sm text-muted-foreground italic">
            Use colunas para separar obras, lojas, unidades ou projetos.
          </span>
        ) : (
          columns.map((column) => (
            <button
              key={column.id}
              onClick={() => onSelectColumn(column.id)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
                "border shadow-sm whitespace-nowrap flex items-center gap-2",
                selectedColumnId === column.id
                  ? "border-transparent shadow-md"
                  : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              )}
              style={{
                backgroundColor: selectedColumnId === column.id ? column.color : undefined,
                color: selectedColumnId === column.id ? '#fff' : undefined,
                borderColor: selectedColumnId === column.id ? column.color : undefined,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: column.color }}
              />
              {column.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
