-- Habilitar RLS para segurança (service role bypassa automaticamente)
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;