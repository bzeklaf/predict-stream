
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithWallet: () => Promise<{ error: any }>;
  signInWithTelegram: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  profile: any;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile data when user signs in
        if (session?.user) {
          setTimeout(() => {
            refreshProfile();
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        refreshProfile();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithWallet = async () => {
    try {
      if (!window.ethereum) {
        const error = new Error("No wallet found. Please install MetaMask or another Web3 wallet.");
        return { error };
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts || accounts.length === 0) {
        const error = new Error("No accounts found. Please make sure your wallet is unlocked.");
        return { error };
      }

      const walletAddress = accounts[0];
      console.log('Signing in with wallet:', walletAddress);
      
      // Create a deterministic email and password from wallet address
      const email = `${walletAddress.toLowerCase()}@wallet.local`;
      const password = walletAddress.toLowerCase(); // Use lowercase for consistency
      
      // Try to sign in first
      let { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign in fails, create account
      if (error && error.message.includes('Invalid login credentials')) {
        console.log('Creating new account for wallet:', walletAddress);
        
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              wallet_address: walletAddress,
              display_name: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            }
          }
        });
        
        if (signUpError) {
          console.error('Sign up error:', signUpError);
          return { error: signUpError };
        }

        // Try to sign in after sign up
        const { error: finalSignInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (finalSignInError) {
          console.error('Final sign in error:', finalSignInError);
          return { error: finalSignInError };
        }

        toast({
          title: "Welcome!",
          description: "Account created and wallet connected successfully.",
        });
      } else if (error) {
        console.error('Sign in error:', error);
        return { error };
      } else {
        toast({
          title: "Welcome back!",
          description: "Wallet connected successfully.",
        });
      }

      return { error: null };
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      return { error };
    }
  };

  const signInWithTelegram = async () => {
    try {
      toast({
        title: "Coming Soon",
        description: "Telegram authentication will be available soon!",
        variant: "default",
      });
      
      return { error: new Error("Telegram authentication not yet implemented") };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign Out Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithWallet,
    signInWithTelegram,
    signOut,
    profile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
