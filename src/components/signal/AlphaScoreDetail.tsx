
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Star,
  TrendingUp,
  Target,
  BarChart3,
  Shield,
  Award,
  DollarSign
} from "lucide-react";
import AlphaScoreBadge from "./AlphaScoreBadge";

interface AlphaScoreDetailProps {
  score: number;
  breakdown: {
    accuracy: number;
    calibration: number;
    consistency: number;
    riskAdjusted: number;
    stakeWeighted: number;
  };
  stats: {
    totalSignals: number;
    successfulSignals: number;
    avgStake: number;
    avgTimeHorizon: number;
    recentPerformance: number;
    peakScore: number;
  };
}

const AlphaScoreDetail = ({ score, breakdown, stats }: AlphaScoreDetailProps) => {
  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: "S+", color: "text-purple-500" };
    if (score >= 80) return { grade: "S", color: "text-bullish" };
    if (score >= 70) return { grade: "A", color: "text-bullish" };
    if (score >= 60) return { grade: "B", color: "text-primary" };
    if (score >= 50) return { grade: "C", color: "text-warning" };
    return { grade: "D", color: "text-bearish" };
  };

  const { grade, color } = getScoreGrade(score);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            AlphaScore Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <AlphaScoreBadge score={score} size="lg" />
                <div className={`text-4xl font-bold ${color}`}>
                  {grade}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {score >= 80 ? "Elite forecaster with exceptional track record" :
                 score >= 60 ? "Professional-grade performance with consistent results" :
                 score >= 40 ? "Developing forecaster showing improvement potential" :
                 "Rookie forecaster building initial reputation"}
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="text-sm text-muted-foreground">Peak Score</div>
              <div className="text-2xl font-bold">{stats.peakScore}</div>
            </div>
          </div>
          
          <Progress value={score} className="h-3" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm">Accuracy</span>
                </div>
                <span className="font-medium">{breakdown.accuracy}%</span>
              </div>
              <Progress value={breakdown.accuracy} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Calibration</span>
                </div>
                <span className="font-medium">{breakdown.calibration}%</span>
              </div>
              <Progress value={breakdown.calibration} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm">Consistency</span>
                </div>
                <span className="font-medium">{breakdown.consistency}%</span>
              </div>
              <Progress value={breakdown.consistency} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm">Risk Adjusted</span>
                </div>
                <span className="font-medium">{breakdown.riskAdjusted}%</span>
              </div>
              <Progress value={breakdown.riskAdjusted} className="h-2" />
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-sm">Stake Weighted</span>
              </div>
              <span className="font-medium">{breakdown.stakeWeighted}%</span>
            </div>
            <Progress value={breakdown.stakeWeighted} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Higher stakes increase score impact (skin in the game)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Signals</div>
              <div className="text-2xl font-bold">{stats.totalSignals}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-2xl font-bold text-bullish">
                {Math.round((stats.successfulSignals / stats.totalSignals) * 100)}%
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Avg Stake</div>
              <div className="text-2xl font-bold">${stats.avgStake}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Avg Timeframe</div>
              <div className="text-2xl font-bold">{stats.avgTimeHorizon}d</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Recent Trend</div>
              <div className={`text-2xl font-bold ${stats.recentPerformance >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                {stats.recentPerformance >= 0 ? '+' : ''}{stats.recentPerformance}%
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Rank</div>
              <div className="text-2xl font-bold flex items-center gap-1">
                <Award className="w-5 h-5 text-warning" />
                #{Math.floor(Math.random() * 50) + 1}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Score Methodology</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">How AlphaScore is Calculated:</h4>
            <ul className="space-y-1 text-muted-foreground ml-4">
              <li>• <strong>Accuracy</strong>: Brier Score for binary predictions, CRPS for ranges</li>
              <li>• <strong>Calibration</strong>: How well confidence levels match actual outcomes</li>
              <li>• <strong>Consistency</strong>: Performance stability across time periods</li>
              <li>• <strong>Risk Adjustment</strong>: Sharpe ratio for portfolio-style signals</li>
              <li>• <strong>Stake Weighting</strong>: Higher stakes demonstrate conviction</li>
            </ul>
          </div>
          
          <div className="pt-3 border-t space-y-2">
            <h4 className="font-medium">Anti-Gaming Measures:</h4>
            <ul className="space-y-1 text-muted-foreground ml-4">
              <li>• Exponential decay favors recent performance</li>
              <li>• Minimum stake requirements prevent spam</li>
              <li>• Duplicate detection via embedding similarity</li>
              <li>• Cross-validation against external oracles</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlphaScoreDetail;
