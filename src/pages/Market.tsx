import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import SignalCard from "@/components/signal/SignalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter,
  TrendingUp,
  BarChart3,
  Clock,
  Star
} from "lucide-react";

// Extended mock data for market
const mockSignals = [
  {
    id: "1",
    title: "ETH Bullish Breakout Above $3,200",
    description: "Technical analysis shows strong support at $3,000 with institutional accumulation patterns. RSI oversold bounce expected.",
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
  },
  {
    id: "3",
    title: "AAPL Earnings Beat Expected",
    description: "Strong iPhone 15 sales and services growth should drive Q4 earnings above consensus estimates.",
    creator: "EquityExpert.eth",
    creatorScore: 76,
    asset: "AAPL",
    prediction: "bullish" as const,
    targetPrice: 195,
    currentPrice: 185,
    confidence: 82,
    stake: 750,
    timeHorizon: "30 days",
    resolutionTime: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    isResolved: false,
    isUnlocked: false,
    unlockPrice: 3,
    tags: ["Earnings", "Tech Stocks"]
  },
  {
    id: "4",
    title: "Gold Rally to $2,150",
    description: "Fed pivot expectations and geopolitical tensions support precious metals upside.",
    creator: "CommodityKing.eth",
    creatorScore: 68,
    asset: "GOLD",
    prediction: "bullish" as const,
    targetPrice: 2150,
    currentPrice: 2020,
    confidence: 71,
    stake: 400,
    timeHorizon: "21 days",
    resolutionTime: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    isResolved: false,
    isUnlocked: false,
    unlockPrice: 4,
    tags: ["Commodities", "Macro"]
  }
];

const Market = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const assets = ["all", "BTC", "ETH", "AAPL", "GOLD"];
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "score", label: "Alpha Score" },
    { value: "confidence", label: "Confidence" },
    { value: "stake", label: "Stake Amount" }
  ];

  const filteredSignals = mockSignals
    .filter(signal => 
      (selectedAsset === "all" || signal.asset === selectedAsset) &&
      (searchTerm === "" || 
        signal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signal.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.creatorScore - a.creatorScore;
        case "confidence":
          return b.confidence - a.confidence;
        case "stake":
          return b.stake - a.stake;
        default:
          return b.resolutionTime.getTime() - a.resolutionTime.getTime();
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Signal Market</h1>
          <p className="text-muted-foreground">
            Discover high-quality predictions from top-ranked forecasters
          </p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold">{mockSignals.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-bullish" />
                <span className="text-2xl font-bold">$2.65K</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Resolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning" />
                <span className="text-2xl font-bold">15d</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Top Alpha Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary fill-current" />
                <span className="text-2xl font-bold">92</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search signals, assets, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="flex gap-1">
                  {assets.map((asset) => (
                    <Button
                      key={asset}
                      variant={selectedAsset === asset ? "signal" : "outline"}
                      size="sm"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      {asset.toUpperCase()}
                    </Button>
                  ))}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing {filteredSignals.length} signals
          </p>
          <div className="flex gap-2">
            <Badge variant="outline">
              {filteredSignals.filter(s => s.prediction === "bullish").length} Bullish
            </Badge>
            <Badge variant="outline">
              {filteredSignals.filter(s => s.prediction === "bearish").length} Bearish
            </Badge>
          </div>
        </div>

        {/* Signal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>

        {filteredSignals.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No signals found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;