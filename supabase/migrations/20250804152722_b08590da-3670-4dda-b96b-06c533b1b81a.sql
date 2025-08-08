-- Create signal groups table
CREATE TABLE public.signal_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  access_model TEXT NOT NULL CHECK (access_model IN ('free', 'subscription', 'pay_per_call', 'conditional')),
  price NUMERIC(10,2), -- For subscription/pay-per-call models
  billing_interval TEXT CHECK (billing_interval IN ('monthly', 'yearly')), -- For subscription model
  conditions JSONB, -- For conditional access (e.g., {"type": "youtube_sub", "channel": "@example"})
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create group memberships table
CREATE TABLE public.group_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.signal_groups(id) ON DELETE CASCADE,
  access_granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ, -- For subscription model
  access_type TEXT NOT NULL DEFAULT 'granted',
  payment_reference TEXT, -- Mock payment reference
  UNIQUE(user_id, group_id)
);

-- Update signals table to include group_id
ALTER TABLE public.signals ADD COLUMN group_id UUID REFERENCES public.signal_groups(id);

-- Enable RLS on new tables
ALTER TABLE public.signal_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;

-- Create policies for signal_groups
CREATE POLICY "Groups are viewable by everyone" 
ON public.signal_groups 
FOR SELECT 
USING (true);

CREATE POLICY "Creators can create their own groups" 
ON public.signal_groups 
FOR INSERT 
WITH CHECK (creator_id IN (
  SELECT id FROM profiles 
  WHERE wallet_address = ((current_setting('request.jwt.claims'::text))::json ->> 'wallet_address'::text)
));

CREATE POLICY "Creators can update their own groups" 
ON public.signal_groups 
FOR UPDATE 
USING (creator_id IN (
  SELECT id FROM profiles 
  WHERE wallet_address = ((current_setting('request.jwt.claims'::text))::json ->> 'wallet_address'::text)
));

-- Create policies for group_memberships
CREATE POLICY "Users can view their own memberships" 
ON public.group_memberships 
FOR SELECT 
USING (user_id IN (
  SELECT id FROM profiles 
  WHERE wallet_address = ((current_setting('request.jwt.claims'::text))::json ->> 'wallet_address'::text)
));

CREATE POLICY "System can manage memberships" 
ON public.group_memberships 
FOR ALL 
USING (true);

-- Create updated_at trigger for signal_groups
CREATE TRIGGER update_signal_groups_updated_at
BEFORE UPDATE ON public.signal_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();