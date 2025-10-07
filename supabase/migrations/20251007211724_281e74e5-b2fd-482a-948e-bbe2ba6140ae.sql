-- Add email field and link profiles to auth.users
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS email text;

-- Make user_id unique
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);

-- Create index on user_id for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Update RLS policies for profiles
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update existing RLS policies to use auth.uid()
DROP POLICY IF EXISTS "Users can create their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;

CREATE POLICY "Users can create their own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Update signal policies to use auth.uid()
DROP POLICY IF EXISTS "Users can create own signals" ON public.signals;
DROP POLICY IF EXISTS "Users can update own signals" ON public.signals;
DROP POLICY IF EXISTS "Users can delete own signals" ON public.signals;

CREATE POLICY "Users can create own signals"
  ON public.signals FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own signals"
  ON public.signals FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete own signals"
  ON public.signals FOR DELETE
  USING (auth.uid() = creator_id);

-- Update signal_groups policies
DROP POLICY IF EXISTS "Users can create own groups" ON public.signal_groups;
DROP POLICY IF EXISTS "Users can update own groups" ON public.signal_groups;
DROP POLICY IF EXISTS "Users can delete own groups" ON public.signal_groups;

CREATE POLICY "Users can create own groups"
  ON public.signal_groups FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own groups"
  ON public.signal_groups FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete own groups"
  ON public.signal_groups FOR DELETE
  USING (auth.uid() = creator_id);

-- Update group_memberships policies
DROP POLICY IF EXISTS "Users can join groups" ON public.group_memberships;
DROP POLICY IF EXISTS "Users can leave groups" ON public.group_memberships;

CREATE POLICY "Users can join groups"
  ON public.group_memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups"
  ON public.group_memberships FOR DELETE
  USING (auth.uid() = user_id);

-- Update signal_unlocks policies
DROP POLICY IF EXISTS "Users can unlock signals" ON public.signal_unlocks;

CREATE POLICY "Users can unlock signals"
  ON public.signal_unlocks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view unlocks"
  ON public.signal_unlocks FOR SELECT
  USING (auth.uid() = user_id);

-- Update user_follows policies
DROP POLICY IF EXISTS "Users can follow others" ON public.user_follows;
DROP POLICY IF EXISTS "Users can unfollow others" ON public.user_follows;

CREATE POLICY "Users can follow others"
  ON public.user_follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON public.user_follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Update transactions policies
DROP POLICY IF EXISTS "Users can create transactions" ON public.transactions;

CREATE POLICY "Users can create transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Update comments policies
DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

CREATE POLICY "Users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- Update notifications policies
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

CREATE POLICY "Users can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);