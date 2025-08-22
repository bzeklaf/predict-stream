
import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Vault,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  Shield,
  Zap,
  Building2,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Link } from "react-router-dom";
import AlphaScoreBadge from "@/components/signal/AlphaScoreBadge";

// Mock data for SignalVaults
const signalVaults = [
  {
    id: "1",
    name: "CryptoAnalyst Alpha Fund",
    creator: "CryptoAnalyst.eth",
    creatorScore: 85,
    tvl: 250000,
    apy: 18.5,
    perfFee: 15,
    maxLeverage: 2,
    totalShares: 125000,
    sharePrice: 1.24,
    depositors: 89,
    status: "active",
    riskScore: "Medium",
    strategy: "Technical Analysis + Macro",
    inception: "2024-01-15"
  },
  {
    id: "2", 
    name: "DeFi Momentum Vault",
    creator: "DeFiWizard.eth",
    creatorScore: 92,
    tvl: 180000,
    apy: 24.2,
    perfFee: 20,
    maxLeverage: 1.5,
    totalShares: 90000,
    sharePrice: 1.18,
    depositors: 67,
    status: "active",
    riskScore: "High",
    strategy: "DeFi Yield + Momentum",
    inception: "2024-02-01"
  }
];

// Mock data for MetaVaults
const metaVaults = [
  {
    id: "1",
    name: "Diversified Alpha Portfolio",
    description: "Balanced exposure across top-performing signal creators",
    tvl: 500000,
    apy: 15.8,
    mgmtFee: 1,
    perfFee: 10,
    numVaults: 8,
    topAllocations: [
      { creator: "CryptoAnalyst.eth", weight: 25, score: 85 },
      { creator: "DeFiWizard.eth", weight: 20, score: 92 },
      { creator: "MacroTrader.eth", weight: 18, score: 88 }
    ],
    riskScore: "Low-Medium",
    inception: "2024-01-01"
  },
  {
    id: "2",
    name: "High-Alpha Systematic",
    description: "Concentrated exposure to elite forecasters (AlphaScore 80+)",
    tvl: 320000,
    apy: 22.1,
    mgmtFee: 1.5,
    perfFee: 15,
    numVaults: 5,
    topAllocations: [
      { creator: "DeFiWizard.eth", weight: 35, score: 92 },
      { creator: "MacroTrader.eth", weight: 30, score: 88 },
      { creator: "CryptoAnalyst.eth", weight: 25, score: 85 }
    ],
    riskScore: "High",
    inception: "2024-03-01"
  }
];

const Vaults = () => {
  const [activeTab, setActiveTab] = useState("signal-vaults");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Signal Vaults</h1>
            <p className="text-muted-foreground mt-2">
              Automated execution of forecaster strategies with non-custodial vault infrastructure
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="gap-2">
              <Building2 className="w-5 h-5" />
              Create MetaVault
            </Button>
            <Button variant="signal" size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Launch SignalVault
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Value Locked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Vault className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold">$1.25M</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Vaults
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-bullish" />
                <span className="text-2xl font-bold">15</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg APY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-bullish" />
                <span className="text-2xl font-bold">19.2%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Depositors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold">342</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vault Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signal-vaults">SignalVaults</TabsTrigger>
            <TabsTrigger value="meta-vaults">MetaVaults</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signal-vaults" className="mt-6">
            <div className="space-y-6">
              {signalVaults.map((vault) => (
                <Card key={vault.id} className="hover:shadow-signal transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{vault.name}</h3>
                          <AlphaScoreBadge score={vault.creatorScore} size="sm" />
                          <Badge variant="outline" className={
                            vault.riskScore === "Low" ? "text-bullish border-bullish/50" :
                            vault.riskScore === "Medium" ? "text-warning border-warning/50" :
                            "text-bearish border-bearish/50"
                          }>
                            {vault.riskScore} Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created by {vault.creator} • {vault.strategy}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        <Button variant="signal" size="sm">
                          Deposit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-muted-foreground">TVL</span>
                        <div className="font-medium">${vault.tvl.toLocaleString()}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">APY</span>
                        <div className="font-medium text-bullish flex items-center gap-1">
                          {vault.apy > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {vault.apy}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Share Price</span>
                        <div className="font-medium">${vault.sharePrice}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Perf Fee</span>
                        <div className="font-medium">{vault.perfFee}%</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Max Leverage</span>
                        <div className="font-medium">{vault.maxLeverage}x</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Depositors</span>
                        <div className="font-medium">{vault.depositors}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="meta-vaults" className="mt-6">
            <div className="space-y-6">
              {metaVaults.map((vault) => (
                <Card key={vault.id} className="hover:shadow-signal transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{vault.name}</h3>
                          <Badge variant="outline" className={
                            vault.riskScore === "Low" || vault.riskScore === "Low-Medium" ? "text-bullish border-bullish/50" :
                            vault.riskScore === "Medium" ? "text-warning border-warning/50" :
                            "text-bearish border-bearish/50"
                          }>
                            {vault.riskScore} Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {vault.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Portfolio
                        </Button>
                        <Button variant="signal" size="sm">
                          Deposit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-muted-foreground">TVL</span>
                        <div className="font-medium">${vault.tvl.toLocaleString()}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">APY</span>
                        <div className="font-medium text-bullish flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" />
                          {vault.apy}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Mgmt Fee</span>
                        <div className="font-medium">{vault.mgmtFee}%</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Perf Fee</span>
                        <div className="font-medium">{vault.perfFee}%</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Strategies</span>
                        <div className="font-medium">{vault.numVaults}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Top Allocations</h4>
                      <div className="space-y-2">
                        {vault.topAllocations.map((allocation, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span>{allocation.creator}</span>
                              <AlphaScoreBadge score={allocation.score} size="sm" />
                            </div>
                            <span className="font-medium">{allocation.weight}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Vaults;
