
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Eye,
  EyeOff,
  Clock,
  DollarSign,
  Shield,
  Unlock,
  Lock,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import AlphaScoreBadge from "./AlphaScoreBadge";

export interface BlindSignal {
  id: string;
  title: string;
  creator: string;
  creatorScore: number;
  asset: string;
  stake: number;
  unlockPrice: number;
  commitTime: Date;
  revealTime: Date;
  expiryTime: Date;
  phase: "commit" | "unlock" | "reveal" | "expired";
  isRevealed: boolean;
  tags: string[];
  riskLevel: "Low" | "Medium" | "High";
  summary?: string;
}

interface BlindSignalCardProps {
  signal: BlindSignal;
}

const BlindSignalCard = ({ signal }: BlindSignalCardProps) => {
  const now = Date.now();
  const timeToReveal = signal.revealTime.getTime() - now;
  const daysToReveal = Math.max(0, Math.ceil(timeToReveal / (1000 * 60 * 60 * 24)));
  
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "commit": return "text-warning border-warning/50 bg-warning/10";
      case "unlock": return "text-primary border-primary/50 bg-primary/10";
      case "reveal": return "text-bullish border-bullish/50 bg-bullish/10";
      case "expired": return "text-bearish border-bearish/50 bg-bearish/10";
      default: return "text-muted-foreground border-border bg-muted/50";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-bullish border-bullish/50";
      case "Medium": return "text-warning border-warning/50";
      case "High": return "text-bearish border-bearish/50";
      default: return "text-muted-foreground border-border";
    }
  };

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300",
      signal.phase === "expired" && "opacity-75"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getPhaseColor(signal.phase)}>
                {signal.phase === "commit" && <Lock className="w-3 h-3 mr-1" />}
                {signal.phase === "unlock" && <Eye className="w-3 h-3 mr-1" />}
                {signal.phase === "reveal" && <Unlock className="w-3 h-3 mr-1" />}
                {signal.phase === "expired" && <AlertTriangle className="w-3 h-3 mr-1" />}
                {signal.phase.toUpperCase()}
              </Badge>
              <Badge variant="outline">{signal.asset}</Badge>
              <Badge variant="outline" className={getRiskColor(signal.riskLevel)}>
                {signal.riskLevel} Risk
              </Badge>
            </div>
            <h3 className="font-semibold text-lg leading-tight flex items-center gap-2">
              {signal.phase === "commit" ? (
                <>
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                  Blind Signal #{signal.id.slice(-6)}
                </>
              ) : (
                signal.title
              )}
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <AlphaScoreBadge score={signal.creatorScore} />
            <Shield className="w-4 h-4 text-primary" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {signal.phase !== "commit" && signal.summary && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {signal.summary}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground">Creator</span>
            <div className="font-medium">{signal.creator}</div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Stake</span>
            <div className="font-medium flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {signal.stake}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Unlock Price</span>
            <div className="font-medium">${signal.unlockPrice}</div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">
              {signal.phase === "commit" ? "Reveal In" : 
               signal.phase === "unlock" ? "Expires In" : 
               signal.phase === "reveal" ? "Revealed" : "Expired"}
            </span>
            <div className="font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {signal.phase === "commit" ? `${daysToReveal}d` :
               signal.phase === "unlock" ? `Available` :
               signal.phase === "reveal" ? "Available" : "Failed"}
            </div>
          </div>
        </div>

        {signal.phase === "commit" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Commitment locked
              </span>
              <span className="text-muted-foreground">
                Reveal: {signal.revealTime.toLocaleDateString()}
              </span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {signal.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <div className="flex w-full gap-2">
          <Link to={`/blind-signal/${signal.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          {signal.phase === "unlock" && (
            <Button variant="default" className="flex-1">
              Unlock ${signal.unlockPrice}
            </Button>
          )}
          {signal.phase === "reveal" && (
            <Button variant="default" className="flex-1">
              <Unlock className="w-4 h-4 mr-1" />
              View Full Signal
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlindSignalCard;
