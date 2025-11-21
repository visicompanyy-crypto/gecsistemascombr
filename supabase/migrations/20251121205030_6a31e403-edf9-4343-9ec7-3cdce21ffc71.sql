-- =====================================================
-- CORREÇÃO DE SEGURANÇA
-- Adiciona search_path à função de trigger
-- =====================================================

CREATE OR REPLACE FUNCTION update_financial_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;