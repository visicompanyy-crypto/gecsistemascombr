-- Create companies table for future multi-tenant support
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT 'green',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can view companies they created"
ON public.companies
FOR SELECT
USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own companies"
ON public.companies
FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own companies"
ON public.companies
FOR UPDATE
USING (auth.uid() = created_by);

-- Add company_id to company_settings for user-company association
ALTER TABLE public.company_settings
ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- Add company_id to cost_centers for future filtering
ALTER TABLE public.cost_centers
ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- Add company_id to financial_transactions for future filtering
ALTER TABLE public.financial_transactions
ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- Add company_id to financial_categories for future filtering
ALTER TABLE public.financial_categories
ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- Add company_id to team_members for future filtering
ALTER TABLE public.team_members
ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- Add company_id to tools_software for future filtering
ALTER TABLE public.tools_software
ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- Add company_id to team_tool_expenses for future filtering
ALTER TABLE public.team_tool_expenses
ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- Create trigger for updated_at on companies
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_company_settings_company_id ON public.company_settings(company_id);
CREATE INDEX idx_cost_centers_company_id ON public.cost_centers(company_id);
CREATE INDEX idx_financial_transactions_company_id ON public.financial_transactions(company_id);
CREATE INDEX idx_financial_categories_company_id ON public.financial_categories(company_id);
CREATE INDEX idx_team_members_company_id ON public.team_members(company_id);
CREATE INDEX idx_tools_software_company_id ON public.tools_software(company_id);
CREATE INDEX idx_team_tool_expenses_company_id ON public.team_tool_expenses(company_id);