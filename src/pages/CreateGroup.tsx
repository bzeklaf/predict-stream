import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Users, DollarSign, Calendar, Youtube, Building2 } from "lucide-react";

export default function CreateGroup() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    access_model: "" as "free" | "subscription" | "pay_per_call" | "conditional",
    price: "",
    billing_interval: "monthly" as "monthly" | "yearly",
    conditions: {
      type: "",
      value: ""
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create groups.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const groupData: any = {
        creator_id: user.id,
        name: formData.name,
        description: formData.description,
        access_model: formData.access_model,
        is_active: true
      };

      if (formData.access_model === 'subscription' || formData.access_model === 'pay_per_call') {
        groupData.price = parseFloat(formData.price);
        if (formData.access_model === 'subscription') {
          groupData.billing_interval = formData.billing_interval;
        }
      }

      if (formData.access_model === 'conditional' && formData.conditions.type && formData.conditions.value) {
        groupData.conditions = formData.conditions;
      }

      const { error } = await supabase
        .from('signal_groups')
        .insert(groupData);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your signal group has been created.",
      });

      navigate("/groups");
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: "Failed to create signal group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAccessModelFields = () => {
    switch (formData.access_model) {
      case "subscription":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="price">Monthly Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="29.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="billing_interval">Billing Interval</Label>
              <Select 
                value={formData.billing_interval} 
                onValueChange={(value: "monthly" | "yearly") => setFormData({ ...formData, billing_interval: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case "pay_per_call":
        return (
          <div>
            <Label htmlFor="price">Price Per Signal ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="5.99"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
        );
        
      case "conditional":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="condition_type">Access Condition</Label>
              <Select 
                value={formData.conditions.type} 
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  conditions: { ...formData.conditions, type: value } 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube_sub">YouTube Subscription</SelectItem>
                  <SelectItem value="exchange_account">Crypto Exchange Account</SelectItem>
                  <SelectItem value="discord_member">Discord Server Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.conditions.type && (
              <div>
                <Label htmlFor="condition_value">
                  {formData.conditions.type === "youtube_sub" && "YouTube Channel"}
                  {formData.conditions.type === "exchange_account" && "Exchange Name"}
                  {formData.conditions.type === "discord_member" && "Discord Server ID"}
                </Label>
                <Input
                  id="condition_value"
                  placeholder={
                    formData.conditions.type === "youtube_sub" ? "@channelname" :
                    formData.conditions.type === "exchange_account" ? "Binance" :
                    "Server ID"
                  }
                  value={formData.conditions.value}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    conditions: { ...formData.conditions, value: e.target.value } 
                  })}
                  required
                />
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Signal Group</h1>
            <p className="text-muted-foreground">
              Set up a new group with custom access controls and monetization options
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Group Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    placeholder="Premium Crypto Signals"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="High-quality crypto trading signals with detailed analysis..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="access_model">Access Model</Label>
                  <Select 
                    value={formData.access_model} 
                    onValueChange={(value: "free" | "subscription" | "pay_per_call" | "conditional") => setFormData({ ...formData, access_model: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose how users access your signals" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Free Access
                        </div>
                      </SelectItem>
                      <SelectItem value="subscription">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Subscription
                        </div>
                      </SelectItem>
                      <SelectItem value="pay_per_call">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Pay Per Signal
                        </div>
                      </SelectItem>
                      <SelectItem value="conditional">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Conditional Access
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {renderAccessModelFields()}

                <div className="pt-4 border-t">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting || !formData.name || !formData.access_model}
                  >
                    {isSubmitting ? "Creating..." : "Create Signal Group"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
