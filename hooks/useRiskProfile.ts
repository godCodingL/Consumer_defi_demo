import { useState, useCallback } from "react";

export interface RiskProfile {
  riskLevel: "conservative" | "moderate" | "aggressive";
  maxDrift: number; // percentage
  rebalanceThreshold: number; // percentage
  maxSlippage: number; // percentage
  allowHighVolatility: boolean;
}

export interface PortfolioMetrics {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  weekChange: number;
  monthChange: number;
  unrealizedGains: number;
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
}

export interface RebalanceRecommendation {
  symbol: string;
  currentAllocation: number;
  targetAllocation: number;
  action: "buy" | "sell";
  amount: number;
  reason: string;
}

export const useRiskProfile = () => {
  const [riskProfile, setRiskProfile] = useState<RiskProfile>({
    riskLevel: "moderate",
    maxDrift: 5,
    rebalanceThreshold: 3,
    maxSlippage: 0.5,
    allowHighVolatility: false,
  });

  const updateRiskProfile = useCallback((profile: Partial<RiskProfile>) => {
    setRiskProfile((prev) => ({ ...prev, ...profile }));
  }, []);

  const getRiskScore = useCallback((): number => {
    let score = 0;
    if (riskProfile.riskLevel === "conservative") score = 25;
    else if (riskProfile.riskLevel === "moderate") score = 50;
    else score = 75;

    if (riskProfile.allowHighVolatility) score += 10;
    return Math.min(100, score);
  }, [riskProfile]);

  return {
    riskProfile,
    updateRiskProfile,
    getRiskScore,
  };
};

export const generateRebalanceRecommendations = (
  currentAlloc: Record<string, number>,
  targetAlloc: Record<string, number>,
  prices: Record<string, number>,
  riskProfile: RiskProfile,
): RebalanceRecommendation[] => {
  const recommendations: RebalanceRecommendation[] = [];
  const totalValue = Object.entries(currentAlloc).reduce(
    (sum, [symbol, alloc]) => sum + (alloc / 100) * (prices[symbol] || 1),
    1000,
  );

  Object.entries(targetAlloc).forEach(([symbol, targetPct]) => {
    const currentPct = currentAlloc[symbol] || 0;
    const drift = Math.abs(currentPct - targetPct);

    if (drift > riskProfile.rebalanceThreshold) {
      const currentValue = (currentPct / 100) * totalValue;
      const targetValue = (targetPct / 100) * totalValue;
      const difference = targetValue - currentValue;
      const price = prices[symbol] || 1;
      const amount = Math.abs(difference / price);

      recommendations.push({
        symbol,
        currentAllocation: currentPct,
        targetAllocation: targetPct,
        action: difference > 0 ? "buy" : "sell",
        amount: parseFloat(amount.toFixed(2)),
        reason:
          drift > 5
            ? `High drift detected: ${drift.toFixed(1)}% above threshold`
            : `Drift maintenance: keeping portfolio aligned`,
      });
    }
  });

  return recommendations;
};
