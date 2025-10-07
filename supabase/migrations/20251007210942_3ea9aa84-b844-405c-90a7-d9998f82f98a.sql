-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  display_name text,
  bio text,
  avatar_url text,
  specialties text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create user_stats table for tracking performance metrics
CREATE TABLE public.user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  alpha_score integer DEFAULT 50,
  total_signals integer DEFAULT 0,
  accuracy_rate numeric DEFAULT 0,
  total_staked numeric DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  recent_performance text,
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Create signal_unlocks table
CREATE TABLE public.signal_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id uuid NOT NULL REFERENCES public.signals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  unlock_price numeric NOT NULL,
  unlocked_at timestamp with time zone DEFAULT now(),
  UNIQUE(signal_id, user_id)
);

-- Create user_follows table
CREATE TABLE public.user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL,
  following_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Create signal_resolutions table
CREATE TABLE public.signal_resolutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id uuid NOT NULL REFERENCES public.signals(id) ON DELETE CASCADE,
  resolved_at timestamp with time zone DEFAULT now(),
  final_price numeric NOT NULL,
  is_correct boolean NOT NULL,
  oracle_data jsonb,
  UNIQUE(signal_id)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('stake', 'unlock', 'subscription', 'payout', 'refund')),
  amount numeric NOT NULL,
  signal_id uuid REFERENCES public.signals(id) ON DELETE SET NULL,
  group_id uuid REFERENCES public.signal_groups(id) ON DELETE SET NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create comments table
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id uuid NOT NULL REFERENCES public.signals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('signal_resolved', 'new_follower', 'comment', 'unlock', 'group_invite')),
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean DEFAULT false,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signal_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signal_resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (true);

-- RLS Policies for user_stats
CREATE POLICY "User stats are viewable by everyone"
  ON public.user_stats FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own stats"
  ON public.user_stats FOR UPDATE
  USING (true);

-- RLS Policies for signal_unlocks
CREATE POLICY "Users can view their own unlocks"
  ON public.signal_unlocks FOR SELECT
  USING (true);

CREATE POLICY "Users can unlock signals"
  ON public.signal_unlocks FOR INSERT
  WITH CHECK (true);

-- RLS Policies for user_follows
CREATE POLICY "Everyone can view follows"
  ON public.user_follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON public.user_follows FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can unfollow others"
  ON public.user_follows FOR DELETE
  USING (true);

-- RLS Policies for signal_resolutions
CREATE POLICY "Everyone can view resolutions"
  ON public.signal_resolutions FOR SELECT
  USING (true);

CREATE POLICY "System can create resolutions"
  ON public.signal_resolutions FOR INSERT
  WITH CHECK (true);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (true);

CREATE POLICY "Users can create transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (true);

-- RLS Policies for comments
CREATE POLICY "Everyone can view comments"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (true);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (true);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_profiles_wallet_address ON public.profiles(wallet_address);
CREATE INDEX idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX idx_user_stats_alpha_score ON public.user_stats(alpha_score DESC);
CREATE INDEX idx_signal_unlocks_user_id ON public.signal_unlocks(user_id);
CREATE INDEX idx_signal_unlocks_signal_id ON public.signal_unlocks(signal_id);
CREATE INDEX idx_user_follows_follower_id ON public.user_follows(follower_id);
CREATE INDEX idx_user_follows_following_id ON public.user_follows(following_id);
CREATE INDEX idx_signal_resolutions_signal_id ON public.signal_resolutions(signal_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_signal_id ON public.transactions(signal_id);
CREATE INDEX idx_comments_signal_id ON public.comments(signal_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(user_id, is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();