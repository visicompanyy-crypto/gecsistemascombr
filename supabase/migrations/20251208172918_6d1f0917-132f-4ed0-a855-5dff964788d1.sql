-- Create custom_columns table
CREATE TABLE public.custom_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_id UUID REFERENCES companies(id),
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20) DEFAULT '#3c9247',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create custom_column_cost_centers junction table
CREATE TABLE public.custom_column_cost_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_column_id UUID NOT NULL REFERENCES custom_columns(id) ON DELETE CASCADE,
  cost_center_id UUID NOT NULL REFERENCES cost_centers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(custom_column_id, cost_center_id)
);

-- Enable RLS
ALTER TABLE public.custom_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_column_cost_centers ENABLE ROW LEVEL SECURITY;

-- RLS policies for custom_columns
CREATE POLICY "Users can view own custom columns" 
ON public.custom_columns FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own custom columns" 
ON public.custom_columns FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom columns" 
ON public.custom_columns FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom columns" 
ON public.custom_columns FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for custom_column_cost_centers (via custom_columns ownership)
CREATE POLICY "Users can view own column cost centers" 
ON public.custom_column_cost_centers FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM custom_columns 
    WHERE custom_columns.id = custom_column_cost_centers.custom_column_id 
    AND custom_columns.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own column cost centers" 
ON public.custom_column_cost_centers FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM custom_columns 
    WHERE custom_columns.id = custom_column_cost_centers.custom_column_id 
    AND custom_columns.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own column cost centers" 
ON public.custom_column_cost_centers FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM custom_columns 
    WHERE custom_columns.id = custom_column_cost_centers.custom_column_id 
    AND custom_columns.user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_custom_columns_updated_at
BEFORE UPDATE ON public.custom_columns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();