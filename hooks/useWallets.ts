
import { useState, useEffect, useCallback } from 'react';
import * as fcl from "@onflow/fcl";
import { ethers } from 'ethers';
import '../fcl.config';
import { PilotUser, WalletType } from '../types';

export const useWallets = () => {
  const [user, setUser] = useState<PilotUser>({ loggedIn: false, addr: null, walletType: null });
  const [isAgentStarted, setIsAgentStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFlowBalances = async (address: string) => {
    try {
      const cadenceScript = `
        import FungibleToken from 0x9a0766d93b6660b7
        import FlowToken from 0x7e60df042a9c0868
        import FiatToken from 0xa983fecbed621163

        pub fun main(address: Address): {String: UFix64} {
            let account = getAccount(address)
            let flowVault = account.getCapability(/public/flowTokenBalance)
                .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
                ?? panic("Could not borrow FLOW balance reference")
            let usdcVault = account.getCapability(FiatToken.VaultPublicPath)
                .borrow<&FiatToken.Vault{FungibleToken.Balance}>()
            return {
                "FLOW": flowVault.balance,
                "USDC": usdcVault?.balance ?? 0.0
            }
        }
      `;
      const result = await fcl.query({
        cadence: cadenceScript,
        args: (arg: any, t: any) => [arg(address, t.Address)]
      });
      return { FLOW: parseFloat(result.FLOW), USDC: parseFloat(result.USDC) };
    } catch (err) {
      console.error("Error fetching Flow balances:", err);
      return { FLOW: 0, USDC: 0 };
    }
  };

  const fetchEVMBalance = async (address: string) => {
    // Fixed: Cast window to any to access ethereum property
    if (!(window as any).ethereum) return { FLOW: 0, USDC: 0, native: 0 };
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const balance = await provider.getBalance(address);
    return { 
      FLOW: 0, 
      USDC: 0, 
      native: parseFloat(ethers.formatEther(balance)) 
    };
  };

  const refreshBalances = useCallback(async () => {
    if (!user.addr) return;
    setLoading(true);
    let balances;
    if (user.walletType === 'flow') {
      balances = await fetchFlowBalances(user.addr);
    } else {
      balances = await fetchEVMBalance(user.addr);
    }
    setUser(prev => ({ ...prev, balances }));
    setLoading(false);
  }, [user.addr, user.walletType]);

  useEffect(() => {
    const unsub = fcl.currentUser().subscribe(async (currentUser: any) => {
      if (currentUser?.addr) {
        const balances = await fetchFlowBalances(currentUser.addr);
        setUser({
          loggedIn: currentUser.loggedIn || false,
          addr: currentUser.addr || null,
          walletType: 'flow',
          balances
        });
      } else if (!user.loggedIn) {
        // Only reset if we were previously logged into Flow
        if (user.walletType === 'flow') {
          setUser({ loggedIn: false, addr: null, walletType: null });
        }
      }
    });
    return unsub;
  }, [user.loggedIn, user.walletType]);

  const loginFlow = async () => {
    try {
      await fcl.authenticate();
    } catch (err) {
      console.error("FCL Login Error:", err);
    }
  };

  const loginEVM = async (type: 'metamask' | 'fantom') => {
    // Fixed: Cast window to any to access ethereum property
    if (!(window as any).ethereum) {
      alert("Please install a compatible EVM wallet.");
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      
      // Handle chain switching for Fantom
      if (type === 'fantom') {
        try {
          // Fixed: Cast window to any to access ethereum property
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xfa' }], // 250 in hex
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            // Fixed: Cast window to any to access ethereum property
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xfa',
                chainName: 'Fantom Opera',
                nativeCurrency: { name: 'FTM', symbol: 'FTM', decimals: 18 },
                rpcUrls: ['https://rpc.ftm.tools/'],
                blockExplorerUrls: ['https://ftmscan.com/']
              }],
            });
          }
        }
      }

      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      const balances = await fetchEVMBalance(address);
      
      setUser({
        loggedIn: true,
        addr: address,
        walletType: type,
        balances
      });
    } catch (err) {
      console.error("EVM Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (user.walletType === 'flow') {
      fcl.unauthenticate();
    }
    setUser({ loggedIn: false, addr: null, walletType: null });
  };

  const startPilot = async () => {
    if (!user.loggedIn) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsAgentStarted(true);
    } catch (err) {
      console.error("Pilot Engagement Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loginFlow,
    loginEVM,
    logout,
    isAgentStarted,
    startPilot,
    refreshBalances,
    loading
  };
};
