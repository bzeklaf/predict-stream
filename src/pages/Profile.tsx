import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import SignalCard from "@/components/signal/SignalCard";
import AlphaScoreBadge from "@/components/signal/AlphaScoreBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  TrendingUp, 
  Target, 
  DollarSign,
  Calendar,
  Award,
  BarChart3,
  Clock,
  Users,
  Building2,
  Eye
} from "lucide-react";

// Mock profile data
const mockProfile = {
  address: "0x123...abc",
  displayName: "CryptoAnalyst.eth",
  alphaScore: 85,
  joinDate: new Date("2023-06-15"),
  stats: {
    totalSignals: 24,
    activeSignals: 6,
    resolvedSignals: 18,
    accuracyRate: 78,
    totalStaked: 5200,
    totalEarnings: 1840,
    avgConfidence: 72,
    followers: 156
  },
  performance: {
    bullishCorrect: 12,
    bullishTotal: 15,
    bearishCorrect: 6,
    bearishTotal: 9,
    highConfidenceCorrect: 8,
    highConfidenceTotal: 10
  },
  recentSignals: [
    {
      id: "1",
      title: "ETH Bullish Breakout Above $3,200",
      description: "Technical analysis shows strong support at $3,000 with institutional accumulation patterns.",
      creator: "CryptoAnalyst.eth",
      creatorScore: 85,
      asset: "ETH",
      prediction: "bullish" as const,
      targetPrice: 3200,
      currentPrice: 2980,
      confidence: 78,
      stake: 500,
      timeHorizon: "7 days",
      resolutionTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isResolved: false,
      isUnlocked: false,
      unlockPrice: 2,
      tags: ["Technical Analysis", "DeFi"]
    }
  ]
};

const Profile = () => {
  const { address } = useParams();
  
  const bullishAccuracy = (mockProfile.performance.bullishCorrect / mockProfile.performance.bullishTotal) * 100;
  const bearishAccuracy = (mockProfile.performance.bearishCorrect / mockProfile.performance.bearishTotal) * 100;
  const highConfidenceAccuracy = (mockProfile.performance.highConfidenceCorrect / mockProfile.performance.highConfidenceTotal) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold">{mockProfile.displayName}</h1>
                <AlphaScoreBadge score={mockProfile.alphaScore} size="lg" />
              </div>
              <p className="text-muted-foreground mb-4">
                {mockProfile.address} • Joined {mockProfile.joinDate.toLocaleDateString()}
              </p>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="gap-1">
                  <Award className="w-3 h-3" />
                  {mockProfile.stats.followers} followers
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {mockProfile.stats.accuracyRate}% accuracy
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Users className="w-3 h-3" />
                  2 signal groups
                </Badge>
                <Button variant="outline">Follow</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProfile.stats.totalSignals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bullish">{mockProfile.stats.activeSignals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProfile.stats.resolvedSignals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockProfile.stats.accuracyRate}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Staked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockProfile.stats.totalStaked}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bullish">${mockProfile.stats.totalEarnings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProfile.stats.avgConfidence}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Followers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProfile.stats.followers}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Breakdown */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Bullish Predictions</span>
                      <span className="text-sm text-muted-foreground">
                        {mockProfile.performance.bullishCorrect}/{mockProfile.performance.bullishTotal}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-bullish rounded-full h-2 transition-all" 
                          style={{ width: `${bullishAccuracy}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{bullishAccuracy.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Bearish Predictions</span>
                      <span className="text-sm text-muted-foreground">
                        {mockProfile.performance.bearishCorrect}/{mockProfile.performance.bearishTotal}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-bearish rounded-full h-2 transition-all" 
                          style={{ width: `${bearishAccuracy}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{bearishAccuracy.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">High Confidence (&gt;80%)</span>
                      <span className="text-sm text-muted-foreground">
                        {mockProfile.performance.highConfidenceCorrect}/{mockProfile.performance.highConfidenceTotal}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all" 
                          style={{ width: `${highConfidenceAccuracy}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{highConfidenceAccuracy.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assets Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { asset: "ETH", count: 8, accuracy: 75 },
                    { asset: "BTC", count: 6, accuracy: 83 },
                    { asset: "AAPL", count: 4, accuracy: 75 },
                    { asset: "GOLD", count: 3, accuracy: 67 },
                    { asset: "SPY", count: 3, accuracy: 100 }
                  ].map((item) => (
                    <div key={item.asset} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.asset}</Badge>
                        <span className="text-muted-foreground">{item.count} signals</span>
                      </div>
                      <span className="font-medium">{item.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Signal Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Premium Crypto Signals</p>
                      <p className="text-sm text-muted-foreground">128 members</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Creator</Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/groups/1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">DeFi Alpha Calls</p>
                      <p className="text-sm text-muted-foreground">67 members</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Member</Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/groups/2">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Signals Tab */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Signals</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active" className="mt-6">
                    <div className="space-y-4">
                      {mockProfile.recentSignals.map((signal) => (
                        <SignalCard key={signal.id} signal={signal} variant="compact" />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resolved" className="mt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Resolved signals will appear here</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="all" className="mt-6">
                    <div className="space-y-4">
                      {mockProfile.recentSignals.map((signal) => (
                        <SignalCard key={signal.id} signal={signal} variant="compact" />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;