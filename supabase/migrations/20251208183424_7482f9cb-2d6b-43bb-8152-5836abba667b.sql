-- Add custom_column_id to cost_centers table
ALTER TABLE cost_centers ADD COLUMN custom_column_id uuid REFERENCES custom_columns(id) ON DELETE SET NULL;

-- Add custom_column_id to financial_transactions table
ALTER TABLE financial_transactions ADD COLUMN custom_column_id uuid REFERENCES custom_columns(id) ON DELETE SET NULL;

-- Add is_main column to custom_columns table
ALTER TABLE custom_columns ADD COLUMN is_main boolean DEFAULT false;

-- Create index for better performance
CREATE INDEX idx_cost_centers_custom_column_id ON cost_centers(custom_column_id);
CREATE INDEX idx_financial_transactions_custom_column_id ON financial_transactions(custom_column_id);

-- Create function to create main column for a user
CREATE OR REPLACE FUNCTION create_main_column_for_user(p_user_id uuid, p_company_id uuid DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_column_id uuid;
BEGIN
  -- Check if user already has a main column
  SELECT id INTO v_column_id FROM custom_columns 
  WHERE user_id = p_user_id AND is_main = true;
  
  IF v_column_id IS NOT NULL THEN
    RETURN v_column_id;
  END IF;
  
  -- Create main column
  INSERT INTO custom_columns (user_id, company_id, name, color, is_main, order_index)
  VALUES (p_user_id, p_company_id, 'Principal', '#3c9247', true, 0)
  RETURNING id INTO v_column_id;
  
  RETURN v_column_id;
END;
$$;

-- Migrate existing data: Create main columns for all existing users and assign their data
DO $$
DECLARE
  r RECORD;
  v_main_column_id uuid;
BEGIN
  -- For each unique user that has cost_centers or financial_transactions
  FOR r IN 
    SELECT DISTINCT user_id, company_id 
    FROM (
      SELECT user_id, company_id FROM cost_centers WHERE deleted_at IS NULL
      UNION
      SELECT user_id, company_id FROM financial_transactions WHERE deleted_at IS NULL
    ) AS users
  LOOP
    -- Create main column for this user
    v_main_column_id := create_main_column_for_user(r.user_id, r.company_id);
    
    -- Assign all existing cost centers to the main column
    UPDATE cost_centers 
    SET custom_column_id = v_main_column_id 
    WHERE user_id = r.user_id AND custom_column_id IS NULL;
    
    -- Assign all existing transactions to the main column
    UPDATE financial_transactions 
    SET custom_column_id = v_main_column_id 
    WHERE user_id = r.user_id AND custom_column_id IS NULL;
  END LOOP;
END;
$$;

-- Also create main columns for users who have custom_columns but no data yet
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN 
    SELECT DISTINCT user_id, company_id 
    FROM custom_columns 
    WHERE is_main IS NOT TRUE
  LOOP
    PERFORM create_main_column_for_user(r.user_id, r.company_id);
  END LOOP;
END;
$$;