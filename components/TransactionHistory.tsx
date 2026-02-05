import React, { useState } from "react";

export interface Transaction {
  id: string;
  type: "swap" | "deposit" | "withdraw" | "rebalance";
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  timestamp: number;
  txHash: string;
  status: "completed" | "pending" | "failed";
  gasFee: number;
  chain: "flow" | "ethereum" | "fantom";
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
}) => {
  const [filter, setFilter] = useState<
    "all" | "swap" | "rebalance" | "deposit" | "withdraw"
  >("all");

  const filteredTxs =
    filter === "all"
      ? transactions
      : transactions.filter((tx) => tx.type === filter);

  const totalVolume = transactions.reduce((sum, tx) => sum + tx.toAmount, 0);
  const successfulTxs = transactions.filter(
    (tx) => tx.status === "completed",
  ).length;
  const totalGasPaid = transactions.reduce((sum, tx) => sum + tx.gasFee, 0);

  return (
    <div className="glass p-6 rounded-3xl border border-white/10">
      <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
        <svg
          className="w-5 h-5 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span>Transaction History</span>
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatBox label="Total Transactions" value={transactions.length} />
        <StatBox
          label="Successful"
          value={successfulTxs}
          color="text-emerald-400"
        />
        <StatBox
          label="Total Gas Paid"
          value={`$${totalGasPaid.toFixed(2)}`}
          color="text-amber-400"
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {(["all", "swap", "rebalance", "deposit", "withdraw"] as const).map(
          (filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all capitalize ${
                filter === filterType
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {filterType}
            </button>
          ),
        )}
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredTxs.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <div className="text-3xl mb-2">📜</div>
            <p>No {filter !== "all" ? filter : ""} transactions yet</p>
          </div>
        ) : (
          filteredTxs.map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} />
          ))
        )}
      </div>
    </div>
  );
};

interface StatBoxProps {
  label: string;
  value: string | number;
  color?: string;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, color }) => (
  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className={`font-bold text-lg ${color || "text-white"}`}>{value}</p>
  </div>
);

interface TransactionRowProps {
  transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "swap":
        return "⇌";
      case "rebalance":
        return "⚖️";
      case "deposit":
        return "⬆️";
      case "withdraw":
        return "⬇️";
      default:
        return "◆";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-600/20 text-emerald-400";
      case "pending":
        return "bg-amber-600/20 text-amber-400";
      case "failed":
        return "bg-rose-600/20 text-rose-400";
      default:
        return "bg-slate-600/20 text-slate-400";
    }
  };

  const chainIcons: Record<string, string> = {
    flow: "🌊",
    ethereum: "⟠",
    fantom: "👻",
  };

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Icon */}
          <div className="text-2xl mt-1">{getTypeIcon(transaction.type)}</div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-bold text-white capitalize">
                {transaction.type}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(transaction.status)}`}
              >
                {transaction.status}
              </span>
              <span className="text-[10px] text-slate-500">
                {chainIcons[transaction.chain]}
              </span>
            </div>

            <div className="text-sm text-slate-400 mb-2">
              {transaction.fromAmount.toFixed(4)} {transaction.fromAsset} →{" "}
              <span className="text-emerald-400 font-semibold">
                {transaction.toAmount.toFixed(4)} {transaction.toAsset}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-[10px] text-slate-600">
              <span>{new Date(transaction.timestamp).toLocaleString()}</span>
              <span>Gas: ${transaction.gasFee.toFixed(2)}</span>
              <a
                href={`#tx-${transaction.txHash}`}
                className="text-blue-400 hover:text-blue-300 font-mono truncate"
              >
                {transaction.txHash.slice(0, 8)}...
              </a>
            </div>
          </div>
        </div>

        {/* Amount Badge */}
        <div className="text-right ml-4">
          <div className="font-bold text-emerald-400">
            ${(transaction.toAmount * 1.5).toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-600">USD</div>
        </div>
      </div>
    </div>
  );
};
