import { useParams } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import AlphaScoreBadge from "@/components/signal/AlphaScoreBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown,
  Clock,
  DollarSign,
  Target,
  User,
  Unlock,
  Lock,
  BarChart3,
  Calendar,
  Shield
} from "lucide-react";

// Mock signal data
const mockSignal = {
  id: "1",
  title: "ETH Bullish Breakout Above $3,200",
  description: "Technical analysis shows strong support at $3,000 with institutional accumulation patterns. RSI oversold bounce expected with confluence of multiple indicators suggesting upward momentum. The 200-day moving average is acting as strong support, and we're seeing increased institutional inflows via ETF holdings. Additionally, the upcoming Shanghai upgrade should provide additional bullish catalyst.",
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
  createdTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  isResolved: false,
  isUnlocked: false,
  unlockPrice: 2,
  tags: ["Technical Analysis", "DeFi", "ETF"],
  analysis: {
    keyPoints: [
      "Strong institutional accumulation at $3,000 support level",
      "RSI showing oversold conditions with bullish divergence",
      "200-day MA providing strong technical support",
      "Increased ETF inflows indicating institutional confidence",
      "Shanghai upgrade providing fundamental catalyst"
    ],
    riskFactors: [
      "Macro headwinds from Federal Reserve policy",
      "Potential profit-taking at resistance levels",
      "General crypto market correlation risks"
    ]
  }
};

const SignalDetail = () => {
  const { id } = useParams();
  
  const timeRemaining = mockSignal.resolutionTime.getTime() - Date.now();
  const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));
  const progressValue = Math.max(0, 100 - (timeRemaining / (7 * 24 * 60 * 60 * 1000)) * 100);

  const handleUnlock = () => {
    // Here would be the payment/unlock logic
    console.log("Unlocking signal for $", mockSignal.unlockPrice);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={mockSignal.prediction === "bullish" ? "default" : "destructive"}>
                  {mockSignal.prediction === "bullish" ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {mockSignal.prediction.toUpperCase()}
                </Badge>
                <Badge variant="outline">{mockSignal.asset}</Badge>
                <AlphaScoreBadge score={mockSignal.creatorScore} />
              </div>
              <h1 className="text-3xl font-bold">{mockSignal.title}</h1>
              <p className="text-muted-foreground">
                Created by {mockSignal.creator} • {mockSignal.createdTime.toLocaleDateString()}
              </p>
            </div>
            
            <div className="text-right">
              {mockSignal.isUnlocked ? (
                <Badge variant="outline" className="text-bullish border-bullish/50">
                  <Unlock className="w-3 h-3 mr-1" />
                  Unlocked
                </Badge>
              ) : (
                <Button onClick={handleUnlock} size="lg" className="gap-2">
                  <Lock className="w-4 h-4" />
                  Unlock for ${mockSignal.unlockPrice}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price & Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Signal Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Target Price</span>
                    <div className="text-2xl font-bold">${mockSignal.targetPrice.toLocaleString()}</div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Current Price</span>
                    <div className="text-2xl font-bold">${mockSignal.currentPrice.toLocaleString()}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {daysRemaining} days remaining
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(progressValue)}% elapsed
                    </span>
                  </div>
                  <Progress value={progressValue} className="h-3" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price Movement Needed</span>
                  <span className="font-medium">
                    {mockSignal.prediction === "bullish" ? "+" : "-"}
                    {Math.abs(((mockSignal.targetPrice - mockSignal.currentPrice) / mockSignal.currentPrice) * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis & Reasoning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockSignal.isUnlocked ? (
                  <>
                    <div className="prose prose-sm max-w-none text-foreground">
                      <p>{mockSignal.description}</p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Key Supporting Points</h4>
                      <ul className="space-y-2">
                        {mockSignal.analysis.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-bullish mt-2 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Risk Factors</h4>
                      <ul className="space-y-2">
                        {mockSignal.analysis.riskFactors.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Analysis Locked</h3>
                    <p className="text-muted-foreground mb-4">
                      Unlock this signal to access the full analysis and reasoning
                    </p>
                    <Button onClick={handleUnlock} className="gap-2">
                      <Lock className="w-4 h-4" />
                      Unlock for ${mockSignal.unlockPrice}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Signal Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Signal Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <span className="font-medium">{mockSignal.confidence}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Stake</span>
                    <span className="font-medium flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {mockSignal.stake}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time Horizon</span>
                    <span className="font-medium">{mockSignal.timeHorizon}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Resolution</span>
                    <span className="font-medium text-sm">
                      {mockSignal.resolutionTime.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Creator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{mockSignal.creator}</div>
                    <AlphaScoreBadge score={mockSignal.creatorScore} size="sm" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Signals</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accuracy Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Confidence</span>
                    <span className="font-medium">72%</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full gap-2">
                  <User className="w-4 h-4" />
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockSignal.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resolution Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resolution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Oracle-based resolution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span>Chainlink price feed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Auto-resolves at expiry</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalDetail;