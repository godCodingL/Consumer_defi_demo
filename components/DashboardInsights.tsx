import React from "react";

export interface DashboardInsight {
  id: string;
  type: "success" | "warning" | "info" | "opportunity";
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface DashboardInsightsProps {
  insights: DashboardInsight[];
}

export const DashboardInsights: React.FC<DashboardInsightsProps> = ({
  insights,
}) => {
  if (insights.length === 0) return null;

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
};

interface InsightCardProps {
  insight: DashboardInsight;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const typeConfig = {
    success: {
      bg: "bg-emerald-600/10",
      border: "border-emerald-600/30",
      icon: "✓",
      iconColor: "text-emerald-400",
      titleColor: "text-emerald-400",
    },
    warning: {
      bg: "bg-amber-600/10",
      border: "border-amber-600/30",
      icon: "⚠️",
      iconColor: "text-amber-400",
      titleColor: "text-amber-400",
    },
    info: {
      bg: "bg-blue-600/10",
      border: "border-blue-600/30",
      icon: "ℹ️",
      iconColor: "text-blue-400",
      titleColor: "text-blue-400",
    },
    opportunity: {
      bg: "bg-purple-600/10",
      border: "border-purple-600/30",
      icon: "💡",
      iconColor: "text-purple-400",
      titleColor: "text-purple-400",
    },
  };

  const config = typeConfig[insight.type];

  return (
    <div
      className={`p-4 rounded-xl border ${config.bg} ${config.border} flex items-start space-x-4`}
    >
      <div className={`text-2xl ${config.iconColor} flex-shrink-0`}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold ${config.titleColor}`}>
          {insight.title}
        </div>
        <p className="text-sm text-slate-300 mt-1">{insight.message}</p>
        {insight.action && (
          <button
            onClick={insight.action.onClick}
            className={`mt-2 text-sm font-semibold underline hover:no-underline transition-all ${config.titleColor}`}
          >
            {insight.action.label} →
          </button>
        )}
      </div>
    </div>
  );
};
