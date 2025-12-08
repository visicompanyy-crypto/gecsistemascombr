import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CustomColumn {
  id: string;
  user_id: string;
  company_id: string | null;
  name: string;
  color: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CustomColumnCostCenter {
  id: string;
  custom_column_id: string;
  cost_center_id: string;
  created_at: string;
}

export interface CostCenter {
  id: string;
  name: string;
  type: string;
}

export function useCustomColumns() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all custom columns
  const { data: columns, isLoading: columnsLoading } = useQuery({
    queryKey: ['custom-columns', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_columns')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as CustomColumn[];
    },
    enabled: !!user?.id,
  });

  // Fetch column-cost center relationships
  const { data: columnCostCenters, isLoading: relationshipsLoading } = useQuery({
    queryKey: ['custom-column-cost-centers', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_column_cost_centers')
        .select('*');

      if (error) throw error;
      return data as CustomColumnCostCenter[];
    },
    enabled: !!user?.id,
  });

  // Fetch all cost centers for selection
  const { data: costCenters } = useQuery({
    queryKey: ['cost-centers-for-columns', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cost_centers')
        .select('id, name, type')
        .is('deleted_at', null)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as CostCenter[];
    },
    enabled: !!user?.id,
  });

  // Get cost center IDs for a specific column
  const getCostCenterIdsForColumn = (columnId: string | null): string[] => {
    if (!columnId || !columnCostCenters) return [];
    return columnCostCenters
      .filter(rel => rel.custom_column_id === columnId)
      .map(rel => rel.cost_center_id);
  };

  // Create a new column
  const createColumn = useMutation({
    mutationFn: async ({ 
      name, 
      color, 
      costCenterIds 
    }: { 
      name: string; 
      color: string; 
      costCenterIds: string[] 
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get next order index
      const maxOrder = columns?.reduce((max, col) => Math.max(max, col.order_index), -1) ?? -1;

      // Create column
      const { data: newColumn, error: columnError } = await supabase
        .from('custom_columns')
        .insert({
          user_id: user.id,
          name,
          color,
          order_index: maxOrder + 1,
        })
        .select()
        .single();

      if (columnError) throw columnError;

      // Create cost center relationships
      if (costCenterIds.length > 0) {
        const relationships = costCenterIds.map(costCenterId => ({
          custom_column_id: newColumn.id,
          cost_center_id: costCenterId,
        }));

        const { error: relError } = await supabase
          .from('custom_column_cost_centers')
          .insert(relationships);

        if (relError) throw relError;
      }

      return newColumn;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-columns'] });
      queryClient.invalidateQueries({ queryKey: ['custom-column-cost-centers'] });
      toast({
        title: 'Coluna criada',
        description: 'A coluna personalizada foi criada com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar coluna',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update a column
  const updateColumn = useMutation({
    mutationFn: async ({ 
      id, 
      name, 
      color, 
      costCenterIds 
    }: { 
      id: string; 
      name: string; 
      color: string; 
      costCenterIds: string[] 
    }) => {
      // Update column
      const { error: columnError } = await supabase
        .from('custom_columns')
        .update({ name, color, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (columnError) throw columnError;

      // Delete existing relationships
      const { error: deleteError } = await supabase
        .from('custom_column_cost_centers')
        .delete()
        .eq('custom_column_id', id);

      if (deleteError) throw deleteError;

      // Create new relationships
      if (costCenterIds.length > 0) {
        const relationships = costCenterIds.map(costCenterId => ({
          custom_column_id: id,
          cost_center_id: costCenterId,
        }));

        const { error: relError } = await supabase
          .from('custom_column_cost_centers')
          .insert(relationships);

        if (relError) throw relError;
      }

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-columns'] });
      queryClient.invalidateQueries({ queryKey: ['custom-column-cost-centers'] });
      toast({
        title: 'Coluna atualizada',
        description: 'A coluna personalizada foi atualizada com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar coluna',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete a column
  const deleteColumn = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_columns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-columns'] });
      queryClient.invalidateQueries({ queryKey: ['custom-column-cost-centers'] });
      toast({
        title: 'Coluna excluída',
        description: 'A coluna personalizada foi excluída. Os lançamentos não foram afetados.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir coluna',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    columns: columns || [],
    columnCostCenters: columnCostCenters || [],
    costCenters: costCenters || [],
    isLoading: columnsLoading || relationshipsLoading,
    getCostCenterIdsForColumn,
    createColumn,
    updateColumn,
    deleteColumn,
  };
}
