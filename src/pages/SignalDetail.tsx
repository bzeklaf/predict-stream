
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Users,
  Star,
  MessageSquare,
  Share2,
  BarChart3,
  Target,
  Shield,
  ArrowLeft,
  Eye,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import AlphaScoreBadge from "@/components/signal/AlphaScoreBadge";
import AlphaScoreDetail from "@/components/signal/AlphaScoreDetail";

const SignalDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - would come from API
  const signal = {
    id: id || "4",
    title: "ETH Technical Breakout - Major Upside Target",
    creator: "CryptoAnalyst.eth",
    creatorScore: 85,
    asset: "ETH",
    direction: "bullish" as const,
    currentPrice: 2150,
    targetPrice: 2400,
    confidence: 78,
    timeframe: "7 days",
    stake: 1500,
    created: new Date(Date.now() - 6 * 60 * 60 * 1000),
    expiry: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    tags: ["Technical Analysis", "Breakout", "Layer 1"],
    status: "active" as const,
    followers: 234,
    vault: {
      connected: true,
      tvl: 85000,
      apy: 22.5
    },
    analysis: {
      reasoning: "Multiple technical indicators converging for a high-probability breakout setup. Strong support at $2,100 with resistance break at $2,200 opening path to $2,400 target.",
      keyFactors: [
        "Rising wedge formation completion",
        "Volume surge on recent moves",
        "RSI showing bullish divergence",
        "On-chain metrics improving"
      ],
      riskFactors: [
        "Overall market uncertainty",
        "Potential ETF news impact",
        "Macro headwinds persist"
      ]
    }
  };

  const creatorStats = {
    score: 85,
    breakdown: {
      accuracy: 82,
      calibration: 78,
      consistency: 88,
      riskAdjusted: 85,
      stakeWeighted: 89
    },
    stats: {
      totalSignals: 156,
      successfulSignals: 128,
      avgStake: 1250,
      avgTimeHorizon: 8,
      recentPerformance: 12,
      peakScore: 94
    }
  };

  const progressValue = ((Date.now() - signal.created.getTime()) / (signal.expiry.getTime() - signal.created.getTime())) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/market">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Market
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-bullish border-bullish/50">
              {signal.status.toUpperCase()}
            </Badge>
            <Badge variant="outline">{signal.asset}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold">{signal.title}</h1>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">By</span>
                        <Link to={`/profile/${signal.creator}`} className="font-medium hover:text-primary">
                          {signal.creator}
                        </Link>
                        <AlphaScoreBadge score={signal.creatorScore} size="sm" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Follow
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Current Price</span>
                    <div className="text-lg font-bold">${signal.currentPrice}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Target</span>
                    <div className="text-lg font-bold text-bullish flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      ${signal.targetPrice}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <div className="text-lg font-bold">{signal.confidence}%</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Stake</span>
                    <div className="text-lg font-bold">${signal.stake}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Progress</span>
                    <span className="text-muted-foreground">
                      {Math.ceil((signal.expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                    </span>
                  </div>
                  <Progress value={progressValue} className="h-3" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {signal.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Analysis</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Signal Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Reasoning</h4>
                      <p className="text-muted-foreground">{signal.analysis.reasoning}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Key Supporting Factors</h4>
                      <ul className="space-y-2">
                        {signal.analysis.keyFactors.map((factor, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-bullish"></div>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Risk Factors</h4>
                      <ul className="space-y-2">
                        {signal.analysis.riskFactors.map((risk, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-warning"></div>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance" className="mt-6">
                <AlphaScoreDetail 
                  score={creatorStats.score}
                  breakdown={creatorStats.breakdown}
                  stats={creatorStats.stats}
                />
              </TabsContent>
              
              <TabsContent value="discussion" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Community Discussion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Discussion features coming soon</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Connect with other traders and share insights
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Signal Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Endorse Signal
                </Button>
                <Button variant="outline" className="w-full">
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Challenge
                </Button>
                {signal.vault.connected && (
                  <Link to="/vaults" className="block">
                    <Button variant="signal" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Invest in Vault
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {signal.vault.connected && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connected SignalVault</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground">TVL</span>
                      <div className="font-medium">${signal.vault.tvl.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground">APY</span>
                      <div className="font-medium text-bullish">{signal.vault.apy}%</div>
                    </div>
                  </div>
                  <Link to="/vaults">
                    <Button variant="outline" className="w-full">
                      View Vault Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Creator Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Total Signals</span>
                    <div className="font-medium">{creatorStats.stats.totalSignals}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Success Rate</span>
                    <div className="font-medium text-bullish">
                      {Math.round((creatorStats.stats.successfulSignals / creatorStats.stats.totalSignals) * 100)}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Avg Stake</span>
                    <div className="font-medium">${creatorStats.stats.avgStake}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Followers</span>
                    <div className="font-medium">{signal.followers}</div>
                  </div>
                </div>
                <Link to={`/profile/${signal.creator}`}>
                  <Button variant="outline" className="w-full">
                    View Full Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalDetail;
