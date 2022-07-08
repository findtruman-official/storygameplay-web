import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { sequence } from '0xsequence';
import type {
  ConnectOptions,
  ProviderRpcError,
} from '0xsequence/dist/declarations/src/provider';
import type { WalletAgent, WalletConfig } from '../types';

// const listeners: Record<string, Function[]> = {};

// enum Event {
//   ACCOUNT_CHANGED = 'ACCOUNT_CHANGED',
//   CHAIN_CHANGED = 'CHAIN_CHANGED',
//   DISCONNECTED = 'DISCONNECTED',
// }

export const SequenceConfig: {
  defaultNetworkId?: number | string;
  connectOptions?: ConnectOptions;
} = {};

let _globalWallet: sequence.Wallet | null = null;

export function getWallet() {
  if (!_globalWallet) {
    _globalWallet = new sequence.Wallet(SequenceConfig.defaultNetworkId);
  }
  return _globalWallet;
  // return new sequence.Wallet(SequenceConfig.defaultNetworkId);
}
let _globalProvider: sequence.provider.Web3Provider | null = null;
export function getProvider() {
  const wallet = getWallet();
  if (!_globalProvider) {
    _globalProvider = wallet.getProvider() || null;
  }

  return _globalProvider;
}

function getWeb3(): Web3 | null {
  // const wallet = getWallet();
  const provider = getProvider();
  if (provider) {
    // @ts-ignore
    return new Web3(provider);
  } else {
    return null;
  }
}

const SequenceAgent: WalletAgent = {
  isConnected: async () => {
    const wallet = getWallet();
    return wallet.isConnected();
  },
  connect: async ({
    onAccountChanged,
    onChainChanged,
    onDisconnected,
    onConnected,
  }) => {
    const wallet = getWallet();
    const isAlreadyConnected = await wallet.isConnected();

    if (!isAlreadyConnected) {
      const connectDetails = await wallet.connect(
        SequenceConfig.connectOptions,
      );
      if (!connectDetails.connected) {
        throw new Error(connectDetails.error || 'user not authorized');
      }
    }

    {
      const _onAccountChanged = (accounts: string[]) => {
        accounts.length > 0 && onAccountChanged({ account: accounts[0] });
      };
      wallet.on('accountsChanged', _onAccountChanged);
      // if (listeners[MetamaskEvent.ACCOUNT_CHANGED] === undefined) {
      //   listeners[MetamaskEvent.ACCOUNT_CHANGED] = [];
      // }
      // listeners[MetamaskEvent.ACCOUNT_CHANGED].push(_onAccountChanged);
    }

    {
      const _onChainChanged = (chainId: string) => {
        onChainChanged?.({ chainId });
      };
      wallet.on('chainChanged', _onChainChanged);
      // if (listeners[MetamaskEvent.CHAIN_CHANGED] === undefined) {
      //   listeners[MetamaskEvent.CHAIN_CHANGED] = [];
      // }
      // listeners[MetamaskEvent.CHAIN_CHANGED].push(_onChainChanged);
    }

    {
      const _onDisconnected = (err?: ProviderRpcError) => {
        onDisconnected();
      };
      wallet.on('disconnect', _onDisconnected);

      // if (listeners[MetamaskEvent.DISCONNECTED] === undefined) {
      //   listeners[MetamaskEvent.DISCONNECTED] = [];
      // }
      // listeners[MetamaskEvent.DISCONNECTED].push(_onDisconnected);
    }

    onConnected(getWeb3());

    return await wallet.getAddress();
  },
  disconnect: async () => {
    const wallet = getWallet();
    wallet.disconnect();
    // for (const [event, cbs] of Object.entries(listeners)) {
    //   for (const cb of cbs) {
    //     getWallet().removeListener(event, cb);
    //   }
    // }
  },
  getAccount: async () => {
    const wallet = getWallet();
    const provider = getProvider();
    if (provider) {
      // @ts-ignore
      return { account: await wallet.getAddress(), web3: new Web3(provider) };
    } else {
      return { account: '', web3: undefined };
    }
  },

  getWeb3: async () => {
    const provider = getProvider();
    // @ts-ignore
    return provider ? new Web3(provider) : null;
  },
};

export const SequenceWalletConfig: WalletConfig = {
  wallet: 'sequence',
  agent: SequenceAgent,
};
