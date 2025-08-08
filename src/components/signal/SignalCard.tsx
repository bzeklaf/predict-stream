import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign,
  Lock,
  Unlock,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import AlphaScoreBadge from "./AlphaScoreBadge";

export interface Signal {
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

interface SignalCardProps {
  signal: Signal;
  variant?: "default" | "compact";
}

const SignalCard = ({ signal, variant = "default" }: SignalCardProps) => {
  const timeRemaining = signal.resolutionTime.getTime() - Date.now();
  const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));
  const progressValue = signal.isResolved ? 100 : Math.max(0, 100 - (timeRemaining / (7 * 24 * 60 * 60 * 1000)) * 100);

  const isPredictionCorrect = signal.isResolved && 
    ((signal.prediction === "bullish" && signal.currentPrice >= signal.targetPrice) ||
     (signal.prediction === "bearish" && signal.currentPrice <= signal.targetPrice));

  return (
    <Card className={cn(
      "group hover:shadow-signal transition-all duration-300 hover:scale-[1.02]",
      signal.isResolved && isPredictionCorrect && "border-bullish/50",
      signal.isResolved && !isPredictionCorrect && "border-bearish/50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={signal.prediction === "bullish" ? "default" : "destructive"}>
                {signal.prediction === "bullish" ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {signal.prediction.toUpperCase()}
              </Badge>
              <Badge variant="outline">{signal.asset}</Badge>
            </div>
            <h3 className="font-semibold text-lg leading-tight">{signal.title}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <AlphaScoreBadge score={signal.creatorScore} />
            {signal.isUnlocked ? (
              <Unlock className="w-4 h-4 text-bullish" />
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {signal.isUnlocked && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {signal.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground">Target Price</span>
            <div className="font-medium">${signal.targetPrice.toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Current Price</span>
            <div className="font-medium">${signal.currentPrice.toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Confidence</span>
            <div className="font-medium">{signal.confidence}%</div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Stake</span>
            <div className="font-medium flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {signal.stake}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {signal.isResolved ? "Resolved" : `${daysRemaining} days left`}
            </span>
            <span className="text-muted-foreground">
              {Math.round(progressValue)}%
            </span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

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
          <Link to={`/signal/${signal.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          {!signal.isUnlocked && (
            <Button variant="signal" className="flex-1">
              Unlock ${signal.unlockPrice}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignalCard;