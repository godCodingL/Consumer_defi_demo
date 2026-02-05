import React from "react";
import { RiskProfile } from "../hooks/useRiskProfile";

interface RiskProfilerProps {
  riskProfile: RiskProfile;
  onUpdate: (profile: Partial<RiskProfile>) => void;
  riskScore: number;
}

export const RiskProfiler: React.FC<RiskProfilerProps> = ({
  riskProfile,
  onUpdate,
  riskScore,
}) => {
  return (
    <div className="space-y-6">
      {/* Risk Level Selection */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Risk Profile
        </h3>

        <div className="space-y-4 mb-6">
          {(["conservative", "moderate", "aggressive"] as const).map(
            (level) => (
              <label
                key={level}
                className="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all"
                style={{
                  borderColor:
                    riskProfile.riskLevel === level
                      ? "rgb(59, 130, 246)"
                      : "rgba(255, 255, 255, 0.1)",
                  backgroundColor:
                    riskProfile.riskLevel === level
                      ? "rgba(59, 130, 246, 0.1)"
                      : "rgba(255, 255, 255, 0.02)",
                }}
              >
                <input
                  type="radio"
                  name="riskLevel"
                  value={level}
                  checked={riskProfile.riskLevel === level}
                  onChange={(e) =>
                    onUpdate({ riskLevel: e.target.value as any })
                  }
                  className="w-4 h-4 mr-4"
                />
                <div className="flex-1">
                  <div className="font-semibold text-white capitalize">
                    {level}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {level === "conservative"
                      ? "Prioritize capital preservation with minimal volatility"
                      : level === "moderate"
                        ? "Balance growth and stability with moderate rebalancing"
                        : "Maximize growth potential with active trading"}
                  </p>
                </div>
                <div className="text-right">
                  {level === "conservative" && (
                    <RiskBadge level="Low" color="emerald" />
                  )}
                  {level === "moderate" && (
                    <RiskBadge level="Med" color="amber" />
                  )}
                  {level === "aggressive" && (
                    <RiskBadge level="High" color="rose" />
                  )}
                </div>
              </label>
            ),
          )}
        </div>

        {/* Risk Score */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-300">
              Overall Risk Score
            </span>
            <span className="text-xl font-bold text-blue-400">
              {riskScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-rose-500 h-2 rounded-full transition-all"
              style={{ width: `${riskScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Advanced Parameters */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
          Advanced Parameters
        </h3>

        <div className="space-y-6">
          <ParameterSlider
            label="Maximum Drift Tolerance"
            value={riskProfile.maxDrift}
            min={1}
            max={10}
            unit="%"
            description="Rebalance when portfolio allocation drifts beyond this threshold"
            onChange={(value) => onUpdate({ maxDrift: value })}
          />

          <ParameterSlider
            label="Rebalance Trigger Threshold"
            value={riskProfile.rebalanceThreshold}
            min={1}
            max={5}
            unit="%"
            description="Automatically trigger rebalancing at this allocation deviation"
            onChange={(value) => onUpdate({ rebalanceThreshold: value })}
          />

          <ParameterSlider
            label="Maximum Slippage"
            value={riskProfile.maxSlippage}
            min={0.1}
            max={2}
            step={0.1}
            unit="%"
            description="Maximum acceptable price slippage on swaps"
            onChange={(value) => onUpdate({ maxSlippage: value })}
          />

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div className="font-semibold text-white">
                Allow High Volatility Assets
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Include emerging tokens in rebalancing strategy
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={riskProfile.allowHighVolatility}
                onChange={(e) =>
                  onUpdate({ allowHighVolatility: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Risk Warnings */}
      <div className="p-4 rounded-xl bg-amber-600/10 border border-amber-600/30">
        <div className="flex items-start space-x-3">
          <div className="text-sm font-semibold text-amber-400 mt-1">⚠️</div>
          <div className="text-sm text-amber-200">
            Your current settings prioritize {riskProfile.riskLevel} risk
            management. The AI Pilot will respect these constraints when making
            portfolio adjustments. No transactions occur without your explicit
            approval.
          </div>
        </div>
      </div>
    </div>
  );
};

interface RiskBadgeProps {
  level: string;
  color: "emerald" | "amber" | "rose";
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, color }) => {
  const colorMap = {
    emerald: "bg-emerald-600/20 text-emerald-400",
    amber: "bg-amber-600/20 text-amber-400",
    rose: "bg-rose-600/20 text-rose-400",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-bold ${colorMap[color]}`}
    >
      {level}
    </span>
  );
};

interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  description: string;
  onChange: (value: number) => void;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  description,
  onChange,
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <div>
        <div className="font-semibold text-white text-sm">{label}</div>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-blue-400">
          {value.toFixed(step === 1 ? 0 : 1)}
          {unit}
        </div>
      </div>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
    />
  </div>
);
