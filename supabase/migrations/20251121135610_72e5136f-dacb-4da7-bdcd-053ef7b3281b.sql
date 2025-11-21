-- Add user_id column to all tables
ALTER TABLE public.financial_transactions 
ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.cost_centers 
ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.financial_categories 
ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.team_members 
ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX idx_financial_transactions_user_id ON public.financial_transactions(user_id);
CREATE INDEX idx_cost_centers_user_id ON public.cost_centers(user_id);
CREATE INDEX idx_financial_categories_user_id ON public.financial_categories(user_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);

-- Drop old permissive RLS policies for financial_transactions
DROP POLICY IF EXISTS "Usuários autenticados podem ver transações" ON public.financial_transactions;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir transações" ON public.financial_transactions;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar transações" ON public.financial_transactions;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar transações" ON public.financial_transactions;

-- Create new user-specific RLS policies for financial_transactions
CREATE POLICY "Users can view own transactions" 
ON public.financial_transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" 
ON public.financial_transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" 
ON public.financial_transactions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" 
ON public.financial_transactions FOR DELETE 
USING (auth.uid() = user_id);

-- Drop old permissive RLS policies for cost_centers
DROP POLICY IF EXISTS "Usuários autenticados podem ver centros de custo" ON public.cost_centers;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir centros de custo" ON public.cost_centers;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar centros de custo" ON public.cost_centers;

-- Create new user-specific RLS policies for cost_centers
CREATE POLICY "Users can view own cost centers" 
ON public.cost_centers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cost centers" 
ON public.cost_centers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cost centers" 
ON public.cost_centers FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cost centers" 
ON public.cost_centers FOR DELETE 
USING (auth.uid() = user_id);

-- Drop old permissive RLS policies for financial_categories
DROP POLICY IF EXISTS "Usuários autenticados podem ver categorias" ON public.financial_categories;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir categorias" ON public.financial_categories;

-- Create new user-specific RLS policies for financial_categories
CREATE POLICY "Users can view own categories" 
ON public.financial_categories FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" 
ON public.financial_categories FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" 
ON public.financial_categories FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" 
ON public.financial_categories FOR DELETE 
USING (auth.uid() = user_id);

-- Drop old permissive RLS policies for team_members
DROP POLICY IF EXISTS "Usuários autenticados podem ver membros" ON public.team_members;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir membros" ON public.team_members;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar membros" ON public.team_members;

-- Create new user-specific RLS policies for team_members
CREATE POLICY "Users can view own team members" 
ON public.team_members FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own team members" 
ON public.team_members FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own team members" 
ON public.team_members FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own team members" 
ON public.team_members FOR DELETE 
USING (auth.uid() = user_id);