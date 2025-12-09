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
  is_main: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostCenter {
  id: string;
  name: string;
  type: string;
  custom_column_id: string | null;
}

export function useCustomColumns() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all custom columns (ordered by order_index, main column first)
  const { data: columns, isLoading: columnsLoading, refetch: refetchColumns } = useQuery({
    queryKey: ['custom-columns', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_columns')
        .select('*')
        .order('is_main', { ascending: false })
        .order('order_index', { ascending: true });

      if (error) throw error;
      return (data || []) as CustomColumn[];
    },
    enabled: !!user?.id,
  });

  // Fetch all cost centers (now with custom_column_id)
  const { data: costCenters, refetch: refetchCostCenters } = useQuery({
    queryKey: ['cost-centers-for-columns', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cost_centers')
        .select('id, name, type, custom_column_id')
        .is('deleted_at', null)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return (data || []) as CostCenter[];
    },
    enabled: !!user?.id,
  });

  // Get the main column
  const mainColumn = columns?.find(col => col.is_main) || null;

  // Get cost centers for a specific column
  const getCostCentersForColumn = (columnId: string | null): CostCenter[] => {
    if (!columnId || !costCenters) return [];
    return costCenters.filter(cc => cc.custom_column_id === columnId);
  };

  // Get cost center IDs for a specific column
  const getCostCenterIdsForColumn = (columnId: string | null): string[] => {
    return getCostCentersForColumn(columnId).map(cc => cc.id);
  };

  // Ensure default columns exist for the user (Principal and Secundária)
  const ensureDefaultColumns = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Check if columns already exist
      if (columns && columns.length >= 2) return;

      // Create default columns using the database function
      const { error } = await supabase.rpc('create_default_columns_for_user', {
        p_user_id: user.id,
        p_company_id: null
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-columns'] });
      queryClient.invalidateQueries({ queryKey: ['cost-centers-for-columns'] });
    },
  });

  // Update a column
  const updateColumn = useMutation({
    mutationFn: async ({ 
      id, 
      name, 
      color, 
    }: { 
      id: string; 
      name: string; 
      color: string; 
    }) => {
      const { error: columnError } = await supabase
        .from('custom_columns')
        .update({ name, color, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (columnError) throw columnError;

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-columns'] });
      toast({
        title: 'Coluna atualizada',
        description: 'A coluna foi atualizada com sucesso.',
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

  // Delete a column (any column can be deleted now)
  const deleteColumn = useMutation({
    mutationFn: async (id: string) => {
      // Delete all cost centers associated with this column
      const { error: ccError } = await supabase
        .from('cost_centers')
        .update({ deleted_at: new Date().toISOString() })
        .eq('custom_column_id', id);

      if (ccError) throw ccError;

      // Delete the column
      const { error } = await supabase
        .from('custom_columns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-columns'] });
      queryClient.invalidateQueries({ queryKey: ['cost-centers-for-columns'] });
      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
      toast({
        title: 'Coluna excluída',
        description: 'A coluna e seus centros de custo foram excluídos.',
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
    costCenters: costCenters || [],
    mainColumn,
    isLoading: columnsLoading,
    getCostCentersForColumn,
    getCostCenterIdsForColumn,
    ensureDefaultColumns,
    updateColumn,
    deleteColumn,
    refetchColumns,
    refetchCostCenters,
  };
}
