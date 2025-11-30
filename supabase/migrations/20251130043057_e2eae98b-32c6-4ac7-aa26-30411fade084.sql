-- Drop the existing unique constraint
DROP INDEX IF EXISTS cost_centers_user_name_unique;

-- Create new unique constraint including type
CREATE UNIQUE INDEX cost_centers_user_name_type_unique ON public.cost_centers (user_id, name, type) WHERE deleted_at IS NULL;