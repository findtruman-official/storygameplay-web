import type Web3 from 'web3';

declare type WalletType = 'none' | 'metamask' | 'sequence';

declare interface WalletAgent {
  isConnected: () => Promise<boolean>;

  connect: (opts: {
    onAccountChanged: (data: { account: string }) => any;
    onChainChanged?: (data: { chainId: number | string }) => any;
    onDisconnected: () => any;
    onConnected: (instance: any) => any;
  }) => Promise<string>;

  disconnect: () => Promise<void>;

  getAccount: () => Promise<{ account: string; web3: any }>;

  getWeb3: () => Promise<Web3 | null>;
}

declare interface WalletConfig {
  wallet: WalletType;
  agent: WalletAgent;
}
