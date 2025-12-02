-- Tabela para armazenar códigos de verificação de email
CREATE TABLE public.email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '10 minutes'),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para buscas rápidas por email
CREATE INDEX idx_email_verifications_email ON public.email_verifications(email);

-- Não habilitamos RLS pois o acesso será apenas via service role nas edge functions