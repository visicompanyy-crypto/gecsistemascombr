-- =====================================================
-- EXPANSÃO DO MÓDULO FINANCEIRO
-- Adiciona novas tabelas e colunas ao sistema
-- =====================================================

-- =====================================================
-- 1. ADICIONAR NOVAS COLUNAS EM financial_transactions
-- =====================================================

-- Classificação de transação
ALTER TABLE financial_transactions 
ADD COLUMN IF NOT EXISTS transaction_classification TEXT 
CHECK (transaction_classification IN ('fixa', 'variavel', 'recorrencia'));

-- Campos de parcelamento
ALTER TABLE financial_transactions 
ADD COLUMN IF NOT EXISTS is_installment BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS installment_number INTEGER,
ADD COLUMN IF NOT EXISTS total_installments INTEGER,
ADD COLUMN IF NOT EXISTS parent_transaction_id UUID REFERENCES financial_transactions(id),
ADD COLUMN IF NOT EXISTS purchase_date DATE,
ADD COLUMN IF NOT EXISTS first_installment_date DATE;

-- Campos PIX
ALTER TABLE financial_transactions 
ADD COLUMN IF NOT EXISTS pix_recipient_name TEXT,
ADD COLUMN IF NOT EXISTS pix_key TEXT;

-- Índice para busca por beneficiário PIX
CREATE INDEX IF NOT EXISTS idx_financial_transactions_pix_recipient 
ON financial_transactions(pix_recipient_name) 
WHERE pix_recipient_name IS NOT NULL AND deleted_at IS NULL;

-- =====================================================
-- 2. CRIAR TABELA tools_software
-- =====================================================

CREATE TABLE IF NOT EXISTS tools_software (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  provider TEXT,
  license_type TEXT,
  cost_per_license NUMERIC(10,2),
  billing_frequency TEXT CHECK (billing_frequency IN ('mensal', 'trimestral', 'semestral', 'anual', 'unico')),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- RLS para tools_software
ALTER TABLE tools_software ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tools" ON tools_software;
CREATE POLICY "Users can view own tools" 
ON tools_software FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own tools" ON tools_software;
CREATE POLICY "Users can insert own tools" 
ON tools_software FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tools" ON tools_software;
CREATE POLICY "Users can update own tools" 
ON tools_software FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own tools" ON tools_software;
CREATE POLICY "Users can delete own tools" 
ON tools_software FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- 3. CRIAR TABELA team_tool_expenses
-- =====================================================

CREATE TABLE IF NOT EXISTS team_tool_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  expense_date DATE NOT NULL,
  expense_type TEXT NOT NULL CHECK (expense_type IN ('equipe', 'ferramenta')),
  entity_name TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pago', 'pendente', 'previsto')),
  payment_method TEXT CHECK (payment_method IN ('dinheiro', 'pix', 'credito', 'debito', 'boleto', 'transferencia')),
  cost_center_id UUID REFERENCES cost_centers(id),
  team_member_id UUID REFERENCES team_members(id),
  tool_id UUID REFERENCES tools_software(id),
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- RLS para team_tool_expenses
ALTER TABLE team_tool_expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own expenses" ON team_tool_expenses;
CREATE POLICY "Users can view own expenses" 
ON team_tool_expenses FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own expenses" ON team_tool_expenses;
CREATE POLICY "Users can insert own expenses" 
ON team_tool_expenses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own expenses" ON team_tool_expenses;
CREATE POLICY "Users can update own expenses" 
ON team_tool_expenses FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own expenses" ON team_tool_expenses;
CREATE POLICY "Users can delete own expenses" 
ON team_tool_expenses FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- 4. CRIAR FUNÇÃO ESPECÍFICA PARA TRIGGERS FINANCEIROS
-- =====================================================

CREATE OR REPLACE FUNCTION update_financial_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. CRIAR TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Trigger para tools_software
DROP TRIGGER IF EXISTS update_tools_software_updated_at ON tools_software;
CREATE TRIGGER update_tools_software_updated_at
BEFORE UPDATE ON tools_software
FOR EACH ROW
EXECUTE FUNCTION update_financial_updated_at();

-- Trigger para team_tool_expenses
DROP TRIGGER IF EXISTS update_team_tool_expenses_updated_at ON team_tool_expenses;
CREATE TRIGGER update_team_tool_expenses_updated_at
BEFORE UPDATE ON team_tool_expenses
FOR EACH ROW
EXECUTE FUNCTION update_financial_updated_at();