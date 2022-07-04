import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

const listeners: Record<string, Function[]> = {};

enum MetamaskEvent {
  ACCOUNT_CHANGED = 'ACCOUNT_CHANGED',
  CHAIN_CHANGED = 'CHAIN_CHANGED',
  DISCONNECTED = 'DISCONNECTED',
}

const MetamaskAgent: WalletAgent = {
  isConnected: async () => {
    const provider = (await detectEthereumProvider()) as any;
    return (await provider.request({ method: 'eth_accounts' })).length > 0;
  },
  connect: async ({
    onAccountChanged,
    onChainChanged,
    onDisconnected,
    onConnected,
  }) => {
    const provider = (await detectEthereumProvider()) as any;
    if (!provider) {
      throw new Error('Please install MetaMask!');
    }

    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    });

    onConnected(new Web3(provider));

    {
      const _onAccountChanged = (accounts: string[]) => {
        accounts.length > 0 && onAccountChanged({ account: accounts[0] });
      };
      provider.on('accountsChanged', _onAccountChanged);
      if (listeners[MetamaskEvent.ACCOUNT_CHANGED] === undefined) {
        listeners[MetamaskEvent.ACCOUNT_CHANGED] = [];
      }
      listeners[MetamaskEvent.ACCOUNT_CHANGED].push(_onAccountChanged);
    }

    {
      const _onChainChanged = (chainId: string) => {
        onChainChanged?.({ chainId });
      };
      provider.on('chainChanged', _onChainChanged);
      if (listeners[MetamaskEvent.CHAIN_CHANGED] === undefined) {
        listeners[MetamaskEvent.CHAIN_CHANGED] = [];
      }
      listeners[MetamaskEvent.CHAIN_CHANGED].push(_onChainChanged);
    }

    {
      const _onDisconnected = () => {
        onDisconnected();
      };
      provider.on('disconnect', _onDisconnected);
      if (listeners[MetamaskEvent.DISCONNECTED] === undefined) {
        listeners[MetamaskEvent.DISCONNECTED] = [];
      }
      listeners[MetamaskEvent.DISCONNECTED].push(_onDisconnected);
    }

    return accounts[0] ?? '';
  },
  disconnect: async () => {
    const provider = (await detectEthereumProvider()) as any;
    if (provider) {
      for (const [event, cbs] of Object.entries(listeners)) {
        for (const cb of cbs) {
          provider.removeListener(event, cb);
        }
      }
    }
  },
  getAccount: async () => {
    const provider = (await detectEthereumProvider()) as any;
    if (provider) {
      const accounts = await provider.request({ method: 'eth_accounts' });
      return { account: accounts[0] ?? '', web3: new Web3(provider) };
    } else {
      return { account: '', web3: undefined };
    }
  },
};

export const MetamaskWalletConfig: WalletConfig = {
  wallet: 'metamask',
  agent: MetamaskAgent,
};
