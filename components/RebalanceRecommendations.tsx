import React, { useState } from "react";
import { RebalanceRecommendation } from "../hooks/useRiskProfile";

interface RebalanceRecommendationsProps {
  recommendations: RebalanceRecommendation[];
  onExecute: (recommendation: RebalanceRecommendation) => void;
  isLoading: boolean;
}

export const RebalanceRecommendations: React.FC<
  RebalanceRecommendationsProps
> = ({ recommendations, onExecute, isLoading }) => {
  const [selectedRecommendations, setSelectedRecommendations] = useState<
    Set<string>
  >(new Set());

  const toggleSelection = (symbol: string) => {
    const newSet = new Set(selectedRecommendations);
    if (newSet.has(symbol)) {
      newSet.delete(symbol);
    } else {
      newSet.add(symbol);
    }
    setSelectedRecommendations(newSet);
  };

  const totalRebalanceImpact = recommendations.reduce((sum, rec) => {
    return sum + rec.amount;
  }, 0);

  return (
    <div className="glass p-6 rounded-3xl border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Rebalance Recommendations</span>
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            {recommendations.length === 0
              ? "Your portfolio is perfectly balanced"
              : `${recommendations.length} action${recommendations.length > 1 ? "s" : ""} recommended to optimize allocation`}
          </p>
        </div>
        {recommendations.length > 0 && (
          <button
            onClick={() =>
              selectedRecommendations.size === recommendations.length
                ? setSelectedRecommendations(new Set())
                : setSelectedRecommendations(
                    new Set(recommendations.map((r) => r.symbol)),
                  )
            }
            className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            {selectedRecommendations.size === recommendations.length
              ? "Deselect All"
              : "Select All"}
          </button>
        )}
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">✓</div>
          <p className="text-slate-500 font-medium">
            Portfolio is balanced within acceptable drift
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Next check in ~30 minutes or when you enable AI Pilot
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.symbol}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedRecommendations.has(rec.symbol)
                  ? "border-blue-500/50 bg-blue-500/5"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
              onClick={() => toggleSelection(rec.symbol)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedRecommendations.has(rec.symbol)}
                    onChange={() => {}}
                    className="w-4 h-4 mt-1 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-bold text-white text-lg">
                        {rec.symbol}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          rec.action === "buy"
                            ? "bg-emerald-600/20 text-emerald-400"
                            : "bg-rose-600/20 text-rose-400"
                        }`}
                      >
                        {rec.action.toUpperCase()}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          rec.action === "buy"
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {rec.amount.toFixed(2)} {rec.symbol}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-400 mb-3">
                      <div className="flex justify-between">
                        <span>Current Allocation:</span>
                        <span className="text-white font-medium">
                          {rec.currentAllocation.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target Allocation:</span>
                        <span className="text-white font-medium">
                          {rec.targetAllocation.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-start mt-2 pt-2 border-t border-white/10">
                        <span className="text-slate-500">Reason:</span>
                        <span className="text-right text-slate-300">
                          {rec.reason}
                        </span>
                      </div>
                    </div>

                    {/* Allocation bar */}
                    <AllocationBar
                      current={rec.currentAllocation}
                      target={rec.targetAllocation}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Execute Button */}
          <button
            onClick={() => {
              selectedRecommendations.forEach((symbol) => {
                const rec = recommendations.find((r) => r.symbol === symbol);
                if (rec) onExecute(rec);
              });
            }}
            disabled={selectedRecommendations.size === 0 || isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all mt-4 ${
              selectedRecommendations.size === 0 || isLoading
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>
                  Executing {selectedRecommendations.size} Transaction(s)...
                </span>
              </span>
            ) : (
              `Execute ${selectedRecommendations.size} Selected Rebalance${selectedRecommendations.size > 1 ? "s" : ""}`
            )}
          </button>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-blue-600/10 border border-blue-600/30">
          <div className="text-xs font-semibold text-blue-400 mb-2">
            Impact Summary
          </div>
          <div className="text-sm space-y-1 text-blue-200">
            <div className="flex justify-between">
              <span>Total Portfolio Rebalance:</span>
              <span className="font-mono">
                ${totalRebalanceImpact.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Gas/Fees:</span>
              <span className="font-mono">~$2.50 - $5.00</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-blue-600/30 pt-1 mt-1">
              <span>Net Impact:</span>
              <span className="font-mono">
                ${(totalRebalanceImpact - 3.75).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface AllocationBarProps {
  current: number;
  target: number;
}

const AllocationBar: React.FC<AllocationBarProps> = ({ current, target }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] text-slate-500">
      <span>Current</span>
      <span>Target</span>
    </div>
    <div className="relative w-full h-1 bg-slate-700 rounded-full overflow-hidden">
      <div
        className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-400 opacity-60"
        style={{ width: `${current}%` }}
      ></div>
      <div
        className="absolute h-full border-2 border-emerald-500"
        style={{ left: `${target}%`, width: "2px" }}
      ></div>
    </div>
  </div>
);
