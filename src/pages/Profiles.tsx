import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search,
  TrendingUp, 
  Target,
  Trophy,
  Users,
  Building2
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for discoverable profiles
const mockProfiles = [
  {
    address: "0x123...abc",
    displayName: "CryptoAnalyst",
    alphaScore: 85,
    totalSignals: 47,
    accuracy: 78,
    followers: 1250,
    totalStaked: 12500,
    specialties: ["Technical Analysis", "DeFi"],
    recentPerformance: "+15.2%",
    signalGroups: 2
  },
  {
    address: "0x456...def",
    displayName: "BlockchainBull",
    alphaScore: 92,
    totalSignals: 23,
    accuracy: 84,
    followers: 890,
    totalStaked: 8900,
    specialties: ["Macro", "Bitcoin"],
    recentPerformance: "+22.1%",
    signalGroups: 1
  },
  {
    address: "0x789...ghi",
    displayName: "DeFiDegen",
    alphaScore: 76,
    totalSignals: 35,
    accuracy: 71,
    followers: 567,
    totalStaked: 5600,
    specialties: ["DeFi", "Altcoins"],
    recentPerformance: "+8.7%",
    signalGroups: 0
  },
  {
    address: "0xabc...jkl",
    displayName: "WhaleWatcher",
    alphaScore: 88,
    totalSignals: 56,
    accuracy: 82,
    followers: 2100,
    totalStaked: 18000,
    specialties: ["On-Chain", "Whale Analysis"],
    recentPerformance: "+19.4%",
    signalGroups: 3
  }
];

const Profiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("alphaScore");

  const filteredProfiles = mockProfiles
    .filter(profile => 
      profile.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "alphaScore":
          return b.alphaScore - a.alphaScore;
        case "accuracy":
          return b.accuracy - a.accuracy;
        case "followers":
          return b.followers - a.followers;
        case "signals":
          return b.totalSignals - a.totalSignals;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Signal Creators</h1>
          <p className="text-muted-foreground">
            Find and follow top-performing analysts in the community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["alphaScore", "accuracy", "followers", "signals"].map((sort) => (
              <Button
                key={sort}
                variant={sortBy === sort ? "signal" : "outline"}
                size="sm"
                onClick={() => setSortBy(sort)}
              >
                {sort === "alphaScore" && "Alpha Score"}
                {sort === "accuracy" && "Accuracy"}
                {sort === "followers" && "Followers"}
                {sort === "signals" && "Signals"}
              </Button>
            ))}
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <Link key={profile.address} to={`/profile/${profile.address}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {profile.displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{profile.displayName}</CardTitle>
                      <p className="text-sm text-muted-foreground font-mono">
                        {profile.address}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      α{profile.alphaScore}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                        <Target className="w-3 h-3" />
                        Accuracy
                      </div>
                      <div className="font-semibold">{profile.accuracy}%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                        <TrendingUp className="w-3 h-3" />
                        Signals
                      </div>
                      <div className="font-semibold">{profile.totalSignals}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                        <Users className="w-3 h-3" />
                        Followers
                      </div>
                      <div className="font-semibold">{profile.followers.toLocaleString()}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                        <Trophy className="w-3 h-3" />
                        Performance
                      </div>
                      <div className="font-semibold text-bullish">{profile.recentPerformance}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                        <Building2 className="w-3 h-3" />
                        Groups
                      </div>
                      <div className="font-semibold">{profile.signalGroups}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {profile.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No profiles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profiles;