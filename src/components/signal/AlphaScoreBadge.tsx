import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlphaScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const AlphaScoreBadge = ({ score, size = "md", showIcon = true }: AlphaScoreBadgeProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-bullish border-bullish/50 bg-bullish/10";
    if (score >= 60) return "text-warning border-warning/50 bg-warning/10";
    if (score >= 40) return "text-muted-foreground border-border bg-muted/50";
    return "text-bearish border-bearish/50 bg-bearish/10";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Elite";
    if (score >= 60) return "Pro";
    if (score >= 40) return "Rising";
    return "Rookie";
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium transition-all",
        getScoreColor(score),
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-sm px-2.5 py-1",
        size === "lg" && "text-base px-3 py-1.5"
      )}
    >
      {showIcon && (
        <Star className={cn(
          "mr-1 fill-current",
          size === "sm" && "w-3 h-3",
          size === "md" && "w-3.5 h-3.5",
          size === "lg" && "w-4 h-4"
        )} />
      )}
      {score} {getScoreLabel(score)}
    </Badge>
  );
};

export default AlphaScoreBadge;