import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0.00');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true);
      setError(null);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setAccount(address);
        
        // Fetch real ETH balance
        const balanceWei = await provider.getBalance(address);
        const balanceEth = ethers.formatEther(balanceWei);
        setBalance(Number(balanceEth).toFixed(4));
        
      } catch (err: any) {
        setError(err.message || "Failed to connect wallet");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Vui lòng cài đặt MetaMask hoặc ví Web3 để sử dụng tính năng này!");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0.00');
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const address = await accounts[0].getAddress();
          setAccount(address);
          const balanceWei = await provider.getBalance(address);
          setBalance(Number(ethers.formatEther(balanceWei)).toFixed(4));
        }
      }
    };
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) setAccount(accounts[0]);
        else setAccount(null);
      });
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []);

  return { account, balance, loading, error, connectWallet, disconnectWallet };
};
