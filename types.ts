export type WalletType = 'flow' | 'metamask' | 'fantom';

export interface PilotUser {
  loggedIn: boolean;
  addr: string | null;
  walletType: WalletType | null;
  cid?: string;
  expiresAt?: number;
  balances?: {
    FLOW: number;
    USDC: number;
    native?: number; // For EVM chains
  };
}

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  txHash?: string;
  isJournal?: boolean;
}

export interface SocialEntry {
  id: string;
  name: string;
  avatar: string;
  growth: number;
  rank: number;
}

export interface AgentStatus {
  lastCheck: number;
  performance24h: number; // Percentage
  currentAllocation: {
    FLOW: number;
    USDC: number;
  };
  targetAllocation: {
    FLOW: number;
    USDC: number;
  };
  drift: number;
}