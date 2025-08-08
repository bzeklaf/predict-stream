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
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithWallet = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: "Wallet Not Found",
          description: "Please install MetaMask or another Web3 wallet.",
          variant: "destructive",
        });
        return { error: new Error("No wallet found") };
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts || accounts.length === 0) {
        return { error: new Error("No accounts found") };
      }

      const walletAddress = accounts[0];
      
      // Create a temporary email using wallet address
      const email = `${walletAddress.toLowerCase()}@wallet.local`;
      const password = walletAddress; // Use wallet address as password
      
      // Try to sign in first
      let { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign in fails, create account
      if (error && error.message.includes('Invalid login credentials')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              wallet_address: walletAddress,
              display_name: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            }
          }
        });
        
        if (signUpError) {
          toast({
            title: "Wallet Authentication Error",
            description: signUpError.message,
            variant: "destructive",
          });
          return { error: signUpError };
        }

        // Try to sign in after sign up
        const { error: finalSignInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (finalSignInError) {
          toast({
            title: "Wallet Authentication Error",
            description: finalSignInError.message,
            variant: "destructive",
          });
          return { error: finalSignInError };
        }
      } else if (error) {
        toast({
          title: "Wallet Authentication Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Success!",
        description: "Connected with crypto wallet.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Wallet Connection Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInWithTelegram = async () => {
    try {
      // For now, this is a placeholder that will open Telegram login
      // In a real implementation, you'd integrate with Telegram's Login Widget
      toast({
        title: "Telegram Login",
        description: "Telegram authentication coming soon!",
        variant: "default",
      });
      
      // Placeholder for future Telegram integration
      return { error: new Error("Telegram authentication not yet implemented") };
    } catch (error: any) {
      toast({
        title: "Telegram Authentication Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
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