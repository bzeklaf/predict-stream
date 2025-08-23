
-- Create enum types
CREATE TYPE prediction_type AS ENUM ('bullish', 'bearish');
CREATE TYPE signal_status AS ENUM ('active', 'resolved', 'expired');
CREATE TYPE access_model_type AS ENUM ('free', 'subscription', 'pay_per_call', 'conditional');
CREATE TYPE billing_interval_type AS ENUM ('monthly', 'yearly');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  alpha_score INTEGER DEFAULT 0,
  total_signals INTEGER DEFAULT 0,
  successful_signals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create signals table
CREATE TABLE public.signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  asset TEXT NOT NULL,
  prediction prediction_type NOT NULL,
  target_price DECIMAL NOT NULL,
  current_price DECIMAL NOT NULL,
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  stake_amount DECIMAL NOT NULL,
  time_horizon TEXT NOT NULL,
  resolution_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status signal_status DEFAULT 'active',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create signal_groups table
CREATE TABLE public.signal_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  access_model access_model_type NOT NULL,
  price DECIMAL,
  billing_interval billing_interval_type,
  conditions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_memberships table
CREATE TABLE public.group_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.signal_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signal_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for signals
CREATE POLICY "Users can view all signals" ON public.signals FOR SELECT USING (true);
CREATE POLICY "Users can create own signals" ON public.signals FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update own signals" ON public.signals FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete own signals" ON public.signals FOR DELETE USING (auth.uid() = creator_id);

-- Create RLS policies for signal_groups
CREATE POLICY "Users can view active groups" ON public.signal_groups FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create own groups" ON public.signal_groups FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update own groups" ON public.signal_groups FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete own groups" ON public.signal_groups FOR DELETE USING (auth.uid() = creator_id);

-- Create RLS policies for group_memberships
CREATE POLICY "Users can view group memberships" ON public.group_memberships FOR SELECT USING (true);
CREATE POLICY "Users can join groups" ON public.group_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave groups" ON public.group_memberships FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
