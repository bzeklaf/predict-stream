
import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: null;
  session: null;
  loading: false;
  signInWithWallet: () => Promise<{ error: any }>;
  signInWithTelegram: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  profile: null;
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
  const signInWithWallet = async () => {
    return { error: new Error("Authentication disabled") };
  };

  const signInWithTelegram = async () => {
    return { error: new Error("Authentication disabled") };
  };

  const signOut = async () => {
    // No-op since auth is disabled
  };

  const refreshProfile = async () => {
    // No-op since auth is disabled
  };

  const value = {
    user: null,
    session: null,
    loading: false,
    signInWithWallet,
    signInWithTelegram,
    signOut,
    profile: null,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
