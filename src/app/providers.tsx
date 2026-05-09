'use client';

import { Web3Provider } from '@/lib/web3/Web3Provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      <Web3Provider>
        {children}
      </Web3Provider>
    </div>
  );
}
