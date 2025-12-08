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
import { Plus, Pencil, Trash2, Loader2, Crown } from "lucide-react";
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
    getCostCentersForColumn,
    createColumn,
    updateColumn,
    deleteColumn,
  } = useCustomColumns();

  const [isEditing, setIsEditing] = useState(false);
  const [editingColumn, setEditingColumn] = useState<CustomColumn | null>(null);
  const [formName, setFormName] = useState("");
  const [formColor, setFormColor] = useState(AVAILABLE_COLORS[0].value);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<CustomColumn | null>(null);
  const [copyFromColumnId, setCopyFromColumnId] = useState<string>("");

  // Reset form when opening edit mode
  useEffect(() => {
    if (editingColumn) {
      setFormName(editingColumn.name);
      setFormColor(editingColumn.color);
    } else {
      setFormName("");
      setFormColor(AVAILABLE_COLORS[0].value);
      setCopyFromColumnId("");
    }
  }, [editingColumn]);

  const handleCreateNew = () => {
    setEditingColumn(null);
    setFormName("");
    setFormColor(AVAILABLE_COLORS[0].value);
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
      });
    } else {
      await createColumn.mutateAsync({
        name: formName.trim(),
        color: formColor,
        copyFromColumnId: copyFromColumnId && copyFromColumnId !== "none" ? copyFromColumnId : null,
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
                : "Gerenciar colunas"}
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
                  <p className="text-xs text-muted-foreground">
                    Cria novos centros de custo com os mesmos nomes da coluna selecionada.
                  </p>
                  <Select
                    value={copyFromColumnId}
                    onValueChange={setCopyFromColumnId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhum (começar do zero)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum (começar do zero)</SelectItem>
                      {columns.map((col) => {
                        const ccCount = getCostCentersForColumn(col.id).length;
                        return (
                          <SelectItem key={col.id} value={col.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: col.color }}
                              />
                              <span>{col.name}</span>
                              {col.is_main && <Crown className="h-3 w-3 text-amber-500" />}
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
                    Nenhuma coluna cadastrada.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {columns.map((column) => {
                    const ccCount = getCostCentersForColumn(column.id).length;
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
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{column.name}</p>
                              {column.is_main && (
                                <Crown className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
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
                          {!column.is_main && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(column)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
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
              <br /><br />
              <strong className="text-destructive">Atenção:</strong> Todos os centros de custo e lançamentos desta coluna também serão removidos.
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
