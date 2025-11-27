-- Remove the unique constraint on code field that prevents null/empty values
ALTER TABLE public.cost_centers DROP CONSTRAINT IF EXISTS cost_centers_user_code_unique;