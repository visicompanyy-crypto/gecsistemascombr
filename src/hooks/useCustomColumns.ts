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

  // Ensure main column exists for the user
  const ensureMainColumn = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Check if main column already exists
      const existingMain = columns?.find(col => col.is_main);
      if (existingMain) return existingMain;

      // Create main column using the database function
      const { data, error } = await supabase.rpc('create_main_column_for_user', {
        p_user_id: user.id,
        p_company_id: null
      });

      if (error) throw error;

      // Fetch the created column
      const { data: newColumn, error: fetchError } = await supabase
        .from('custom_columns')
        .select('*')
        .eq('id', data)
        .single();

      if (fetchError) throw fetchError;
      return newColumn as CustomColumn;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-columns'] });
      queryClient.invalidateQueries({ queryKey: ['cost-centers-for-columns'] });
    },
  });

  // Create a new column with option to copy cost centers from another column
  const createColumn = useMutation({
    mutationFn: async ({ 
      name, 
      color, 
      copyFromColumnId 
    }: { 
      name: string; 
      color: string; 
      copyFromColumnId?: string | null;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get next order index
      const maxOrder = columns?.reduce((max, col) => Math.max(max, col.order_index), -1) ?? -1;

      // Create the new column
      const { data: newColumn, error: columnError } = await supabase
        .from('custom_columns')
        .insert({
          user_id: user.id,
          name,
          color,
          order_index: maxOrder + 1,
          is_main: false,
        })
        .select()
        .single();

      if (columnError) throw columnError;

      // If copying from another column, create new cost centers with same names + column suffix
      if (copyFromColumnId) {
        const sourceCostCenters = getCostCentersForColumn(copyFromColumnId);
        
        if (sourceCostCenters.length > 0) {
          // Add column name as suffix to avoid unique constraint violation
          const newCostCenters = sourceCostCenters.map(cc => ({
            user_id: user.id,
            name: `${cc.name} (${name})`,
            type: cc.type,
            custom_column_id: newColumn.id,
          }));

          const { error: ccError } = await supabase
            .from('cost_centers')
            .insert(newCostCenters);

          if (ccError) throw ccError;
        }
      }

      return newColumn;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-columns'] });
      queryClient.invalidateQueries({ queryKey: ['cost-centers-for-columns'] });
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

  // Delete a column (not allowed for main column)
  const deleteColumn = useMutation({
    mutationFn: async (id: string) => {
      // Check if it's the main column
      const column = columns?.find(c => c.id === id);
      if (column?.is_main) {
        throw new Error('Não é possível excluir a coluna principal');
      }

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
    ensureMainColumn,
    createColumn,
    updateColumn,
    deleteColumn,
    refetchColumns,
    refetchCostCenters,
  };
}
