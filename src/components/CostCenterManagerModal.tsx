import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CostCenter {
  id: string;
  name: string;
  description?: string;
  type: 'receita' | 'despesa';
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
    description: '',
    type: 'despesa' as 'receita' | 'despesa',
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
        .select('id, name, description, type')
        .is('deleted_at', null)
        .eq('user_id', user.id)
        .order('type')
        .order('name');

      if (error) throw error;
      setCostCenters((data || []).map(c => ({
        ...c,
        type: (c.type as 'receita' | 'despesa') || 'despesa'
      })));
    } catch (error: any) {
      toast({
        title: "Erro ao carregar centros de custo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const checkDuplicate = (name: string, type: string, excludeId?: string) => {
    return costCenters.some(
      (c) => 
        c.name.toLowerCase().trim() === name.toLowerCase().trim() && 
        c.type === type && 
        c.id !== excludeId
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate before submitting
    const isDuplicate = checkDuplicate(formData.name, formData.type, editingId || undefined);
    if (isDuplicate) {
      const typeLabel = formData.type === 'receita' ? 'Receita' : 'Despesa';
      toast({
        title: "Centro de custo já existe",
        description: `Já existe um centro de custo "${formData.name}" do tipo ${typeLabel}. Use um nome diferente ou edite o existente.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      if (editingId) {
        const { error } = await supabase
          .from('cost_centers')
          .update({
            name: formData.name,
            description: formData.description || null,
            type: formData.type,
          })
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: "Centro de custo atualizado com sucesso" });
      } else {
        const { error } = await supabase
          .from('cost_centers')
          .insert({
            name: formData.name,
            description: formData.description || null,
            type: formData.type,
            user_id: user.id,
          });

        if (error) throw error;
        toast({ title: "Centro de custo criado com sucesso" });
      }

      setFormData({ name: '', description: '', type: 'despesa' });
      setEditingId(null);
      fetchCostCenters();
      if (onUpdate) onUpdate();
    } catch (error: any) {
      // Handle specific duplicate error from database
      if (error.message?.includes('unique constraint') || error.code === '23505') {
        const typeLabel = formData.type === 'receita' ? 'Receita' : 'Despesa';
        toast({
          title: "Centro de custo já existe",
          description: `Já existe um centro de custo "${formData.name}" do tipo ${typeLabel}. Use um nome diferente.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (center: CostCenter) => {
    setEditingId(center.id);
    setFormData({
      name: center.name,
      description: center.description || '',
      type: center.type,
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
    setFormData({ name: '', description: '', type: 'despesa' });
  };

  const revenueCenters = costCenters.filter(c => c.type === 'receita');
  const expenseCenters = costCenters.filter(c => c.type === 'despesa');

  const renderCostCenterTable = (centers: CostCenter[], title: string, icon: React.ReactNode, badgeVariant: 'default' | 'destructive') => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <Badge variant={badgeVariant === 'default' ? 'default' : 'destructive'} className="ml-auto">
          {centers.length}
        </Badge>
      </div>
      {centers.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
          Nenhum centro de custo cadastrado
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {centers.map((center) => (
              <TableRow key={center.id}>
                <TableCell className="font-medium">{center.name}</TableCell>
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
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-secondary">
            Gerenciar Centros de Custo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 border-b border-border pb-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="type" className="text-sm text-muted-foreground">
                Tipo *
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'receita' | 'despesa') => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Receita
                    </div>
                  </SelectItem>
                  <SelectItem value="despesa">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      Despesa
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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

        <div className="space-y-6 pt-2">
          {renderCostCenterTable(
            revenueCenters,
            "Centros de Receita",
            <TrendingUp className="w-5 h-5 text-green-500" />,
            'default'
          )}

          {renderCostCenterTable(
            expenseCenters,
            "Centros de Despesa",
            <TrendingDown className="w-5 h-5 text-red-500" />,
            'destructive'
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
