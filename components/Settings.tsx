import React, { useState } from "react";

interface Settings {
  autoRebalance: boolean;
  notificationsEnabled: boolean;
  darkMode: boolean;
  showAdvancedMetrics: boolean;
  refreshInterval: number;
  maxGasPrice: number;
  preferredNetwork: "flow" | "ethereum" | "fantom" | "all";
}

interface SettingsProps {
  settings: Settings;
  onUpdate: (settings: Partial<Settings>) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  return (
    <div className="glass p-6 rounded-3xl border border-white/10 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-8 flex items-center space-x-2">
        <svg
          className="w-6 h-6 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>Settings & Preferences</span>
      </h3>

      <div className="space-y-8">
        {/* Automation */}
        <section>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Automation</span>
          </h4>
          <div className="space-y-4">
            <ToggleSetting
              label="Enable Auto-Rebalance"
              description="Automatically rebalance portfolio when drift exceeds threshold"
              enabled={settings.autoRebalance}
              onChange={(value) => onUpdate({ autoRebalance: value })}
            />
            <div className="text-sm text-slate-400 p-3 rounded-lg bg-white/5 border border-white/10">
              ⚠️ When enabled, your AI Pilot can execute swaps without explicit
              approval. Set risk profile carefully.
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span>Notifications</span>
          </h4>
          <div className="space-y-4">
            <ToggleSetting
              label="Enable Notifications"
              description="Get alerts for portfolio changes, price movements, and alerts"
              enabled={settings.notificationsEnabled}
              onChange={(value) => onUpdate({ notificationsEnabled: value })}
            />
            {settings.notificationsEnabled && (
              <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10">
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-slate-300">
                    Large price movements (&gt;5%)
                  </span>
                </label>
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-slate-300">Rebalancing events</span>
                </label>
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-slate-300">High gas prices</span>
                </label>
              </div>
            )}
          </div>
        </section>

        {/* Display */}
        <section>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span>Display</span>
          </h4>
          <div className="space-y-4">
            <ToggleSetting
              label="Dark Mode"
              description="Use dark color scheme (currently enforced)"
              enabled={settings.darkMode}
              onChange={(value) => onUpdate({ darkMode: value })}
              disabled={true}
            />
            <ToggleSetting
              label="Show Advanced Metrics"
              description="Display Sharpe Ratio, Volatility, and Max Drawdown"
              enabled={settings.showAdvancedMetrics}
              onChange={(value) => onUpdate({ showAdvancedMetrics: value })}
            />
          </div>
        </section>

        {/* Network Settings */}
        <section>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            <span>Network Settings</span>
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Preferred Network
              </label>
              <select
                value={settings.preferredNetwork}
                onChange={(e) =>
                  onUpdate({ preferredNetwork: e.target.value as any })
                }
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white cursor-pointer"
              >
                <option value="all">All Networks (Recommended)</option>
                <option value="flow">Flow Only</option>
                <option value="ethereum">Ethereum Only</option>
                <option value="fantom">Fantom Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3 flex items-center justify-between">
                <span>Data Refresh Interval</span>
                <span className="text-blue-400 text-sm font-mono">
                  {settings.refreshInterval}s
                </span>
              </label>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={settings.refreshInterval}
                onChange={(e) =>
                  onUpdate({ refreshInterval: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer slider"
              />
              <p className="text-xs text-slate-500 mt-2">
                How often to fetch latest prices and balances
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3 flex items-center justify-between">
                <span>Max Gas Price Tolerance</span>
                <span className="text-blue-400 text-sm font-mono">
                  ${settings.maxGasPrice.toFixed(2)}
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={settings.maxGasPrice}
                onChange={(e) =>
                  onUpdate({ maxGasPrice: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer slider"
              />
              <p className="text-xs text-slate-500 mt-2">
                Skip rebalancing if gas fees exceed this amount
              </p>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
            <span>Data & Export</span>
          </h4>
          <div className="space-y-3">
            <button
              onClick={() => setIsImportExportOpen(!isImportExportOpen)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all text-sm"
            >
              {isImportExportOpen
                ? "✕ Hide Options"
                : "⬇ Export Portfolio Data"}
            </button>

            {isImportExportOpen && (
              <div className="space-y-2 p-4 rounded-lg bg-white/5 border border-white/10">
                <button className="w-full px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-sm font-medium transition-all">
                  📥 Export as JSON
                </button>
                <button className="w-full px-3 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-sm font-medium transition-all">
                  📊 Export as CSV
                </button>
                <button className="w-full px-3 py-2 rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 text-sm font-medium transition-all">
                  📋 Copy Portfolio Summary
                </button>
              </div>
            )}
          </div>
        </section>

        {/* About */}
        <section className="p-4 rounded-lg bg-gradient-to-r from-blue-600/10 to-emerald-600/10 border border-white/10">
          <h4 className="text-sm font-bold text-blue-400 mb-2">
            About Portfolio Pilot
          </h4>
          <div className="text-xs text-slate-400 space-y-1">
            <div>Version: 1.0.0 (Production)</div>
            <div>Chain: Flow Testnet + EVM Compatible</div>
            <div>Last Updated: {new Date().toLocaleDateString()}</div>
            <div className="mt-2">
              <a href="#privacy" className="text-blue-400 hover:text-blue-300">
                Privacy Policy
              </a>
              {" • "}
              <a href="#terms" className="text-blue-400 hover:text-blue-300">
                Terms of Service
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

interface ToggleSettingProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({
  label,
  description,
  enabled,
  onChange,
  disabled = false,
}) => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
    <div>
      <div className="font-semibold text-white text-sm">{label}</div>
      <p className="text-xs text-slate-400 mt-1">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
    </label>
  </div>
);
