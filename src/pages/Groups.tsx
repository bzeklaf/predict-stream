
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, DollarSign, Calendar, Building2, Settings, Eye } from "lucide-react";

interface SignalGroup {
  id: string;
  name: string;
  description: string;
  access_model: string;
  price: number;
  billing_interval: string;
  conditions: any;
  is_active: boolean;
  created_at: string;
  _count?: { signals: number; members: number };
}

export default function Groups() {
  const [groups, setGroups] = useState<SignalGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      // Load groups with basic data first
      const { data: groupsData, error } = await supabase
        .from('signal_groups')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      // For now, set mock counts since we don't have proper aggregation setup
      const transformedGroups = groupsData?.map(group => ({
        ...group,
        _count: {
          signals: 0, // Would need proper count query
          members: 0  // Would need proper count query
        }
      })) || [];
      
      setGroups(transformedGroups);
    } catch (error) {
      console.error("Error loading groups:", error);
      toast({
        title: "Error",
        description: "Failed to load signal groups",
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

  const getAccessModelColor = (model: string) => {
    switch (model) {
      case "subscription": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "pay_per_call": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "conditional": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
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

  const mockJoinGroup = async (groupId: string) => {
    toast({
      title: "Joined Group!",
      description: "This is a mock integration - payment would be processed here",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Signal Groups</h1>
            <p className="text-muted-foreground">
              Discover and join signal groups or create your own
            </p>
          </div>
          
          <Link to="/create-group">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Group
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{group.name}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`flex items-center gap-1 ${getAccessModelColor(group.access_model)}`}
                      >
                        {getAccessModelIcon(group.access_model)}
                        {formatAccessModel(group)}
                      </Badge>
                      {!group.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{group.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/groups/${group.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => mockJoinGroup(group.id)}
                      disabled={group.access_model === "conditional"}
                    >
                      {group.access_model === "free" ? "Join Free" : 
                       group.access_model === "conditional" ? "Verify Access" :
                       "Subscribe"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {group._count?.members || 0} members
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {group._count?.signals || 0} signals
                  </div>
                  <div>
                    Created {new Date(group.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                {group.access_model === "conditional" && group.conditions && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Access Requirements:</p>
                    <p className="text-sm text-muted-foreground">
                      {group.conditions.type === "youtube_sub" && 
                        `Subscribe to ${group.conditions.value} on YouTube`}
                      {group.conditions.type === "exchange_account" && 
                        `Verified account on ${group.conditions.value}`}
                      {group.conditions.type === "discord_member" && 
                        `Member of Discord server ${group.conditions.value}`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No signal groups found</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to create a signal group and start building your community
            </p>
            <Link to="/create-group">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Group
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
