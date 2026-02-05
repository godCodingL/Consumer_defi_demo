import React from "react";

interface MarketAsset {
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  dominance: number;
}

interface MarketAnalysisProps {
  assets: MarketAsset[];
}

export const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ assets }) => {
  const totalMarketCap = assets.reduce((sum, a) => sum + a.marketCap, 0);
  const topGainer = assets.reduce((max, a) =>
    a.change24h > max.change24h ? a : max,
  );
  const topLoser = assets.reduce((min, a) =>
    a.change24h < min.change24h ? a : min,
  );

  return (
    <div className="space-y-6">
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OverviewCard
          title="Total Market Cap"
          value={`$${(totalMarketCap / 1000000000).toFixed(2)}B`}
          change={2.5}
          icon="🌍"
        />
        <OverviewCard
          title="Top Gainer (24h)"
          value={topGainer.symbol}
          change={topGainer.change24h}
          subtext={`${topGainer.change24h > 0 ? "+" : ""}${topGainer.change24h.toFixed(2)}%`}
          color="emerald"
          icon="📈"
        />
        <OverviewCard
          title="Top Loser (24h)"
          value={topLoser.symbol}
          change={topLoser.change24h}
          subtext={`${topLoser.change24h > 0 ? "+" : ""}${topLoser.change24h.toFixed(2)}%`}
          color="rose"
          icon="📉"
        />
      </div>

      {/* Asset Table */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
          Market Assets
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-4 text-slate-500 font-semibold">
                  Asset
                </th>
                <th className="text-right py-3 px-4 text-slate-500 font-semibold">
                  Price
                </th>
                <th className="text-right py-3 px-4 text-slate-500 font-semibold">
                  24h Change
                </th>
                <th className="text-right py-3 px-4 text-slate-500 font-semibold">
                  Market Cap
                </th>
                <th className="text-right py-3 px-4 text-slate-500 font-semibold">
                  Dominance
                </th>
                <th className="text-right py-3 px-4 text-slate-500 font-semibold">
                  Volume
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assets.map((asset) => (
                <tr
                  key={asset.symbol}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 font-semibold text-white">
                    {asset.symbol}
                  </td>
                  <td className="py-4 px-4 text-right font-mono">
                    ${asset.price.toFixed(2)}
                  </td>
                  <td
                    className={`py-4 px-4 text-right font-semibold ${asset.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {asset.change24h >= 0 ? "+" : ""}
                    {asset.change24h.toFixed(2)}%
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-slate-300">
                    ${(asset.marketCap / 1000000).toFixed(0)}M
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                          style={{ width: `${asset.dominance}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500 w-8">
                        {asset.dominance.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-slate-300">
                    ${(asset.volume24h / 1000000).toFixed(1)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard
          title="Market Trend"
          icon="📊"
          content={`The market is showing ${assets.filter((a) => a.change24h > 0).length === assets.length ? "strong bullish" : "mixed"} signals across major assets.`}
          color="blue"
        />
        <InsightCard
          title="Portfolio Opportunity"
          icon="🎯"
          content="Your conservative allocation is well-suited for current market volatility. Consider USDC accumulation on dips."
          color="emerald"
        />
        <InsightCard
          title="Risk Alert"
          icon="⚠️"
          content="Major assets showing elevated volatility. Rebalancing might experience higher slippage."
          color="amber"
        />
        <InsightCard
          title="Network Status"
          icon="🌐"
          content="Flow Network operating at 98% capacity. All systems nominal. Gas prices stable."
          color="emerald"
        />
      </div>
    </div>
  );
};

interface OverviewCardProps {
  title: string;
  value: string;
  change: number;
  subtext?: string;
  color?: "blue" | "emerald" | "rose";
  icon: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  change,
  subtext,
  color = "blue",
  icon,
}) => {
  const colorMap = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    rose: "text-rose-400",
  };

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex justify-between items-start mb-3">
        <span className="text-3xl">{icon}</span>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${change >= 0 ? "bg-emerald-600/20 text-emerald-400" : "bg-rose-600/20 text-rose-400"}`}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(1)}%
        </span>
      </div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-2">
        {title}
      </p>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
      {subtext && <p className="text-xs text-slate-600 mt-2">{subtext}</p>}
    </div>
  );
};

interface InsightCardProps {
  title: string;
  icon: string;
  content: string;
  color: "blue" | "emerald" | "amber" | "rose";
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  icon,
  content,
  color,
}) => {
  const bgColorMap = {
    blue: "bg-blue-600/10 border-blue-600/30",
    emerald: "bg-emerald-600/10 border-emerald-600/30",
    amber: "bg-amber-600/10 border-amber-600/30",
    rose: "bg-rose-600/10 border-rose-600/30",
  };

  const textColorMap = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
  };

  return (
    <div className={`p-6 rounded-2xl border ${bgColorMap[color]}`}>
      <h4
        className={`flex items-center space-x-2 font-bold mb-3 ${textColorMap[color]}`}
      >
        <span className="text-xl">{icon}</span>
        <span>{title}</span>
      </h4>
      <p className="text-sm text-slate-300 leading-relaxed">{content}</p>
    </div>
  );
};
