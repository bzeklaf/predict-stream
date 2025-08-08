-- Create a function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, wallet_address, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies to work with auth.uid() instead of wallet_address
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Creators can create their own groups" ON public.signal_groups;
DROP POLICY IF EXISTS "Creators can update their own groups" ON public.signal_groups;
DROP POLICY IF EXISTS "Authenticated users can create signals" ON public.signals;
DROP POLICY IF EXISTS "Users can update their own signals" ON public.signals;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.group_memberships;

-- Create new RLS policies using auth.uid()
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Creators can create their own groups" ON public.signal_groups
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own groups" ON public.signal_groups
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can create signals" ON public.signals
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own signals" ON public.signals
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can view their own memberships" ON public.group_memberships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memberships" ON public.group_memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);