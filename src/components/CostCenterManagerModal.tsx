import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CostCenter {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

interface CostCenterManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function CostCenterManagerModal({
  open,
  onOpenChange,
  onUpdate,
}: CostCenterManagerModalProps) {
  const { toast } = useToast();
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });

  useEffect(() => {
    if (open) {
      fetchCostCenters();
    }
  }, [open]);

  const fetchCostCenters = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('cost_centers')
        .select('*')
        .is('deleted_at', null)
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setCostCenters(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar centros de custo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      if (editingId) {
        const { error } = await supabase
          .from('cost_centers')
          .update({
            name: formData.name,
            code: formData.code || null,
            description: formData.description || null,
          })
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: "Centro de custo atualizado com sucesso" });
      } else {
        const { error } = await supabase
          .from('cost_centers')
          .insert({
            name: formData.name,
            code: formData.code || null,
            description: formData.description || null,
            user_id: user.id,
          });

        if (error) throw error;
        toast({ title: "Centro de custo criado com sucesso" });
      }

      setFormData({ name: '', code: '', description: '' });
      setEditingId(null);
      fetchCostCenters();
      if (onUpdate) onUpdate();
    } catch (error: any) {
      let errorMessage = error.message;
      
      // Verifica se é erro de código duplicado
      if (error.message?.includes('cost_centers_user_code_unique')) {
        errorMessage = 'Já existe um centro de custo com este código. Por favor, use um código diferente.';
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (center: CostCenter) => {
    setEditingId(center.id);
    setFormData({
      name: center.name,
      code: center.code || '',
      description: center.description || '',
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cost_centers')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Centro de custo removido com sucesso" });
      fetchCostCenters();
      if (onUpdate) onUpdate();
    } catch (error: any) {
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', code: '', description: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-secondary">
            Gerenciar Centros de Custo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 border-b border-border pb-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-muted-foreground">
                Nome *
              </Label>
              <Input
                id="name"
                placeholder="Ex: Marketing Digital"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm text-muted-foreground">
                Código
              </Label>
              <Input
                id="code"
                placeholder="Ex: MKT-001"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="border-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-muted-foreground">
              Descrição
            </Label>
            <Input
              id="description"
              placeholder="Descrição do centro de custo"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border-input"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Adicionar'}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Centros de Custo Existentes
          </h3>
          {costCenters.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum centro de custo cadastrado
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costCenters.map((center) => (
                  <TableRow key={center.id}>
                    <TableCell className="font-medium">{center.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {center.code || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(center)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(center.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
