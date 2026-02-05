import React, { useState } from "react";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  timeframe: string;
  reasoning: string;
}

interface AIRecommendationsProps {
  recommendations: Recommendation[];
  onApply: (recommendation: Recommendation) => void;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  recommendations,
  onApply,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const highConfidenceRecs = recommendations.filter((r) => r.confidence > 0.8);
  const averageImpactScore =
    recommendations.reduce(
      (sum, r) =>
        sum + (r.impact === "high" ? 3 : r.impact === "medium" ? 2 : 1),
      0,
    ) / recommendations.length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Recommendations"
          value={recommendations.length}
          color="blue"
        />
        <StatCard
          label="High Confidence"
          value={highConfidenceRecs.length}
          color={highConfidenceRecs.length > 0 ? "emerald" : "slate"}
        />
        <StatCard
          label="Avg Impact Score"
          value={`${averageImpactScore.toFixed(1)}/3`}
          color="purple"
        />
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="text-xl font-bold text-white mb-2">
              AI Analysis Complete
            </h3>
            <p className="text-slate-400">
              No actionable recommendations at this time. Your portfolio is
              optimally positioned.
            </p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className="glass rounded-2xl border border-white/10 overflow-hidden"
            >
              {/* Header */}
              <div
                className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === rec.id ? null : rec.id)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {rec.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          rec.impact === "high"
                            ? "bg-rose-600/20 text-rose-400"
                            : rec.impact === "medium"
                              ? "bg-amber-600/20 text-amber-400"
                              : "bg-blue-600/20 text-blue-400"
                        }`}
                      >
                        {rec.impact.toUpperCase()} IMPACT
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {rec.timeframe}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{rec.description}</p>
                  </div>

                  <div className="flex items-center space-x-4 ml-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">
                        {(rec.confidence * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-slate-500">Confidence</div>
                    </div>
                    <svg
                      className={`w-6 h-6 transition-transform ${expandedId === rec.id ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mt-4">
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all"
                      style={{ width: `${rec.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === rec.id && (
                <div className="border-t border-white/10 p-6 bg-white/3 space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Reasoning</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {rec.reasoning}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">
                        Recommended Action
                      </div>
                      <div className="font-semibold text-white">
                        {rec.action}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">
                        Timeframe
                      </div>
                      <div className="font-semibold text-white">
                        {rec.timeframe}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onApply(rec)}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all"
                  >
                    Apply Recommendation
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/30">
        <p className="text-xs text-blue-200">
          ℹ️ These recommendations are generated by the AI Pilot based on market
          analysis and your risk profile. Always review before executing. Past
          performance is not indicative of future results.
        </p>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  color: "blue" | "emerald" | "slate" | "purple";
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => {
  const colorMap = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    slate: "text-slate-500",
    purple: "text-purple-400",
  };

  return (
    <div className="glass p-4 rounded-2xl">
      <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
};
