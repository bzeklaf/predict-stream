
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Wallet, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signInWithWallet } = useAuth();
  const navigate = useNavigate();

  const detectWalletProvider = () => {
    if (typeof window.ethereum !== 'undefined') {
      if (window.ethereum.isMetaMask) return 'MetaMask';
      if (window.ethereum.isCoinbaseWallet) return 'Coinbase Wallet';
      if (window.ethereum.isRabby) return 'Rabby';
      return 'Web3 Wallet';
    }
    return null;
  };

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if wallet is available
      if (!window.ethereum) {
        setError('No crypto wallet detected. Please install MetaMask or another Web3 wallet.');
        setIsConnecting(false);
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        setError('No wallet accounts found. Please make sure your wallet is unlocked.');
        setIsConnecting(false);
        return;
      }

      const walletAddress = accounts[0];
      console.log('Connecting wallet:', walletAddress);

      // Sign in with wallet
      const { error: signInError } = await signInWithWallet();

      if (signInError) {
        setError(signInError.message || 'Failed to authenticate with wallet');
        setIsConnecting(false);
        return;
      }

      setSuccess('Successfully connected! Redirecting to dashboard...');
      
      // Redirect after a brief delay to show success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err: any) {
      console.error('Wallet connection error:', err);
      
      if (err.code === 4001) {
        setError('Connection cancelled. Please try again.');
      } else if (err.code === -32002) {
        setError('A connection request is already pending. Please check your wallet.');
      } else {
        setError(err.message || 'Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const walletProvider = detectWalletProvider();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle>Connect Your Wallet</CardTitle>
        <p className="text-sm text-muted-foreground">
          {walletProvider 
            ? `Connect with ${walletProvider} to start trading signals`
            : 'Install a Web3 wallet to get started'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500 text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleWalletConnect}
          className="w-full h-12 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
          disabled={isConnecting || !walletProvider}
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : !walletProvider ? (
            <>
              <AlertCircle className="mr-2 h-5 w-5" />
              Install Wallet
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-5 w-5" />
              Connect {walletProvider}
            </>
          )}
        </Button>

        {!walletProvider && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">
              Don't have a wallet? Get started with:
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://metamask.io/', '_blank')}
              >
                MetaMask
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://www.coinbase.com/wallet/', '_blank')}
              >
                Coinbase
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          By connecting, you agree to our terms of service and privacy policy.
        </p>
      </CardContent>
    </Card>
  );
}
