-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, wallet_address)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'wallet_address', '')
  );
  
  -- Also create initial user stats
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;