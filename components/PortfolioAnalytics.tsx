import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { PriceHistory } from "../hooks/usePriceFeed";

interface PortfolioAnalyticsProps {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  monthChange: number;
  priceHistory: Record<string, PriceHistory[]>;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export const PortfolioAnalytics: React.FC<PortfolioAnalyticsProps> = ({
  totalValue,
  dayChange,
  dayChangePercent,
  monthChange,
  priceHistory,
  volatility,
  sharpeRatio,
  maxDrawdown,
}) => {
  // Convert price history to portfolio value history
  const flowHistory = priceHistory.FLOW || [];
  const usdcHistory = priceHistory.USDC || [];

  // Combine to create portfolio value timeline
  const portfolioHistory = flowHistory.map((flow, idx) => {
    const usdc = usdcHistory[idx];
    const flowValue = flow.price * 50; // Assuming 50 FLOW in portfolio
    const usdcValue = (usdc?.price || 1) * 1000; // Assuming 1000 USDC
    return {
      timestamp: flow.timestamp,
      value: flowValue + usdcValue,
      time: new Date(flow.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Portfolio Value"
          value={`$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={`${dayChange >= 0 ? "+" : ""}$${dayChange.toFixed(2)}`}
          changePercent={dayChangePercent}
        />
        <MetricCard
          label="Volatility"
          value={`${(volatility * 100).toFixed(2)}%`}
          subtext="30-day annualized"
          color="text-blue-400"
        />
        <MetricCard
          label="Sharpe Ratio"
          value={sharpeRatio.toFixed(2)}
          subtext="Risk-adjusted return"
          color={sharpeRatio > 1 ? "text-emerald-400" : "text-amber-400"}
        />
        <MetricCard
          label="Max Drawdown"
          value={`${(maxDrawdown * 100).toFixed(2)}%`}
          subtext="Peak to trough"
          color="text-rose-400"
        />
      </div>

      {/* Portfolio Value Chart */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
          Portfolio Value Timeline
        </h3>
        {portfolioHistory.length > 1 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioHistory}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-500">
            Loading price data...
          </div>
        )}
      </div>

      {/* Asset Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AssetPerformanceCard
          symbol="FLOW"
          change={dayChangePercent * 0.6}
          monthChange={monthChange * 0.6}
        />
        <AssetPerformanceCard symbol="USDC" change={0.01} monthChange={0.05} />
      </div>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changePercent?: number;
  subtext?: string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  changePercent,
  subtext,
  color,
}) => (
  <div className="glass p-4 rounded-2xl">
    <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-2">
      {label}
    </p>
    <div className={`text-xl font-bold ${color || "text-white"}`}>{value}</div>
    {change && (
      <div
        className={`text-xs font-medium mt-1 ${changePercent && changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}
      >
        {change} ({changePercent?.toFixed(2)}%)
      </div>
    )}
    {subtext && <p className="text-[10px] text-slate-500 mt-1">{subtext}</p>}
  </div>
);

interface AssetPerformanceCardProps {
  symbol: string;
  change: number;
  monthChange: number;
}

const AssetPerformanceCard: React.FC<AssetPerformanceCardProps> = ({
  symbol,
  change,
  monthChange,
}) => (
  <div className="glass p-6 rounded-2xl">
    <div className="flex justify-between items-start mb-4">
      <h4 className="font-semibold text-white">{symbol}</h4>
      <span
        className={`text-xs font-bold px-2 py-1 rounded-full ${change >= 0 ? "bg-emerald-600/20 text-emerald-400" : "bg-rose-600/20 text-rose-400"}`}
      >
        {change >= 0 ? "+" : ""}
        {change.toFixed(2)}%
      </span>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-slate-400">
        <span>24h Change:</span>
        <span className={change >= 0 ? "text-emerald-400" : "text-rose-400"}>
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      </div>
      <div className="flex justify-between text-slate-400">
        <span>30d Change:</span>
        <span
          className={monthChange >= 0 ? "text-emerald-400" : "text-rose-400"}
        >
          {monthChange >= 0 ? "+" : ""}
          {monthChange.toFixed(2)}%
        </span>
      </div>
    </div>
  </div>
);
