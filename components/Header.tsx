import React from 'react';
import { PilotUser } from '../types';

interface HeaderProps {
  user: PilotUser;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const getWalletIcon = () => {
    switch (user.walletType) {
      case 'flow': return 'https://cryptologos.cc/logos/flow-flow-logo.png';
      case 'metamask': return 'https://cryptologos.cc/logos/metamask-mask-logo.png';
      case 'fantom': return 'https://cryptologos.cc/logos/fantom-ftm-logo.png';
      default: return null;
    }
  };

  return (
    <nav className="border-b border-white/10 glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">P</div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Portfolio Pilot
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  {user.walletType} Network
                </span>
                {getWalletIcon() && <img src={getWalletIcon()!} className="w-3 h-3 grayscale opacity-50" alt="Net" />}
              </div>
              <span className="mono text-sm text-blue-400">{user.addr?.slice(0, 6)}...{user.addr?.slice(-4)}</span>
            </div>
            <button 
              onClick={onLogout}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/5 transition-all active:scale-95"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};