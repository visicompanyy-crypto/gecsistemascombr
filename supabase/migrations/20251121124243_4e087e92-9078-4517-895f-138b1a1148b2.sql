-- Criar tabela de transações financeiras
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Informações básicas
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('receita', 'despesa')),
  
  -- Data e status
  transaction_date DATE NOT NULL,
  due_date DATE,
  payment_date DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pago', 'pendente', 'atrasado', 'cancelado')),
  
  -- Categorização
  category VARCHAR(100),
  cost_center_id UUID,
  project_id UUID,
  
  -- Detalhes adicionais
  payment_method VARCHAR(50),
  bank_account VARCHAR(100),
  document_number VARCHAR(50),
  notes TEXT,
  
  -- Recorrência
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_frequency VARCHAR(20),
  recurrence_end_date DATE,
  
  -- Relacionamentos
  team_member_id UUID,
  responsible_user_id UUID,
  
  -- Anexos
  attachment_url TEXT[],
  
  -- Metadados
  tags TEXT[],
  metadata JSONB
);

-- Criar tabela de centros de custo
CREATE TABLE IF NOT EXISTS public.cost_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) UNIQUE,
  description TEXT,
  
  -- Hierarquia
  parent_id UUID REFERENCES public.cost_centers(id),
  
  -- Orçamento
  monthly_budget DECIMAL(10, 2),
  annual_budget DECIMAL(10, 2),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadados
  metadata JSONB
);

-- Criar tabela de categorias financeiras
CREATE TABLE IF NOT EXISTS public.financial_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('receita', 'despesa')),
  description TEXT,
  color VARCHAR(7),
  icon VARCHAR(50),
  
  -- Hierarquia
  parent_id UUID REFERENCES public.financial_categories(id),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE
);

-- Criar tabela de membros da equipe
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(100),
  department VARCHAR(100),
  
  -- Dados financeiros
  salary DECIMAL(10, 2),
  monthly_cost DECIMAL(10, 2),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  hire_date DATE,
  termination_date DATE,
  
  -- Metadados
  metadata JSONB
);

-- Adicionar foreign keys
ALTER TABLE public.financial_transactions 
  ADD CONSTRAINT fk_cost_center 
  FOREIGN KEY (cost_center_id) 
  REFERENCES public.cost_centers(id);

ALTER TABLE public.financial_transactions 
  ADD CONSTRAINT fk_team_member 
  FOREIGN KEY (team_member_id) 
  REFERENCES public.team_members(id);

-- Habilitar RLS
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitir acesso autenticado)
CREATE POLICY "Usuários autenticados podem ver transações"
  ON public.financial_transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir transações"
  ON public.financial_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar transações"
  ON public.financial_transactions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar transações"
  ON public.financial_transactions FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para centros de custo
CREATE POLICY "Usuários autenticados podem ver centros de custo"
  ON public.cost_centers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir centros de custo"
  ON public.cost_centers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar centros de custo"
  ON public.cost_centers FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas para categorias
CREATE POLICY "Usuários autenticados podem ver categorias"
  ON public.financial_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir categorias"
  ON public.financial_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas para membros da equipe
CREATE POLICY "Usuários autenticados podem ver membros"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir membros"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar membros"
  ON public.team_members FOR UPDATE
  TO authenticated
  USING (true);

-- Índices para performance
CREATE INDEX idx_transactions_date ON public.financial_transactions(transaction_date);
CREATE INDEX idx_transactions_type ON public.financial_transactions(transaction_type);
CREATE INDEX idx_transactions_status ON public.financial_transactions(status);
CREATE INDEX idx_transactions_cost_center ON public.financial_transactions(cost_center_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_financial_transactions_updated_at
    BEFORE UPDATE ON public.financial_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_centers_updated_at
    BEFORE UPDATE ON public.cost_centers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON public.team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();