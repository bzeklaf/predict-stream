import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Clock,
  Target,
  AlertCircle
} from "lucide-react";

const Create = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    asset: "",
    prediction: "bullish" as "bullish" | "bearish",
    targetPrice: "",
    currentPrice: "",
    confidence: [75],
    stake: "",
    timeHorizon: "7",
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a signal",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      const signalData = {
        creator_id: user.id,
        title: formData.title,
        description: formData.description,
        asset: formData.asset,
        prediction: formData.prediction,
        target_price: parseFloat(formData.targetPrice),
        current_price: parseFloat(formData.currentPrice),
        confidence: formData.confidence[0],
        stake_amount: parseFloat(formData.stake),
        time_horizon: formData.timeHorizon,
        resolution_time: new Date(Date.now() + parseInt(formData.timeHorizon) * 24 * 60 * 60 * 1000).toISOString(),
        tags: formData.tags,
        status: 'active' as const
      };

      const { error } = await supabase
        .from('signals')
        .insert([signalData]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Signal created successfully",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error creating signal:", error);
      toast({
        title: "Error",
        description: "Failed to create signal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Signal</h1>
          <p className="text-muted-foreground">
            Submit your prediction with confidence and stake to build your reputation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Signal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Signal Title</label>
                <Input
                  placeholder="e.g., ETH Bullish Breakout Above $3,200"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description & Analysis</label>
                <Textarea
                  placeholder="Provide detailed analysis, reasoning, and supporting evidence for your prediction..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset</label>
                  <Input
                    placeholder="e.g., ETH, BTC, AAPL"
                    value={formData.asset}
                    onChange={(e) => setFormData(prev => ({ ...prev, asset: e.target.value.toUpperCase() }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prediction Direction</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={formData.prediction === "bullish" ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, prediction: "bullish" }))}
                      className="flex-1 gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Bullish
                    </Button>
                    <Button
                      type="button"
                      variant={formData.prediction === "bearish" ? "destructive" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, prediction: "bearish" }))}
                      className="flex-1 gap-2"
                    >
                      <TrendingDown className="w-4 h-4" />
                      Bearish
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="3200"
                      value={formData.targetPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetPrice: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Price (Reference)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="2980"
                      value={formData.currentPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPrice: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confidence & Risk */}
          <Card>
            <CardHeader>
              <CardTitle>Confidence & Risk Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium">
                  Confidence Level: {formData.confidence[0]}%
                </label>
                <Slider
                  value={formData.confidence}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, confidence: value }))}
                  max={95}
                  min={50}
                  step={5}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  Higher confidence affects your Alpha Score more significantly
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stake Amount (USDC)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="500"
                      value={formData.stake}
                      onChange={(e) => setFormData(prev => ({ ...prev, stake: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Higher stakes show stronger conviction
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Horizon (Days)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <select
                      value={formData.timeHorizon}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeHorizon: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags & Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag (e.g., Technical Analysis, DeFi)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-xs hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary & Submit */}
          <Card>
            <CardHeader>
              <CardTitle>Signal Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Asset</span>
                    <div className="font-medium">{formData.asset || "—"}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Direction</span>
                    <div className="font-medium flex items-center gap-1">
                      {formData.prediction === "bullish" ? (
                        <TrendingUp className="w-3 h-3 text-bullish" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-bearish" />
                      )}
                      {formData.prediction.toUpperCase()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Target</span>
                    <div className="font-medium">${formData.targetPrice || "—"}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Stake</span>
                    <div className="font-medium">${formData.stake || "—"}</div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                    <div>
                      <p className="font-medium">Important Notes:</p>
                      <ul className="mt-1 text-muted-foreground space-y-1">
                        <li>• Your stake will be locked until signal resolution</li>
                        <li>• Resolution occurs automatically via oracle at expiry</li>
                        <li>• Incorrect predictions may result in stake slashing</li>
                        <li>• Users pay {formData.stake ? Math.max(2, Math.floor(Number(formData.stake) * 0.01)) : 2} USDC to unlock this signal</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  <Target className="w-5 h-5 mr-2" />
                  {isSubmitting ? "Creating Signal..." : "Submit Signal"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Create;
