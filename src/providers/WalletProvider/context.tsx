import React from 'react';
import { NoneWalletConfig } from './agents/None';

interface WalletContextState {
  connected: boolean;
  wallet: WalletType;
  account: string;
  configs: WalletConfig[];

  connect: (opts: { wallet: WalletType }) => Promise<void>;
  disconnect: () => Promise<void>;
  trySilentConnect: (opts: { wallet: WalletType }) => Promise<void>;
}

export const WalletContext = React.createContext<WalletContextState>({
  connected: false,
  wallet: 'none',
  account: '',
  configs: [NoneWalletConfig],
  disconnect: async () => {
    throw new Error('not in WalletProvider');
  },
  connect: async () => {
    throw new Error('not in WalletProvider');
  },
  trySilentConnect: async () => {
    throw new Error('not in WalletProvider');
  },
});
