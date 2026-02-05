import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
// Use PilotUser instead of non-existent FlowUser
import { AgentStatus, PilotUser } from '../types';
import { AIAvatar } from './AIAvatar';
import { GrowthTree } from './GrowthTree';

interface DashboardProps {
  // Use PilotUser instead of non-existent FlowUser
  user: PilotUser;
  isAgentStarted: boolean;
  onStartPilot: () => void;
  onRefreshBalances: () => void;
  agentStatus: AgentStatus;
}

const COLORS = ['#3b82f6', '#10b981'];

export const Dashboard: React.FC<DashboardProps> = ({ user, isAgentStarted, onStartPilot, onRefreshBalances, agentStatus }) => {
  const [isLiteMode, setIsLiteMode] = useState(false);
  
  const data = [
    { name: 'FLOW', value: agentStatus.currentAllocation.FLOW },
    { name: 'USDC', value: agentStatus.currentAllocation.USDC },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Portfolio Stats */}
      <div className="lg:col-span-2 space-y-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <AIAvatar performance={agentStatus.performance24h} />
            <div>
              <h2 className="text-2xl font-bold text-white">Pilot Overview</h2>
              <p className="text-slate-400 text-sm">Autonomous since {new Date(agentStatus.lastCheck).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setIsLiteMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!isLiteMode ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              Pro Charts
            </button>
            <button 
              onClick={() => setIsLiteMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isLiteMode ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
            >
              Lite View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Value" value="$12,450.00" change={`${agentStatus.performance24h >= 0 ? '+' : ''}${agentStatus.performance24h}%`} />
          <StatCard title="Current Drift" value={`${agentStatus.drift.toFixed(2)}%`} color={agentStatus.drift > 1 ? 'text-amber-400' : 'text-emerald-400'} />
          <StatCard title="Health Score" value="98/100" />
        </div>

        {isLiteMode ? (
          <div className="glass p-8 rounded-3xl min-h-[400px]">
            <GrowthTree value={12450} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Live Allocation
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-8 mt-4">
                {data.map((item, idx) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                    <span className="text-sm font-medium">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                On-Chain Balances
              </h3>
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">FLOW Token</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg">
                      <img src="https://cryptologos.cc/logos/flow-flow-logo.png" className="w-6 h-6" alt="Flow" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold mono leading-tight">
                        {user.balances?.FLOW.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) || '0.00'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">USDC Stablecoin</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                      <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" className="w-6 h-6" alt="USDC" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold mono leading-tight">
                        {user.balances?.USDC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={onRefreshBalances}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors border-t border-white/5 mt-2 flex items-center justify-center space-x-2"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Sync On-Chain</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="space-y-6">
        <div className={`p-6 rounded-2xl border transition-all duration-500 ${isAgentStarted ? 'border-emerald-500/50 bg-emerald-500/5 glow-green' : 'border-blue-500/50 bg-blue-500/5'}`}>
          <h3 className="text-xl font-bold mb-2">AI Pilot Control</h3>
          <p className="text-slate-400 text-sm mb-6">
            When enabled, Lit Protocol PKPs and Flow Native Scheduling will monitor your portfolio 24/7.
          </p>
          
          <button
            onClick={onStartPilot}
            disabled={isAgentStarted}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-2 ${
              isAgentStarted 
              ? 'bg-emerald-600 text-white cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
            }`}
          >
            {isAgentStarted ? (
              <>
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <span>Pilot Active</span>
              </>
            ) : (
              <span>Engage AI Pilot</span>
            )}
          </button>
        </div>

        <div className="glass p-6 rounded-2xl">
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest text-slate-500">Security Parameters</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span className="text-slate-400">Policy:</span>
              <span className="text-emerald-400 font-medium">Conservative Rebalance</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Execution:</span>
              <span className="text-emerald-400 font-medium">Flow Native Scheduler</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Guardian:</span>
              <span className="text-emerald-400 font-medium">Lit PKP Agent #219</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Did you know?</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your Pilot rebalanced your USDC position 2 hours ago while you were offline, saving you $4.20 in potential drift.
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, color }: { title: string; value: string; change?: string; color?: string }) => (
  <div className="glass p-6 rounded-2xl">
    <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-baseline space-x-2">
      <h4 className={`text-2xl font-bold ${color || 'text-white'}`}>{value}</h4>
      {change && <span className={change.startsWith('+') ? "text-emerald-400 text-xs font-medium" : "text-rose-400 text-xs font-medium"}>{change}</span>}
    </div>
  </div>
);
