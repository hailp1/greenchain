'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { BrowserProvider, JsonRpcSigner, Contract, formatEther, parseEther } from 'ethers';
import { FWD_TOKEN_ADDRESS, FWD_STAKING_ADDRESS, FWD_ANCHOR_ADDRESS } from '@/lib/contracts/config';

// Import ABI from compiled artifacts
import FWDTokenArtifact from '@/artifacts/contracts/FWDToken.sol/FWDToken.json';
import FWDStakingArtifact from '@/artifacts/contracts/FWDStaking.sol/FWDStaking.json';

// ─── Types ────────────────────────────────────────────────────
interface Web3State {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  chainId: number | null;
  balance: string;
  fwdBalance: string;
  stakedBalance: string;
  pendingRewards: string;
  error: string | null;
}

interface Web3ContextType extends Web3State {
  connect: () => Promise<void>;
  disconnect: () => void;
  stakeTokens: (amount: string) => Promise<string | null>;
  unstakeTokens: (amount: string) => Promise<string | null>;
  claimRewards: () => Promise<string | null>;
  transferTokens: (to: string, amount: string) => Promise<string | null>;
  refreshBalances: () => Promise<void>;
}

const initialState: Web3State = {
  isConnected: false,
  isConnecting: false,
  address: null,
  chainId: null,
  balance: '0',
  fwdBalance: '0',
  stakedBalance: '0',
  pendingRewards: '0',
  error: null,
};

const Web3Context = createContext<Web3ContextType>({
  ...initialState,
  connect: async () => {},
  disconnect: () => {},
  stakeTokens: async () => null,
  unstakeTokens: async () => null,
  claimRewards: async () => null,
  transferTokens: async () => null,
  refreshBalances: async () => {},
});

export const useWeb3 = () => useContext(Web3Context);

