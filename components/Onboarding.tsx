import React from 'react';

interface OnboardingProps {
  onLoginFlow: () => void;
  onLoginEVM: (type: 'metamask' | 'fantom') => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onLoginFlow, onLoginEVM }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black">
      <div className="max-w-md w-full space-y-8 glass p-10 rounded-3xl border-white/10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-600/30">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Portfolio Pilot</h1>
          <p className="text-slate-400">Autonomous DeFi management across ecosystems.</p>
        </div>

        <div className="space-y-4 pt-4">
          <button
            onClick={onLoginFlow}
            className="w-full bg-[#00ef8b] text-black font-bold py-4 rounded-xl flex items-center justify-center space-x-3 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[#00ef8b]/20"
          >
            <img src="https://cryptologos.cc/logos/flow-flow-logo.png" className="w-6 h-6" alt="Flow" />
            <span>Connect Flow Wallet</span>
          </button>
          
          <button
            onClick={() => onLoginEVM('metamask')}
            className="w-full bg-[#f6851b] text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-3 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[#f6851b]/20"
          >
            <img src="https://cryptologos.cc/logos/metamask-mask-logo.png" className="w-6 h-6" alt="MetaMask" />
            <span>Connect MetaMask</span>
          </button>

          <button
            onClick={() => onLoginEVM('fantom')}
            className="w-full bg-[#1969ff] text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-3 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[#1969ff]/20"
          >
            <img src="https://cryptologos.cc/logos/fantom-ftm-logo.png" className="w-6 h-6" alt="Fantom" />
            <span>Connect Fantom Wallet</span>
          </button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-slate-500">Secure Access</span></div>
          </div>

          <button
            onClick={onLoginFlow}
            className="w-full border border-white/10 bg-white/5 font-semibold py-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Biometric / Passkey Login</span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 leading-relaxed">
          By connecting, you authorize Portfolio Pilot to deploy a secure AI Agent managed via Lit Protocol and chain-native abstraction layers.
        </p>
      </div>
    </div>
  );
};