-- Habilitar realtime para financial_transactions
ALTER TABLE financial_transactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE financial_transactions;