// ─── Provider ─────────────────────────────────────────────────
export function Web3Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Web3State>(initialState);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  // Check if contracts are deployed
  const contractsDeployed = FWD_TOKEN_ADDRESS.length > 0 && FWD_STAKING_ADDRESS.length > 0;

  // ─── Helper: get contract instances ─────────────────────────
  const getTokenContract = useCallback((signerOrProvider: JsonRpcSigner | BrowserProvider) => {
    if (!contractsDeployed) return null;
    return new Contract(FWD_TOKEN_ADDRESS, FWDTokenArtifact.abi, signerOrProvider);
  }, [contractsDeployed]);

  const getStakingContract = useCallback((signerOrProvider: JsonRpcSigner | BrowserProvider) => {
    if (!contractsDeployed) return null;
    return new Contract(FWD_STAKING_ADDRESS, FWDStakingArtifact.abi, signerOrProvider);
  }, [contractsDeployed]);

  // ─── Refresh Balances ───────────────────────────────────────
  const refreshBalances = useCallback(async () => {
    if (!provider || !state.address) return;

    try {
      // Native balance (ETH/BNB)
      const ethBalance = await provider.getBalance(state.address);
      const balanceStr = formatEther(ethBalance);

      let fwdBal = '0';
      let stakedBal = '0';
      let rewards = '0';

      if (contractsDeployed) {
        const tokenContract = getTokenContract(provider);
        const stakingContract = getStakingContract(provider);

        if (tokenContract) {
          const rawFwd = await tokenContract.balanceOf(state.address);
          fwdBal = formatEther(rawFwd);
        }

        if (stakingContract) {
          const [staked, reward] = await stakingContract.getStakeInfo(state.address);
          stakedBal = formatEther(staked);
          rewards = formatEther(reward);
        }
      }

      setState(prev => ({
        ...prev,
        balance: balanceStr,
        fwdBalance: fwdBal,
        stakedBalance: stakedBal,
        pendingRewards: rewards,
      }));
    } catch (err) {
      console.error('Error refreshing balances:', err);
    }
  }, [provider, state.address, contractsDeployed, getTokenContract, getStakingContract]);

  // ─── Connect Wallet ─────────────────────────────────────────
  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setState(prev => ({ ...prev, error: 'MetaMask is not installed. Please install it to continue.' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isConnecting: true, error: null }));

      const browserProvider = new BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      const network = await browserProvider.getNetwork();
      const userSigner = await browserProvider.getSigner();

      setProvider(browserProvider);
      setSigner(userSigner);

      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        address: accounts[0],
        chainId: Number(network.chainId),
      }));
    } catch (err: any) {
      console.error('Connection error:', err);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: err.code === 4001 ? 'Connection rejected by user.' : 'Failed to connect wallet.',
      }));
    }
  }, []);

  // ─── Disconnect ─────────────────────────────────────────────
  const disconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setState(initialState);
  }, []);

  // ─── Stake Tokens ───────────────────────────────────────────
  const stakeTokens = useCallback(async (amount: string): Promise<string | null> => {
    if (!signer || !contractsDeployed) {
      const msg = !signer ? "Wallet not connected." : "Contracts not deployed.";
      console.error("[Web3] Cannot stake:", msg);
      setState(prev => ({ ...prev, error: msg }));
      return null;
    }

    try {
      const tokenContract = getTokenContract(signer);
      const stakingContract = getStakingContract(signer);
      if (!tokenContract || !stakingContract) return null;

      const parsedAmount = parseEther(amount);

      console.log("[Web3] Step 1: Approving AGRI tokens for staking...");
      const approveTx = await tokenContract.approve(FWD_STAKING_ADDRESS, parsedAmount);
      console.log("[Web3] Approval TX sent:", approveTx.hash);
      await approveTx.wait();
      console.log("[Web3] Approval confirmed.");

      console.log("[Web3] Step 2: Staking tokens...");
      const stakeTx = await stakingContract.stake(parsedAmount);
      console.log("[Web3] Stake TX sent:", stakeTx.hash);
      const receipt = await stakeTx.wait();
      console.log("[Web3] Stake confirmed at block:", receipt.blockNumber);

      await refreshBalances();
      return receipt.hash;
    } catch (err: any) {
      console.error('Stake error:', err);
      setState(prev => ({ ...prev, error: err.reason || 'Staking failed.' }));
      return null;
    }
  }, [signer, contractsDeployed, getTokenContract, getStakingContract, refreshBalances]);

  // ─── Unstake Tokens ─────────────────────────────────────────
  const unstakeTokens = useCallback(async (amount: string): Promise<string | null> => {
    if (!signer || !contractsDeployed) {
      setState(prev => ({ ...prev, error: 'Contracts not deployed yet.' }));
      return null;
    }

    try {
      const stakingContract = getStakingContract(signer);
      if (!stakingContract) return null;

      console.log("[Web3] Unstaking tokens...");
      const parsedAmount = parseEther(amount);
      const tx = await stakingContract.withdraw(parsedAmount);
      console.log("[Web3] Unstake TX sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("[Web3] Unstake confirmed.");

      await refreshBalances();
      return receipt.hash;
    } catch (err: any) {
      console.error('Unstake error:', err);
      setState(prev => ({ ...prev, error: err.reason || 'Unstaking failed.' }));
      return null;
    }
  }, [signer, contractsDeployed, getStakingContract, refreshBalances]);

  // ─── Claim Rewards ──────────────────────────────────────────
  const claimRewards = useCallback(async (): Promise<string | null> => {
    if (!signer || !contractsDeployed) {
      setState(prev => ({ ...prev, error: 'Contracts not deployed yet.' }));
      return null;
    }

    try {
      const stakingContract = getStakingContract(signer);
      if (!stakingContract) return null;

      console.log("[Web3] Claiming rewards...");
      const tx = await stakingContract.claimReward();
      console.log("[Web3] Claim TX sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("[Web3] Reward claimed.");

      await refreshBalances();
      return receipt.hash;
    } catch (err: any) {
      console.error('Claim error:', err);
      setState(prev => ({ ...prev, error: err.reason || 'Claim failed.' }));
      return null;
    }
  }, [signer, contractsDeployed, getStakingContract, refreshBalances]);

  // ─── Transfer Tokens ─────────────────────────────────────────
  const transferTokens = useCallback(async (to: string, amount: string): Promise<string | null> => {
    if (!signer || !contractsDeployed) {
      setState(prev => ({ ...prev, error: 'Contracts not deployed yet.' }));
      return null;
    }

    try {
      console.log(`[Web3] Transferring ${amount} AGRI to ${to}...`);
      const tokenContract = getTokenContract(signer);
      if (!tokenContract) return null;

      const tx = await tokenContract.transfer(to, parseEther(amount));
      console.log("[Web3] Transfer TX sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("[Web3] Transfer confirmed.");

      await refreshBalances();
      return receipt.hash;
    } catch (err: any) {
      console.error('Transfer error:', err);
      setState(prev => ({ ...prev, error: err.reason || 'Transfer failed.' }));
      return null;
    }
  }, [signer, contractsDeployed, getTokenContract, refreshBalances]);

  // ─── Claim Test Tokens (Faucet) ─────────────────────────────
  const claimTestTokens = useCallback(async (): Promise<string | null> => {
    if (!state.address) return null;
    try {
      const response = await fetch('http://localhost:3000/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: state.address })
      });
      const data = await response.json();
      if (data.success) {
        await refreshBalances();
        return data.txHash;
      }
      throw new Error(data.error);
    } catch (err: any) {
      console.error('Faucet claim error:', err);
      return null;
    }
  }, [state.address, refreshBalances]);

  // ─── Auto-refresh balances when connected ───────────────────
  useEffect(() => {
    if (state.isConnected && state.address) {
      refreshBalances();
    }
  }, [state.isConnected, state.address, refreshBalances]);

  // ─── Listen for MetaMask events ─────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setState(prev => ({ ...prev, address: accounts[0] }));
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [disconnect]);

  return (
    <Web3Context.Provider value={{
      ...state,
      connect,
      disconnect,
      stakeTokens,
      unstakeTokens,
      claimRewards,
      transferTokens,
      claimTestTokens,
      refreshBalances,
    }}>
      {children}
    </Web3Context.Provider>
  );
}
