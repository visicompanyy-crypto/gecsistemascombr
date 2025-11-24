-- Remove a constraint única global do código
ALTER TABLE public.cost_centers DROP CONSTRAINT IF EXISTS cost_centers_code_key;

-- Adiciona constraint única composta por user_id e code
-- Isso permite que usuários diferentes usem o mesmo código
ALTER TABLE public.cost_centers 
ADD CONSTRAINT cost_centers_user_code_unique 
UNIQUE NULLS NOT DISTINCT (user_id, code);