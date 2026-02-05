import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ComparisonData {
  name: string;
  portfolio: number;
  benchmark: number;
  market: number;
}

interface PortfolioComparisonProps {
  comparisonData: ComparisonData[];
  portfolioReturn: number;
  benchmarkReturn: number;
  marketReturn: number;
}

export const PortfolioComparison: React.FC<PortfolioComparisonProps> = ({
  comparisonData,
  portfolioReturn,
  benchmarkReturn,
  marketReturn,
}) => {
  const outperformance = portfolioReturn - benchmarkReturn;
  const isOutperforming = outperformance > 0;

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PerformanceCard
          label="Your Portfolio"
          return={portfolioReturn}
          icon="📊"
          highlight={true}
        />
        <PerformanceCard
          label="Benchmark (50/50)"
          return={benchmarkReturn}
          icon="📈"
        />
        <PerformanceCard
          label="Market Average"
          return={marketReturn}
          icon="🌍"
        />
      </div>

      {/* Outperformance Badge */}
      <div
        className={`p-6 rounded-2xl border ${
          isOutperforming
            ? "bg-emerald-600/10 border-emerald-600/30"
            : "bg-amber-600/10 border-amber-600/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3
              className={`text-lg font-bold ${isOutperforming ? "text-emerald-400" : "text-amber-400"}`}
            >
              {isOutperforming ? "Outperforming" : "Underperforming"} Benchmark
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Your AI Pilot strategy is{" "}
              {isOutperforming ? "generating" : "tracking"}{" "}
              {Math.abs(outperformance).toFixed(2)}%{" "}
              {isOutperforming ? "above" : "below"} the benchmark.
            </p>
          </div>
          <div
            className={`text-4xl font-bold ${isOutperforming ? "text-emerald-400" : "text-amber-400"}`}
          >
            {isOutperforming ? "+" : ""}
            {outperformance.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Performance Comparison
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="portfolio"
                fill="#3b82f6"
                name="Your Portfolio"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="benchmark"
                fill="#10b981"
                name="Benchmark"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="market"
                fill="#8b5cf6"
                name="Market Avg"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricBox
          title="Risk-Adjusted Return"
          value="2.15"
          unit="Sharpe Ratio"
          description="Your portfolio's return relative to risk taken"
          color="blue"
        />
        <MetricBox
          title="Win Rate"
          value="68%"
          unit="Success Trades"
          description="Percentage of profitable rebalancing events"
          color="emerald"
        />
        <MetricBox
          title="Maximum Drawdown"
          value="-8.4%"
          unit="Peak to Trough"
          description="Largest peak-to-trough decline observed"
          color="amber"
        />
        <MetricBox
          title="Alpha Generated"
          value="+1.24%"
          unit="Above Benchmark"
          description="Excess return not explained by market movements"
          color="purple"
        />
      </div>

      {/* Bottom Insights */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/10 p-6">
        <h4 className="font-bold text-white mb-3">📊 Analysis Summary</h4>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>
            ✓ Your AI Pilot has successfully rebalanced{" "}
            {outperformance > 0
              ? "and significantly outperformed"
              : "though slightly underperformed"}{" "}
            a buy-and-hold strategy.
          </li>
          <li>
            ✓ Risk management is working well with controlled volatility and
            drawdowns.
          </li>
          <li>
            ✓ The{" "}
            {(riskProfile) => ("conservative" ? "conservative allocation" : "")}{" "}
            approach is protecting capital during market downturns.
          </li>
        </ul>
      </div>
    </div>
  );
};

interface PerformanceCardProps {
  label: string;
  return: number;
  icon: string;
  highlight?: boolean;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  label,
  return: ret,
  icon,
  highlight,
}) => (
  <div
    className={`glass p-6 rounded-2xl ${highlight ? "ring-2 ring-blue-600" : ""}`}
  >
    <p className="text-slate-500 text-xs uppercase tracking-widest mb-2 flex items-center space-x-2">
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </p>
    <div
      className={`text-3xl font-bold ${ret >= 0 ? "text-emerald-400" : "text-rose-400"}`}
    >
      {ret >= 0 ? "+" : ""}
      {ret.toFixed(2)}%
    </div>
  </div>
);

interface MetricBoxProps {
  title: string;
  value: string;
  unit: string;
  description: string;
  color: "blue" | "emerald" | "amber" | "purple";
}

const MetricBox: React.FC<MetricBoxProps> = ({
  title,
  value,
  unit,
  description,
  color,
}) => {
  const colorMap = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    purple: "text-purple-400",
  };

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-white">{title}</h3>
        <span className={`text-sm font-bold ${colorMap[color]}`}>{unit}</span>
      </div>
      <div className={`text-2xl font-bold ${colorMap[color]} mb-2`}>
        {value}
      </div>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
};
