import React, { useState } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { Onboarding } from "./components/Onboarding";
import { DecisionLog } from "./components/DecisionLog";
import { SocialCircle } from "./components/SocialCircle";
import { PortfolioAnalytics } from "./components/PortfolioAnalytics";
import { RiskProfiler } from "./components/RiskProfiler";
import { RebalanceRecommendations } from "./components/RebalanceRecommendations";
import {
  TransactionHistory,
  Transaction,
} from "./components/TransactionHistory";
import { Settings } from "./components/Settings";
import { MarketAnalysis } from "./components/MarketAnalysis";
import { AIRecommendations } from "./components/AIRecommendations";
import { useWallets } from "./hooks/useWallets";
import { useLitAgent } from "./hooks/useLitAgent";
import { usePriceFeed } from "./hooks/usePriceFeed";
import {
  useRiskProfile,
  generateRebalanceRecommendations,
} from "./hooks/useRiskProfile";

const App: React.FC = () => {
  const {
    user,
    loginFlow,
    loginEVM,
    logout,
    isAgentStarted,
    startPilot,
    refreshBalances,
    loading,
  } = useWallets();

  const { agentStatus, decisionLogs } = useLitAgent(isAgentStarted);
  const { prices, priceHistory, getPrice } = usePriceFeed();
  const { riskProfile, updateRiskProfile, getRiskScore } = useRiskProfile();

  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "logs"
    | "social"
    | "analytics"
    | "risk"
    | "transactions"
    | "settings"
    | "market"
    | "ai-recommendations"
  >("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "rebalance",
      fromAsset: "FLOW",
      toAsset: "USDC",
      fromAmount: 5,
      toAmount: 12.25,
      timestamp: Date.now() - 3600000,
      txHash: "0x1234567890abcdef",
      status: "completed",
      gasFee: 2.5,
      chain: "flow",
    },
  ]);

  const [appSettings, setAppSettings] = useState({
    autoRebalance: true,
    notificationsEnabled: true,
    darkMode: true,
    showAdvancedMetrics: true,
    refreshInterval: 15,
    maxGasPrice: 10,
    preferredNetwork: "all" as const,
  });

  const [marketAssets] = useState([
    {
      symbol: "FLOW",
      price: getPrice("FLOW"),
      change24h: 3.2,
      marketCap: 625000000,
      volume24h: 45000000,
      dominance: 0.8,
    },
    {
      symbol: "USDC",
      price: 1.0,
      change24h: 0.01,
      marketCap: 35000000000,
      volume24h: 2500000000,
      dominance: 45.2,
    },
    {
      symbol: "ETH",
      price: 2845.5,
      change24h: 2.1,
      marketCap: 342000000000,
      volume24h: 18500000000,
      dominance: 19.5,
    },
    {
      symbol: "BTC",
      price: 98450.0,
      change24h: 1.5,
      marketCap: 1950000000000,
      volume24h: 38200000000,
      dominance: 32.1,
    },
  ]);

  const [aiRecommendations] = useState([
    {
      id: "1",
      title: "Increase USDC Position",
      description:
        "Market volatility is elevated. Increase stablecoin allocation for capital efficiency.",
      action: "Buy 100 USDC at market",
      confidence: 0.85,
      impact: "high" as const,
      timeframe: "Next 24h",
      reasoning:
        "The Bollinger Bands suggest we're near resistance levels. Increasing USDC position now allows us to buy on dips.",
    },
    {
      id: "2",
      title: "Monitor FLOW/USDC Ratio",
      description:
        "FLOW showing technical strength. Maintain current ratio and wait for confirmation.",
      action: "Hold current position",
      confidence: 0.72,
      impact: "medium" as const,
      timeframe: "Next 48h",
      reasoning:
        "RSI indicates neutral momentum. No action required unless we see volume confirmation above 2.50.",
    },
    {
      id: "3",
      title: "Optimize Gas Fees",
      description:
        "Network congestion decreasing. Now is a good time for rebalancing transactions.",
      action: "Execute pending rebalances",
      confidence: 0.62,
      impact: "low" as const,
      timeframe: "Next 12h",
      reasoning:
        "Gas prices dropped 35% from average. This is an optimal window for any pending swaps.",
    },
  ]);

  if (!user?.loggedIn) {
    return <Onboarding onLoginFlow={loginFlow} onLoginEVM={loginEVM} />;
  }

  const totalValue =
    (user.balances?.FLOW || 0) * getPrice("FLOW") +
    (user.balances?.USDC || 0) * getPrice("USDC");
  const dayChangePercent =
    (Object.values(prices).reduce((sum, p) => sum + p.change24h, 0) /
      Object.keys(prices).length) *
    0.5;
  const dayChange = totalValue * (dayChangePercent / 100);
  const monthChange = dayChange * 4; // Approximate

  const recommendations = generateRebalanceRecommendations(
    agentStatus.currentAllocation,
    agentStatus.targetAllocation,
    { FLOW: getPrice("FLOW"), USDC: getPrice("USDC") },
    riskProfile,
  );

  const handleExecuteRebalance = (recommendation: any) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      type: "swap",
      fromAsset: recommendation.symbol,
      toAsset: recommendation.symbol === "FLOW" ? "USDC" : "FLOW",
      fromAmount: recommendation.amount,
      toAmount: recommendation.amount * getPrice(recommendation.symbol),
      timestamp: Date.now(),
      txHash: "0x" + Math.random().toString(16).slice(2),
      status: "completed",
      gasFee: Math.random() * 3 + 1.5,
      chain: "flow",
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 flex flex-col">
      <Header user={user} onLogout={logout} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-2 mb-8 bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto pb-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: "📊" },
            { id: "analytics", label: "Analytics", icon: "📈" },
            { id: "market", label: "Market", icon: "🌍" },
            { id: "ai-recommendations", label: "AI Tips", icon: "🤖" },
            { id: "risk", label: "Risk", icon: "⚖️" },
            { id: "transactions", label: "Txns", icon: "💸" },
            { id: "logs", label: "Journal", icon: "📔" },
            { id: "social", label: "Circle", icon: "👥" },
            { id: "settings", label: "Settings", icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <Dashboard
            user={user}
            isAgentStarted={isAgentStarted}
            onStartPilot={startPilot}
            onRefreshBalances={refreshBalances}
            agentStatus={agentStatus}
          />
        )}

        {activeTab === "analytics" && (
          <PortfolioAnalytics
            totalValue={totalValue}
            dayChange={dayChange}
            dayChangePercent={dayChangePercent}
            monthChange={monthChange}
            priceHistory={priceHistory}
            volatility={0.18}
            sharpeRatio={1.45}
            maxDrawdown={-0.12}
          />
        )}

        {activeTab === "risk" && (
          <RiskProfiler
            riskProfile={riskProfile}
            onUpdate={updateRiskProfile}
            riskScore={getRiskScore()}
          />
        )}

        {activeTab === "market" && <MarketAnalysis assets={marketAssets} />}

        {activeTab === "ai-recommendations" && (
          <AIRecommendations
            recommendations={aiRecommendations}
            onApply={(rec) => console.log("Applying recommendation:", rec)}
          />
        )}

        {activeTab === "transactions" && (
          <TransactionHistory transactions={transactions} />
        )}

        {activeTab === "logs" && <DecisionLog logs={decisionLogs} />}

        {activeTab === "social" && <SocialCircle />}

        {activeTab === "settings" && (
          <Settings
            settings={appSettings}
            onUpdate={(newSettings) =>
              setAppSettings((prev) => ({ ...prev, ...newSettings }))
            }
          />
        )}

        {/* Rebalance Recommendations - Always show banner when available */}
        {recommendations.length > 0 && activeTab !== "risk" && (
          <div className="fixed bottom-8 right-8 z-40 max-w-md">
            <div className="glass p-4 rounded-2xl border border-emerald-600/50 bg-emerald-600/5 shadow-xl shadow-emerald-600/20">
              <div className="text-sm font-semibold text-emerald-400 mb-2">
                ⚖️ Rebalancing Opportunity
              </div>
              <p className="text-xs text-emerald-200 mb-3">
                Your portfolio has drifted. {recommendations.length} action(s)
                recommended.
              </p>
              <button
                onClick={() => setActiveTab("risk")}
                className="w-full px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-500 transition-all"
              >
                Review Recommendations →
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-slate-500 text-sm">
        <div className="flex justify-center space-x-4 mb-2">
          <span className="px-2 py-0.5 rounded border border-white/10 text-[10px] uppercase tracking-widest">
            Multi-Chain Enabled
          </span>
          <span className="px-2 py-0.5 rounded border border-white/10 text-[10px] uppercase tracking-widest">
            Lit Vincent SDK
          </span>
          <span className="px-2 py-0.5 rounded border border-white/10 text-[10px] uppercase tracking-widest">
            AI Agent Active
          </span>
        </div>
        Portfolio Pilot &copy; 2024 • PL_Genesis Hackathon Deliverable
      </footer>

      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="text-center p-8 glass rounded-3xl border-white/10 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Syncing with Flight Control...
            </h2>
            <p className="text-slate-400 mt-2 font-medium">
              Authenticating secure multi-chain wallet
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
