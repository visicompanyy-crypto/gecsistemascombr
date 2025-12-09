-- Create or replace function to create default columns (Principal and Secundária) for a user
CREATE OR REPLACE FUNCTION public.create_default_columns_for_user(p_user_id uuid, p_company_id uuid DEFAULT NULL::uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Create "Principal" column if it doesn't exist
  INSERT INTO custom_columns (user_id, company_id, name, color, is_main, order_index)
  SELECT p_user_id, p_company_id, 'Principal', '#3c9247', true, 0
  WHERE NOT EXISTS (
    SELECT 1 FROM custom_columns 
    WHERE user_id = p_user_id AND name = 'Principal'
  );
  
  -- Create "Secundária" column if it doesn't exist
  INSERT INTO custom_columns (user_id, company_id, name, color, is_main, order_index)
  SELECT p_user_id, p_company_id, 'Secundária', '#3b82f6', false, 1
  WHERE NOT EXISTS (
    SELECT 1 FROM custom_columns 
    WHERE user_id = p_user_id AND name = 'Secundária'
  );
END;
$function$;