-- Add type column to cost_centers table
ALTER TABLE public.cost_centers 
ADD COLUMN type TEXT NOT NULL DEFAULT 'despesa' 
CHECK (type IN ('receita', 'despesa'));