
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import SignalCard from "@/components/signal/SignalCard";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Target, 
  Users, 
  Trophy,
  Plus,
  BarChart3
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [signals, setSignals] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setUserProfile(profileData);

      // Load user's signals
      const { data: signalsData, error: signalsError } = await supabase
        .from('signals')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (signalsError) throw signalsError;

      setSignals(signalsData || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Alpha Score",
      value: userProfile?.alpha_score || 0,
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      title: "Total Signals",
      value: userProfile?.total_signals || 0,
      icon: Target,
      color: "text-blue-500"
    },
    {
      title: "Success Rate",
      value: userProfile?.total_signals > 0 
        ? `${Math.round((userProfile.successful_signals / userProfile.total_signals) * 100)}%`
        : "0%",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "Followers",
      value: 0, // This would come from a followers table
      icon: Users,
      color: "text-purple-500"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your performance and manage your signals
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Create Signal</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Share your next prediction
                  </p>
                  <Button asChild size="sm">
                    <Link to="/create">Create Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Signal Groups</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Create or join groups
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/groups">View Groups</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Market Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Explore market signals
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/market">Browse Market</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Signals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Recent Signals</CardTitle>
              <Link to="/create">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Signal
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {signals.length > 0 ? (
              <div className="space-y-4">
                {signals.slice(0, 5).map((signal) => (
                  <SignalCard key={signal.id} signal={signal} />
                ))}
                {signals.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" asChild>
                      <Link to="/market">View All Signals</Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No signals yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first signal to start building your reputation
                </p>
                <Button asChild>
                  <Link to="/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Signal
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
