import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navigation from "@/components/layout/Navigation";
import SignalCard from "@/components/signal/SignalCard";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Building2, 
  Eye,
  Settings,
  Shield,
  TrendingUp,
  Target,
  Clock,
  Plus
} from "lucide-react";

interface GroupMember {
  id: string;
  displayName: string;
  address: string;
  alphaScore: number;
  joinedAt: string;
}

interface GroupSignal {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorScore: number;
  asset: string;
  prediction: "bullish" | "bearish";
  targetPrice: number;
  currentPrice: number;
  confidence: number;
  stake: number;
  timeHorizon: string;
  resolutionTime: Date;
  isResolved: boolean;
  isUnlocked: boolean;
  unlockPrice: number;
  tags: string[];
}

interface SignalGroup {
  id: string;
  name: string;
  description: string;
  access_model: string;
  price?: number;
  billing_interval?: string;
  conditions?: any;
  is_active: boolean;
  created_at: string;
  creator: {
    displayName: string;
    address: string;
    alphaScore: number;
  };
  _count: { signals: number; members: number };
}

export default function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState<SignalGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [signals, setSignals] = useState<GroupSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("signals");
  const [isMember, setIsMember] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadGroupData();
  }, [id]);

  const loadGroupData = async () => {
    try {
      // Mock data for now
      const mockGroup = {
        id: id || "1",
        name: "Premium Crypto Signals",
        description: "High-quality BTC and ETH signals with 85% accuracy rate. Get exclusive access to institutional-level analysis and early market insights.",
        access_model: "subscription",
        price: 29.99,
        billing_interval: "monthly",
        conditions: null,
        is_active: true,
        created_at: new Date().toISOString(),
        creator: {
          displayName: "CryptoAnalyst",
          address: "0x123...abc",
          alphaScore: 85
        },
        _count: { signals: 45, members: 128 }
      };

      const mockMembers = [
        {
          id: "1",
          displayName: "BlockchainBull",
          address: "0x456...def",
          alphaScore: 92,
          joinedAt: "2024-01-15"
        },
        {
          id: "2", 
          displayName: "DeFiDegen",
          address: "0x789...ghi",
          alphaScore: 76,
          joinedAt: "2024-01-20"
        }
      ];

      const mockSignals = [
        {
          id: "1",
          title: "ETH Bullish Breakout Above $3,200",
          description: "Technical analysis shows strong support at $3,000 with institutional accumulation patterns.",
          creator: "CryptoAnalyst",
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
          isUnlocked: true,
          unlockPrice: 2,
          tags: ["Technical Analysis", "DeFi"]
        }
      ];

      setGroup(mockGroup);
      setMembers(mockMembers);
      setSignals(mockSignals);
      setIsMember(Math.random() > 0.5); // Random for demo
    } catch (error) {
      console.error("Error loading group data:", error);
      toast({
        title: "Error",
        description: "Failed to load group data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAccessModelIcon = (model: string) => {
    switch (model) {
      case "subscription": return <Calendar className="w-4 h-4" />;
      case "pay_per_call": return <DollarSign className="w-4 h-4" />;
      case "conditional": return <Building2 className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const formatAccessModel = (group: SignalGroup) => {
    switch (group.access_model) {
      case "subscription":
        return `$${group.price}/${group.billing_interval}`;
      case "pay_per_call":
        return `$${group.price}/signal`;
      case "conditional":
        return group.conditions?.type === "youtube_sub" ? "YouTube Sub Required" : "Conditional";
      case "free":
        return "Free";
      default:
        return group.access_model;
    }
  };

  const handleJoinGroup = async () => {
    toast({
      title: "Joined Group!",
      description: "This is a mock integration - payment would be processed here",
    });
    setIsMember(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Group not found</h3>
            <p className="text-muted-foreground mb-4">
              The signal group you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/groups">
              <Button>Back to Groups</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Group Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{group.name}</h1>
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1"
                >
                  {getAccessModelIcon(group.access_model)}
                  {formatAccessModel(group)}
                </Badge>
                {!group.is_active && (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-4">{group.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {group._count.members} members
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {group._count.signals} signals
                </div>
                <div>
                  Created {new Date(group.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isMember ? (
                <>
                  <Badge variant="secondary" className="gap-1">
                    <Shield className="w-3 h-3" />
                    Member
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-1" />
                    Settings
                  </Button>
                </>
              ) : (
                <Button 
                  size="lg"
                  onClick={handleJoinGroup}
                  disabled={group.access_model === "conditional"}
                >
                  {group.access_model === "free" ? "Join Free" : 
                   group.access_model === "conditional" ? "Verify Access" :
                   "Subscribe"}
                </Button>
              )}
            </div>
          </div>

          {/* Creator Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {group.creator.displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Created by {group.creator.displayName}</p>
                  <p className="text-sm text-muted-foreground">
                    Alpha Score: {group.creator.alphaScore} • {group.creator.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conditional Access Requirements */}
        {group.access_model === "conditional" && group.conditions && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Access Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">To join this group, you need to:</p>
                <p className="text-muted-foreground">
                  {group.conditions.type === "youtube_sub" && 
                    `Subscribe to ${group.conditions.value} on YouTube`}
                  {group.conditions.type === "exchange_account" && 
                    `Verified account on ${group.conditions.value}`}
                  {group.conditions.type === "discord_member" && 
                    `Member of Discord server ${group.conditions.value}`}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="signals">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Signals</h2>
                {isMember && (
                  <Button asChild>
                    <Link to="/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Signal
                    </Link>
                  </Button>
                )}
              </div>
              
              {isMember ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {signals.map((signal) => (
                    <SignalCard key={signal.id} signal={signal} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Join to View Signals</h3>
                    <p className="text-muted-foreground mb-4">
                      This group's signals are exclusive to members only.
                    </p>
                    <Button onClick={handleJoinGroup}>
                      Join Group
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Group Members ({group._count.members})</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {member.displayName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{member.displayName}</p>
                          <p className="text-sm text-muted-foreground">{member.address}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          α{member.alphaScore}
                        </Badge>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Group Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{group.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Access Model</h4>
                    <div className="flex items-center gap-2">
                      {getAccessModelIcon(group.access_model)}
                      <span>{formatAccessModel(group)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Statistics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Total Members: {group._count.members}</div>
                      <div>Total Signals: {group._count.signals}</div>
                      <div>Created: {new Date(group.created_at).toLocaleDateString()}</div>
                      <div>Status: {group.is_active ? "Active" : "Inactive"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}