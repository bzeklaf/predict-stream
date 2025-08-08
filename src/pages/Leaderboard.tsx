import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Target,
  Users,
  Clock,
  DollarSign
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for top creators
const topCreators = [
  {
    rank: 1,
    address: "0x456...def",
    displayName: "BlockchainBull",
    alphaScore: 92,
    totalSignals: 23,
    accuracy: 84,
    followers: 890,
    totalStaked: 8900,
    recentPerformance: "+22.1%"
  },
  {
    rank: 2,
    address: "0xabc...jkl",
    displayName: "WhaleWatcher",
    alphaScore: 88,
    totalSignals: 56,
    accuracy: 82,
    followers: 2100,
    totalStaked: 18000,
    recentPerformance: "+19.4%"
  },
  {
    rank: 3,
    address: "0x123...abc",
    displayName: "CryptoAnalyst",
    alphaScore: 85,
    totalSignals: 47,
    accuracy: 78,
    followers: 1250,
    totalStaked: 12500,
    recentPerformance: "+15.2%"
  },
  {
    rank: 4,
    address: "0x789...ghi",
    displayName: "DeFiDegen",
    alphaScore: 76,
    totalSignals: 35,
    accuracy: 71,
    followers: 567,
    totalStaked: 5600,
    recentPerformance: "+8.7%"
  }
];

// Mock data for top groups
const topGroups = [
  {
    rank: 1,
    id: "1",
    name: "Premium Crypto Signals",
    creator: "CryptoAnalyst",
    description: "High-quality BTC and ETH signals with 85% accuracy rate",
    members: 128,
    signals: 45,
    accuracyRate: 85,
    monthlyReturn: "+24.3%",
    accessModel: "subscription",
    price: 29.99
  },
  {
    rank: 2,
    id: "2", 
    name: "DeFi Alpha Calls",
    creator: "WhaleWatcher",
    description: "Early access to DeFi gems and yield farming opportunities",
    members: 67,
    signals: 23,
    accuracyRate: 78,
    monthlyReturn: "+18.7%",
    accessModel: "pay_per_call",
    price: 5.99
  },
  {
    rank: 3,
    id: "3",
    name: "Macro Market Moves",
    creator: "BlockchainBull",
    description: "Traditional market analysis applied to crypto",
    members: 89,
    signals: 34,
    accuracyRate: 72,
    monthlyReturn: "+16.2%",
    accessModel: "subscription",
    price: 19.99
  },
  {
    rank: 4,
    id: "4",
    name: "YouTube Subscriber Exclusive",
    creator: "DeFiDegen",
    description: "Free signals for YouTube subscribers",
    members: 234,
    signals: 12,
    accuracyRate: 68,
    monthlyReturn: "+12.5%",
    accessModel: "conditional",
    price: null
  }
];

// Mock data for top signals
const topSignals = [
  {
    rank: 1,
    id: "1",
    title: "Bitcoin Bull Run Continuation",
    creator: "BlockchainBull",
    prediction: "BTC will reach $75,000 by March 2024",
    confidence: 85,
    timeframe: "3 months",
    category: "Bitcoin",
    stakeAmount: 5000,
    accuracy: "92%",
    returns: "+28.5%"
  },
  {
    rank: 2,
    id: "2", 
    title: "Ethereum Staking Surge",
    creator: "WhaleWatcher",
    prediction: "ETH staking ratio will exceed 25%",
    confidence: 78,
    timeframe: "6 months",
    category: "Ethereum",
    stakeAmount: 3200,
    accuracy: "89%",
    returns: "+21.3%"
  },
  {
    rank: 3,
    id: "3",
    title: "DeFi TVL Recovery",
    creator: "CryptoAnalyst", 
    prediction: "Total DeFi TVL will surpass $100B",
    confidence: 72,
    timeframe: "4 months",
    category: "DeFi",
    stakeAmount: 2800,
    accuracy: "85%",
    returns: "+18.9%"
  },
  {
    rank: 4,
    id: "4",
    title: "Layer 2 Adoption Boom",
    creator: "DeFiDegen",
    prediction: "L2 transaction volume will 3x",
    confidence: 80,
    timeframe: "8 months", 
    category: "Layer 2",
    stakeAmount: 1500,
    accuracy: "78%",
    returns: "+15.7%"
  }
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Award className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
  }
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("creators");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            Top performing creators and signals in the community
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="creators">Top Creators</TabsTrigger>
            <TabsTrigger value="signals">Top Signals</TabsTrigger>
            <TabsTrigger value="groups">Top Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="creators">
            <div className="space-y-4">
              {topCreators.map((creator) => (
                <Link key={creator.address} to={`/profile/${creator.address}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 hover:border-primary/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          {getRankIcon(creator.rank)}
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                              {creator.displayName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{creator.displayName}</h3>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              α{creator.alphaScore}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">
                            {creator.address}
                          </p>
                        </div>

                        <div className="grid grid-cols-4 gap-6 text-center">
                          <div>
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <Target className="w-3 h-3" />
                              Accuracy
                            </div>
                            <div className="font-semibold">{creator.accuracy}%</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <TrendingUp className="w-3 h-3" />
                              Signals
                            </div>
                            <div className="font-semibold">{creator.totalSignals}</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <Users className="w-3 h-3" />
                              Followers
                            </div>
                            <div className="font-semibold">{creator.followers.toLocaleString()}</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <DollarSign className="w-3 h-3" />
                              Performance
                            </div>
                            <div className="font-semibold text-bullish">{creator.recentPerformance}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="signals">
            <div className="space-y-4">
              {topSignals.map((signal) => (
                <Link key={signal.id} to={`/signal/${signal.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 hover:border-primary/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          {getRankIcon(signal.rank)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{signal.title}</h3>
                            <Badge variant="outline">{signal.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {signal.prediction}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            By {signal.creator}
                          </p>
                        </div>

                        <div className="grid grid-cols-4 gap-6 text-center">
                          <div>
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <Target className="w-3 h-3" />
                              Confidence
                            </div>
                            <div className="font-semibold">{signal.confidence}%</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <Clock className="w-3 h-3" />
                              Timeframe
                            </div>
                            <div className="font-semibold">{signal.timeframe}</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <DollarSign className="w-3 h-3" />
                              Stake
                            </div>
                            <div className="font-semibold">${signal.stakeAmount.toLocaleString()}</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <TrendingUp className="w-3 h-3" />
                              Returns
                            </div>
                            <div className="font-semibold text-bullish">{signal.returns}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups">
            <div className="space-y-4">
              {topGroups.map((group) => (
                <Link key={group.id} to={`/groups/${group.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 hover:border-primary/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          {getRankIcon(group.rank)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{group.name}</h3>
                            <Badge variant="outline">
                              {group.accessModel === "subscription" && `$${group.price}/month`}
                              {group.accessModel === "pay_per_call" && `$${group.price}/signal`}
                              {group.accessModel === "conditional" && "Conditional"}
                              {group.accessModel === "free" && "Free"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {group.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            By {group.creator}
                          </p>
                        </div>

                        <div className="grid grid-cols-4 gap-6 text-center">
                          <div>
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <Users className="w-3 h-3" />
                              Members
                            </div>
                            <div className="font-semibold">{group.members}</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <TrendingUp className="w-3 h-3" />
                              Signals
                            </div>
                            <div className="font-semibold">{group.signals}</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <Target className="w-3 h-3" />
                              Accuracy
                            </div>
                            <div className="font-semibold">{group.accuracyRate}%</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <DollarSign className="w-3 h-3" />
                              Returns
                            </div>
                            <div className="font-semibold text-bullish">{group.monthlyReturn}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;