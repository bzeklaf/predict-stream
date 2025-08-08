import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Youtube, Building2, MessageCircle, CheckCircle } from "lucide-react";

interface AccessVerificationProps {
  conditionType: string;
  conditionValue: string;
  onVerified: () => void;
}

export function AccessVerification({ conditionType, conditionValue, onVerified }: AccessVerificationProps) {
  const [input, setInput] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  const getVerificationInfo = () => {
    switch (conditionType) {
      case "youtube_sub":
        return {
          icon: <Youtube className="w-5 h-5 text-red-500" />,
          title: "YouTube Subscription Required",
          description: `Subscribe to ${conditionValue} and enter your YouTube username`,
          placeholder: "Your YouTube username",
          zapierUse: "Trigger when new subscriber joins the channel"
        };
      case "exchange_account":
        return {
          icon: <Building2 className="w-5 h-5 text-blue-500" />,
          title: "Exchange Account Verification",
          description: `Verify your ${conditionValue} account`,
          placeholder: "Your exchange username/email",
          zapierUse: "Verify account status via exchange API"
        };
      case "discord_member":
        return {
          icon: <MessageCircle className="w-5 h-5 text-purple-500" />,
          title: "Discord Server Member",
          description: `Join Discord server and enter your username`,
          placeholder: "Your Discord username",
          zapierUse: "Check Discord server membership"
        };
      default:
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          title: "Access Verification",
          description: "Complete verification to access this group",
          placeholder: "Enter verification details",
          zapierUse: "Custom verification workflow"
        };
    }
  };

  const handleVerify = async () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter the required information",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Mock verification - simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Trigger Zapier webhook if provided
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify({
            condition_type: conditionType,
            condition_value: conditionValue,
            user_input: input,
            timestamp: new Date().toISOString(),
            verification_status: "pending"
          }),
        });
        
        toast({
          title: "Zapier Triggered",
          description: "Verification workflow started. Check your Zap history.",
        });
      } else {
        // Mock successful verification
        setIsVerified(true);
        toast({
          title: "Verification Successful!",
          description: "Access granted to the signal group",
        });
        onVerified();
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "This is a mock verification. Real integration would handle this.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const info = getVerificationInfo();

  if (isVerified) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="font-semibold text-green-700">Verification Complete</h3>
              <p className="text-green-600">You now have access to this signal group</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {info.icon}
          {info.title}
        </CardTitle>
        <p className="text-muted-foreground">{info.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="verification-input">Verification Details</Label>
          <Input
            id="verification-input"
            placeholder={info.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">Optional Zapier Integration</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {info.zapierUse}
          </p>
          <Label htmlFor="webhook-url">Zapier Webhook URL (Optional)</Label>
          <Input
            id="webhook-url"
            placeholder="https://hooks.zapier.com/hooks/catch/..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleVerify} 
          disabled={isVerifying || !input.trim()}
          className="w-full"
        >
          {isVerifying ? "Verifying..." : "Verify Access"}
        </Button>
        
        <div className="text-xs text-muted-foreground">
          <Badge variant="outline" className="mb-2">Mock Integration</Badge>
          <p>
            This is a demonstration of conditional access verification. 
            Real implementation would integrate with {conditionType === "youtube_sub" ? "YouTube API" : 
            conditionType === "exchange_account" ? "Exchange APIs" : "Discord API"}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}