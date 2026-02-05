import React from 'react';

interface GrowthTreeProps {
  value: number; // Total value determines size
}

export const GrowthTree: React.FC<GrowthTreeProps> = ({ value }) => {
  // Calculate scale based on portfolio value, normalized between 0.6 and 1.4
  const scale = Math.min(1.4, Math.max(0.6, value / 12000));
  
  return (
    <div className="flex flex-col items-center justify-center p-8 h-full bg-gradient-to-t from-emerald-500/10 via-emerald-500/5 to-transparent rounded-3xl relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full animate-pulse"></div>
      
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1.5deg); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 0.95; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .tree-sway {
          transform-origin: bottom center;
          animation: sway 6s ease-in-out infinite;
        }
        .leaf-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
        .leaf-delayed {
          animation-delay: 1.5s;
        }
        .leaf-fast {
          animation-duration: 3s;
        }
      `}</style>

      <div className="relative transition-all duration-1000 ease-out" style={{ transform: `scale(${scale})` }}>
        <svg width="240" height="280" viewBox="0 0 200 240" className="tree-sway">
          {/* Trunk with slight gradient feel */}
          <path d="M92 240 L108 240 L103 150 L97 150 Z" fill="#27272a" />
          <path d="M95 180 L80 160" stroke="#27272a" strokeWidth="4" strokeLinecap="round" />
          <path d="M105 170 L120 155" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
          
          {/* Leaves - Lower Tier (Movement) */}
          <g className="leaf-breathe">
            <circle cx="100" cy="140" r="42" fill="#059669" fillOpacity="0.8" />
            <circle cx="65" cy="165" r="32" fill="#047857" fillOpacity="0.75" className="leaf-delayed" />
            <circle cx="135" cy="165" r="32" fill="#047857" fillOpacity="0.75" />
          </g>
          
          {/* Leaves - Upper Tier (Growth) */}
          <g className="leaf-breathe leaf-delayed">
            <circle cx="100" cy="95" r="35" fill="#10b981" fillOpacity="0.9" />
            <circle cx="80" cy="105" r="24" fill="#34d399" fillOpacity="0.85" />
            <circle cx="120" cy="105" r="24" fill="#34d399" fillOpacity="0.85" className="leaf-fast" />
          </g>
          
          {/* Top Bud - Core Savings Indicator */}
          <g className="animate-pulse">
            <circle cx="100" cy="65" r="12" fill="#6ee7b7" />
            <circle cx="100" cy="65" r="18" stroke="#6ee7b7" strokeWidth="1" fill="none" className="animate-ping opacity-20" />
          </g>
          
          {/* Ground / Roots area */}
          <ellipse cx="100" cy="238" rx="70" ry="6" fill="white" fillOpacity="0.03" />
        </svg>
        
        {/* Floating Particles to simulate environment */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute w-1 h-1 bg-emerald-400/40 rounded-full blur-[1px]" style={{ top: '20%', left: '30%', animation: 'float 4s infinite' }}></div>
          <div className="absolute w-1.5 h-1.5 bg-blue-400/30 rounded-full blur-[1px]" style={{ top: '40%', right: '20%', animation: 'float 5s infinite 1s' }}></div>
          <div className="absolute w-1 h-1 bg-emerald-300/40 rounded-full blur-[1px]" style={{ top: '10%', right: '40%', animation: 'float 3.5s infinite 0.5s' }}></div>
        </div>
      </div>

      <div className="mt-12 text-center z-10">
        <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Stable Growth</span>
        </div>
        <h4 className="text-3xl font-black text-white tracking-tight mb-2">Portfolio Forest</h4>
        <p className="text-slate-400 text-sm max-w-[240px] leading-relaxed">
          Your wealth is a living ecosystem, rebalancing {Math.floor(value / 1000)}x per month.
        </p>
      </div>
    </div>
  );
};