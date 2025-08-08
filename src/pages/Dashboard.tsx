import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import SignalCard from "@/components/signal/SignalCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Activity,
  Plus,
  Building2,
  Users,
  Settings,
  Eye,
  TrendingDown,
  BarChart3,
  ShoppingCart
} from "lucide-react";
import { Link } from "react-router-dom";

interface Signal {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  asset: string;
  prediction: "bullish" | "bearish";
  target_price: number;
  current_price: number;
  confidence: number;
  stake_amount: number;
  time_horizon: string;
  resolution_time: string;
  status: string;
  tags: string[];
}

interface SignalGroup {
  id: string;
  name: string;
  description: string;
  access_model: string;
  price: number;
  _count?: { signals: number; members: number };
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("created");
  const [signals, setSignals] = useState<Signal[]>([]);
  const [userGroups, setUserGroups] = useState<SignalGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      // Load user's signals
      const { data: signalsData, error: signalsError } = await supabase
        .from('signals')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (signalsError) throw signalsError;

      // Load user's groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('signal_groups')
        .select(`
          *,
          signals!inner(count),
          group_memberships!inner(count)
        `)
        .eq('creator_id', user.id)
        .eq('is_active', true);

      if (groupsError) throw groupsError;

      const transformedGroups = groupsData?.map(group => ({
        ...group,
        _count: {
          signals: group.signals?.[0]?.count || 0,
          members: group.group_memberships?.[0]?.count || 0
        }
      })) || [];

      setSignals((signalsData || []).map(signal => ({
        ...signal,
        prediction: signal.prediction as "bullish" | "bearish"
      })));
      setUserGroups(transformedGroups);
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

  const creatorStats = {
    totalSignals: signals.length,
    activeSignals: signals.filter(s => s.status === 'active').length,
    resolvedSignals: signals.filter(s => s.status === 'resolved').length,
    totalStaked: signals.reduce((sum, s) => sum + s.stake_amount, 0),
    accuracyRate: 75, // This would need to be calculated based on outcomes
    totalEarnings: 890 // This would come from actual earnings data
  };

  const consumerStats = {
    signalsPurchased: 28, // This would come from purchase history
    activeSubscriptions: 3, // This would come from active memberships
    totalSpent: 425, // This would come from payment history
    portfolioROI: 12.8, // This would be calculated from trade outcomes
    profitableTrades: 19, // This would come from trade history
    avgReturn: 8.5 // This would be calculated from trade outcomes
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

// Transform signals to match the expected format for SignalCard component
const transformedSignals = signals.slice(0, 4).map(signal => ({
  id: signal.id,
  title: signal.title,
  description: signal.description || "",
  creator: user.email || "Unknown",
  creatorScore: profile?.alpha_score || 0,
  asset: signal.asset,
  prediction: signal.prediction as "bullish" | "bearish",
  targetPrice: signal.target_price,
  currentPrice: signal.current_price,
  confidence: signal.confidence,
  stake: signal.stake_amount,
  timeHorizon: signal.time_horizon,
  resolutionTime: new Date(signal.resolution_time),
  isResolved: signal.status === 'resolved',
  isUnlocked: true,
  unlockPrice: 2,
  tags: signal.tags || []
}));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track your signal creation and consumption performance
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/create-group">
              <Button variant="outline" size="lg" className="gap-2">
                <Building2 className="w-5 h-5" />
                Create Group
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="signal" size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Create Signal
              </Button>
            </Link>
          </div>
        </div>

        {/* Creator Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Creator Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Signals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold">{creatorStats.totalSignals}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Signals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-bullish" />
                    <span className="text-2xl font-bold">{creatorStats.activeSignals}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Accuracy Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold">{creatorStats.accuracyRate}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Staked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-warning" />
                    <span className="text-2xl font-bold">${creatorStats.totalStaked}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-bullish" />
                    <span className="text-2xl font-bold">${creatorStats.totalEarnings}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Resolved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{creatorStats.resolvedSignals}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Consumer Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Consumer Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Signals Purchased
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold">{consumerStats.signalsPurchased}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Subscriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold">{consumerStats.activeSubscriptions}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Portfolio ROI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-bullish" />
                    <span className="text-2xl font-bold">+{consumerStats.portfolioROI}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-warning" />
                    <span className="text-2xl font-bold">${consumerStats.totalSpent}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Profitable Trades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-bullish" />
                    <span className="text-2xl font-bold">{consumerStats.profitableTrades}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg Return
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-bullish" />
                    <span className="text-2xl font-bold">+{consumerStats.avgReturn}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Groups Management Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Your Signal Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userGroups.length > 0 ? (
                userGroups.map((group) => (
                  <div key={group.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {group._count?.members || 0} members • {group._count?.signals || 0} signals
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          <DollarSign className="w-3 h-3" />
                          {group.access_model === 'free' ? 'Free' : 
                           group.access_model === 'subscription' ? `$${group.price}/month` :
                           group.access_model === 'pay_per_call' ? `$${group.price}/signal` : 
                           'Conditional'}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/groups/${group.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 border-2 border-dashed rounded-lg">
                  <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Create your first signal group</p>
                  <Link to="/create-group">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Create Group
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Signals Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="created">Created</TabsTrigger>
                <TabsTrigger value="subscribed">Subscribed</TabsTrigger>
                <TabsTrigger value="purchased">Purchased</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              
              <TabsContent value="created" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {transformedSignals.length > 0 ? (
                    transformedSignals.map((signal) => (
                      <SignalCard key={signal.id} signal={signal} />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-muted-foreground">No signals created yet</p>
                      <Link to="/create">
                        <Button className="mt-4">Create Your First Signal</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="subscribed" className="mt-6">
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Premium Crypto Signals</h3>
                          <p className="text-sm text-muted-foreground">Subscribed • 15 signals this month</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-bullish">+18.5% ROI</Badge>
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/groups/1">View Group</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">DeFi Alpha Group</h3>
                          <p className="text-sm text-muted-foreground">Subscribed • 8 signals this month</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-bearish">-3.2% ROI</Badge>
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/groups/2">View Group</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="purchased" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {transformedSignals.map((signal) => (
                    <div key={signal.id} className="relative">
                      <SignalCard signal={signal} />
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="text-bullish">+12.5%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {transformedSignals.length > 0 ? (
                    transformedSignals.map((signal) => (
                      <SignalCard key={signal.id} signal={signal} />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-muted-foreground">No signals found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;