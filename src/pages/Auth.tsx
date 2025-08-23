
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthGuard from '@/components/auth/AuthGuard';

export default function Auth() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Alpha Signals</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Authentication has been disabled
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                The authentication system has been removed from the application.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
