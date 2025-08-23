
import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import BlindSignalCard from "@/components/signal/BlindSignalCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  TrendingUp,
  Plus,
  Filter
} from "lucide-react";

const blindSignals = [
  {
    id: "bs001",
    title: "Major ETH Technical Breakout Signal",
    creator: "CryptoAnalyst.eth",
    creatorScore: 85,
    asset: "ETH",
    stake: 1000,
    unlockPrice: 5,
    commitTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    revealTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
    expiryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    phase: "unlock" as const,
    isRevealed: false,
    tags: ["Technical Analysis", "Breakout"],
    riskLevel: "Medium" as const,
    summary: "Technical confluence suggests significant directional move. Multiple indicators aligning for high-probability setup."
  },
  {
    id: "bs002",
    title: "",
    creator: "MacroTrader.eth",
    creatorScore: 92,
    asset: "BTC",
    stake: 2500,
    unlockPrice: 10,
    commitTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
    revealTime: new Date(Date.now() + 36 * 60 * 60 * 1000),
    expiryTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    phase: "commit" as const,
    isRevealed: false,
    tags: ["Macro", "High Stakes"],
    riskLevel: "High" as const
  },
  {
    id: "bs003",
    title: "DeFi Sector Rotation Opportunity",
    creator: "DeFiWizard.eth",
    creatorScore: 88,
    asset: "Multi",
    stake: 750,
    unlockPrice: 3,
    commitTime: new Date(Date.now() - 72 * 60 * 60 * 1000),
    revealTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    expiryTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    phase: "reveal" as const,
    isRevealed: true,
    tags: ["DeFi", "Sector Rotation"],
    riskLevel: "Medium" as const,
    summary: "Cross-protocol yield opportunities emerging. Specific protocols showing accumulation patterns with catalyst events approaching."
  }
];

const BlindSignals = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredSignals = blindSignals.filter(signal => {
    if (activeTab === "all") return true;
    if (activeTab === "commit") return signal.phase === "commit";
    if (activeTab === "unlock") return signal.phase === "unlock"; 
    if (activeTab === "reveal") return signal.phase === "reveal";
    return true;
  });

  const stats = {
    totalCommitted: blindSignals.filter(s => s.phase === "commit").length,
    activeUnlocks: blindSignals.filter(s => s.phase === "unlock").length,
    revealed: blindSignals.filter(s => s.phase === "reveal").length,
    totalStaked: blindSignals.reduce((sum, s) => sum + s.stake, 0)
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              BlindSignals™
            </h1>
            <p className="text-muted-foreground mt-2">
              Verifiable predictions with front-running protection. Commit → Unlock → Reveal
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="gap-2">
              <Filter className="w-5 h-5" />
              Filter
            </Button>
            <Button variant="signal" size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Create BlindSignal
            </Button>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-signal border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">How BlindSignals™ Work</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <div className="font-medium">1. Commit</div>
                  <div className="text-muted-foreground">Hash forecast + stake</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">2. Unlock</div>
                  <div className="text-muted-foreground">Pay for preview access</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-bullish/20 flex items-center justify-center">
                  <Unlock className="w-4 h-4 text-bullish" />
                </div>
                <div>
                  <div className="font-medium">3. Reveal</div>
                  <div className="text-muted-foreground">Full forecast published</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Committed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-warning" />
                <span className="text-2xl font-bold">{stats.totalCommitted}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unlockable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold">{stats.activeUnlocks}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revealed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 text-bullish" />
                <span className="text-2xl font-bold">{stats.revealed}</span>
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
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold">${stats.totalStaked.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active BlindSignals</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="commit">Committed</TabsTrigger>
                <TabsTrigger value="unlock">Unlockable</TabsTrigger>
                <TabsTrigger value="reveal">Revealed</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredSignals.length > 0 ? (
                    filteredSignals.map((signal) => (
                      <BlindSignalCard key={signal.id} signal={signal} />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <EyeOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No blind signals in this category</p>
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

export default BlindSignals;
