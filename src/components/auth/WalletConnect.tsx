
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function WalletConnect() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle>Wallet Connection Disabled</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Authentication system has been removed from the application.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
