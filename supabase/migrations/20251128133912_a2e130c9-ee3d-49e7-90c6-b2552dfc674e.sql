-- Drop the global unique constraint on cost_centers name
ALTER TABLE public.cost_centers DROP CONSTRAINT IF EXISTS cost_centers_name_key;

-- Create a new unique constraint that is scoped to user_id
-- This allows different users to have cost centers with the same name
CREATE UNIQUE INDEX IF NOT EXISTS cost_centers_user_name_unique ON public.cost_centers (user_id, name) WHERE deleted_at IS NULL;