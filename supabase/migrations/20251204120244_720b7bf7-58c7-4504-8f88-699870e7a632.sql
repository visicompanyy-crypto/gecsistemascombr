-- 1. Adicionar política RLS restritiva para email_verifications
-- Como o acesso é feito via Edge Functions com service role, bloqueamos acesso direto
CREATE POLICY "Block direct public access to email verifications" 
ON public.email_verifications
FOR ALL 
USING (false);

-- 2. Remover política problemática de subscriptions (muito permissiva)
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;

-- 3. Adicionar política DELETE para company_settings
CREATE POLICY "Users can delete own company settings" 
ON public.company_settings 
FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Adicionar política DELETE para companies
CREATE POLICY "Users can delete their own companies" 
ON public.companies 
FOR DELETE 
USING (auth.uid() = created_by);

-- 5. Adicionar política DELETE para subscriptions (restritiva)
CREATE POLICY "Users can delete own subscription" 
ON public.subscriptions 
FOR DELETE 
USING (auth.uid() = user_id);