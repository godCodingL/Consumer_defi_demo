import React from 'react';
import { SocialEntry } from '../types';

export const SocialCircle: React.FC = () => {
  const friends: SocialEntry[] = [
    { id: '1', name: 'FlowEnthusiast', avatar: '🌊', growth: 12.5, rank: 1 },
    { id: '2', name: 'DeFi_Daisy', avatar: '🌼', growth: 8.2, rank: 2 },
    { id: '3', name: 'CryptoCarl', avatar: '🧔', growth: 5.1, rank: 3 },
    { id: '4', name: 'BlockExplorer', avatar: '🧭', growth: -1.2, rank: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-3xl">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Pilot Circle Leaderboard
        </h3>
        <div className="space-y-4">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-500/20 rounded-full text-lg">
                  {friend.avatar}
                </div>
                <div>
                  <div className="font-bold text-slate-200">{friend.name}</div>
                  <div className="text-xs text-slate-500">Rank #{friend.rank}</div>
                </div>
              </div>
              <div className={`font-mono font-bold ${friend.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {friend.growth >= 0 ? '+' : ''}{friend.growth}%
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="glass p-6 rounded-3xl bg-blue-600/10 border-blue-600/20">
        <p className="text-sm text-slate-400 italic text-center">
          "Your circle rebalanced 14 times this week automatically."
        </p>
      </div>
    </div>
  );
};