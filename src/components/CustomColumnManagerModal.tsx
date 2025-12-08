import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useCustomColumns, CustomColumn } from "@/hooks/useCustomColumns";
import { cn } from "@/lib/utils";

interface CustomColumnManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_COLORS = [
  { name: "Verde", value: "#3c9247" },
  { name: "Azul", value: "#3b82f6" },
  { name: "Laranja", value: "#f97316" },
  { name: "Roxo", value: "#8b5cf6" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Amarelo", value: "#eab308" },
  { name: "Ciano", value: "#06b6d4" },
  { name: "Cinza", value: "#6b7280" },
];

export function CustomColumnManagerModal({
  open,
  onOpenChange,
}: CustomColumnManagerModalProps) {
  const {
    columns,
    costCenters,
    columnCostCenters,
    getCostCenterIdsForColumn,
    createColumn,
    updateColumn,
    deleteColumn,
  } = useCustomColumns();

  const [isEditing, setIsEditing] = useState(false);
  const [editingColumn, setEditingColumn] = useState<CustomColumn | null>(null);
  const [formName, setFormName] = useState("");
  const [formColor, setFormColor] = useState(AVAILABLE_COLORS[0].value);
  const [selectedCostCenters, setSelectedCostCenters] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<CustomColumn | null>(null);
  const [copyFromColumnId, setCopyFromColumnId] = useState<string>("");

  // Reset form when opening edit mode
  useEffect(() => {
    if (editingColumn) {
      setFormName(editingColumn.name);
      setFormColor(editingColumn.color);
      setSelectedCostCenters(getCostCenterIdsForColumn(editingColumn.id));
    } else {
      setFormName("");
      setFormColor(AVAILABLE_COLORS[0].value);
      setSelectedCostCenters([]);
      setCopyFromColumnId("");
    }
  }, [editingColumn, columnCostCenters]);

  // Copy cost centers when selecting a column to copy from
  const handleCopyFromColumn = (columnId: string) => {
    setCopyFromColumnId(columnId);
    if (columnId && columnId !== "none") {
      const costCenterIds = getCostCenterIdsForColumn(columnId);
      setSelectedCostCenters(costCenterIds);
    } else {
      setSelectedCostCenters([]);
    }
  };

  const handleCreateNew = () => {
    setEditingColumn(null);
    setFormName("");
    setFormColor(AVAILABLE_COLORS[0].value);
    setSelectedCostCenters([]);
    setCopyFromColumnId("");
    setIsEditing(true);
  };

  const handleEdit = (column: CustomColumn) => {
    setEditingColumn(column);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingColumn(null);
  };

  const handleSave = async () => {
    if (!formName.trim()) return;

    if (editingColumn) {
      await updateColumn.mutateAsync({
        id: editingColumn.id,
        name: formName.trim(),
        color: formColor,
        costCenterIds: selectedCostCenters,
      });
    } else {
      await createColumn.mutateAsync({
        name: formName.trim(),
        color: formColor,
        costCenterIds: selectedCostCenters,
      });
    }

    setIsEditing(false);
    setEditingColumn(null);
  };

  const handleDeleteClick = (column: CustomColumn) => {
    setColumnToDelete(column);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (columnToDelete) {
      await deleteColumn.mutateAsync(columnToDelete.id);
      setDeleteConfirmOpen(false);
      setColumnToDelete(null);
    }
  };

  const toggleCostCenter = (costCenterId: string) => {
    setSelectedCostCenters((prev) =>
      prev.includes(costCenterId)
        ? prev.filter((id) => id !== costCenterId)
        : [...prev, costCenterId]
    );
  };

  const isSaving = createColumn.isPending || updateColumn.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? editingColumn
                  ? "Editar coluna"
                  : "Nova coluna"
                : "Gerenciar colunas personalizadas"}
            </DialogTitle>
          </DialogHeader>

          {isEditing ? (
            // Edit/Create form
            <div className="flex-1 overflow-y-auto space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="column-name">Nome da coluna *</Label>
                <Input
                  id="column-name"
                  placeholder="Ex: Casa 01, Loja Centro, Matriz..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormColor(color.value)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        formColor === color.value
                          ? "border-foreground scale-110"
                          : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Copy from existing column - only when creating */}
              {!editingColumn && columns.length > 0 && (
                <div className="space-y-2">
                  <Label>Copiar centros de custo de</Label>
                  <Select
                    value={copyFromColumnId}
                    onValueChange={handleCopyFromColumn}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhum (começar do zero)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum (começar do zero)</SelectItem>
                      {columns.map((col) => {
                        const ccCount = getCostCenterIdsForColumn(col.id).length;
                        return (
                          <SelectItem key={col.id} value={col.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: col.color }}
                              />
                              <span>{col.name}</span>
                              <span className="text-muted-foreground text-xs">
                                ({ccCount} centro{ccCount !== 1 ? "s" : ""})
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Centros de custo</Label>
                <p className="text-xs text-muted-foreground">
                  Selecione quais centros de custo pertencem a esta coluna. Os
                  lançamentos desses centros aparecerão quando esta coluna
                  estiver selecionada.
                </p>

                {costCenters.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic py-4">
                    Nenhum centro de custo cadastrado.
                  </p>
                ) : (
                  <ScrollArea className="h-48 border rounded-lg p-3">
                    <div className="space-y-2">
                      {costCenters.map((cc) => (
                        <div
                          key={cc.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`cc-${cc.id}`}
                            checked={selectedCostCenters.includes(cc.id)}
                            onCheckedChange={() => toggleCostCenter(cc.id)}
                          />
                          <label
                            htmlFor={`cc-${cc.id}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {cc.name}
                            <span className="text-xs text-muted-foreground ml-2">
                              ({cc.type})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {selectedCostCenters.length === 0 && (
                  <p className="text-xs text-amber-600">
                    ⚠️ Esta coluna não tem centros de custo. Ela não exibirá
                    lançamentos até que você escolha pelo menos um.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!formName.trim() || isSaving}
                >
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Salvar coluna
                </Button>
              </div>
            </div>
          ) : (
            // Column list view
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {columns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Nenhuma coluna personalizada criada.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Use colunas para separar obras, lojas, unidades ou projetos.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {columns.map((column) => {
                    const ccCount = getCostCenterIdsForColumn(column.id).length;
                    return (
                      <div
                        key={column.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: column.color }}
                          />
                          <div>
                            <p className="font-medium">{column.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {ccCount} centro{ccCount !== 1 ? "s" : ""} de custo
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(column)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(column)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Button onClick={handleCreateNew} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Nova coluna
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir coluna?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a coluna "{columnToDelete?.name}"?
              Os lançamentos não serão apagados, apenas deixarão de ser
              agrupados nesta coluna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
