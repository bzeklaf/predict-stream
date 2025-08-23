
import { TrendingUp } from 'lucide-react';
import WalletConnect from '@/components/auth/WalletConnect';
import AuthGuard from '@/components/auth/AuthGuard';

export default function Auth() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">Alpha Signals</h1>
            </div>
            <p className="text-muted-foreground">
              Join the community of alpha signal creators and traders
            </p>
          </div>

          <WalletConnect />
        </div>
      </div>
    </AuthGuard>
  );
}
