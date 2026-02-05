import React from 'react';

interface AIAvatarProps {
  performance: number;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({ performance }) => {
  const isHappy = performance >= 0;
  
  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse ${isHappy ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
      
      <svg viewBox="0 0 100 100" className="relative w-full h-full drop-shadow-lg">
        {/* Outer Ring */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/10" />
        
        {/* Robot Head */}
        <rect x="25" y="30" width="50" height="40" rx="10" fill="#1e293b" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
        <rect x="35" y="70" width="30" height="5" fill="#1e293b" />
        
        {/* Antennas */}
        <line x1="35" y1="30" x2="30" y2="20" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
        <line x1="65" y1="30" x2="70" y2="20" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
        <circle cx="30" cy="20" r="3" fill="currentColor" className={isHappy ? 'text-emerald-400' : 'text-rose-400'} />
        <circle cx="70" cy="20" r="3" fill="currentColor" className={isHappy ? 'text-emerald-400' : 'text-rose-400'} />

        {/* Eyes */}
        <g className="animate-pulse">
          {isHappy ? (
            <>
              <circle cx="40" cy="50" r="4" fill="#10b981" />
              <circle cx="60" cy="50" r="4" fill="#10b981" />
            </>
          ) : (
            <>
              <path d="M36 52 L44 48" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
              <path d="M56 48 L64 52" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
            </>
          )}
        </g>

        {/* Mouth/Data Line */}
        <path 
          d={isHappy ? "M40 60 Q50 65 60 60" : "M40 65 Q50 60 60 65"} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className={isHappy ? 'text-emerald-400' : 'text-rose-400'} 
        />
      </svg>
      
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 border border-white/10 rounded-full text-[10px] font-bold tracking-tighter uppercase whitespace-nowrap">
        {isHappy ? 'Bullish Mode' : 'Caution Mode'}
      </div>
    </div>
  );
};