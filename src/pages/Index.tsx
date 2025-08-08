import { Link } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import SignalCard from "@/components/signal/SignalCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  TrendingUp, 
  BarChart3, 
  Users,
  DollarSign,
  Zap,
  Shield,
  Globe,
  Target,
  ChevronRight,
  Star
} from "lucide-react";

// Featured signals for homepage
const featuredSignals = [
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
  },
  {
    id: "2", 
    title: "BTC Correction to $58K Support",
    description: "Macro headwinds and profit-taking pressure suggest retest of key support level.",
    creator: "MacroTrader.eth",
    creatorScore: 92,
    asset: "BTC",
    prediction: "bearish" as const,
    targetPrice: 58000,
    currentPrice: 67500,
    confidence: 65,
    stake: 1000,
    timeHorizon: "14 days",
    resolutionTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    isResolved: false,
    isUnlocked: false,
    unlockPrice: 5,
    tags: ["Macro", "Support/Resistance"]
  }
];

const Index = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="container mx-auto px-6 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/c80ed7c1-08da-452b-8e0e-e95790726980.png" 
                alt="SIGNAL" 
                className="h-24 w-auto"
              />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Decentralized
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Prediction Protocol
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stake your predictions, build your reputation, and monetize your market insights through oracle-verified signals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/market">
                <Button variant="signal" size="xl" className="gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Explore Market
                </Button>
              </Link>
              <Link to="/create">
                <Button variant="signal" size="xl" className="gap-2">
                  <Target className="w-5 h-5" />
                  Create Signal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Active Signals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">$50K+</div>
              <div className="text-muted-foreground">Total Staked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">78%</div>
              <div className="text-muted-foreground">Avg Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">300+</div>
              <div className="text-muted-foreground">Forecasters</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose SIGNAL?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Revolutionary prediction market with skin in the game, powered by verifiable oracles and reputation scoring.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Oracle-Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All predictions are resolved automatically using Chainlink oracles, ensuring transparent and tamper-proof outcomes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Alpha Score Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Build your on-chain reputation through accurate predictions and earn higher rewards for consistent performance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Monetize Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stake your confidence and earn from both accurate predictions and signal purchases from consumers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Signals */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Signals</h2>
              <p className="text-muted-foreground">
                Top-rated predictions from elite forecasters
              </p>
            </div>
            <Link to="/market">
              <Button variant="outline" className="gap-2">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredSignals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="bg-gradient-signal border-2 border-primary">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Forecasting?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the next generation of prediction markets. Stake your expertise, build your reputation, and earn from your insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/create">
                  <Button variant="signal" size="lg" className="gap-2">
                    <Target className="w-5 h-5" />
                    Create Your First Signal
                  </Button>
                </Link>
                <Link to="/market">
                  <Button variant="outline" size="lg" className="gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Browse Signals
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
