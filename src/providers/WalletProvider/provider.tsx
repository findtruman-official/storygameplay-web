import React, { useMemo, useState } from 'react';
import { NoneWalletConfig } from './agents/None';
import { WalletContext } from './context';
import { MetamaskWalletConfig } from '@/providers/WalletProvider/agents/Metamask';
import { SequenceWalletConfig } from './agents/Sequence';
import { WalletConfig, WalletType } from '@/providers/WalletProvider/types';

export interface WalletProviderProps {
  configs?: WalletConfig[];
  children?: React.ReactNode;
}

const DefaultConfigs: WalletConfig[] = [
  MetamaskWalletConfig,
  SequenceWalletConfig,
];

export const WalletProvider: React.FC<WalletProviderProps> = ({
  configs = DefaultConfigs,
  children,
}) => {
  const _configs = useMemo(() => {
    return [...configs, NoneWalletConfig];
  }, [configs]);

  const [state, setState] = useState<{
    connected: boolean;
    wallet: WalletType;
  }>({
    connected: false,
    wallet: 'none',
  });
  const [account, setAccount] = useState('');

  const connect = async (opts: { wallet: WalletType }) => {
    const newWallet = opts.wallet;
    const { connected, wallet } = state;
    const targetWallet = _configs.find((wallet) => wallet.wallet === newWallet);
    if (!targetWallet) {
      console.error(`can not find wallet '${newWallet}'`);
      return;
    }

    if (connected) {
      const prevWallet = _configs.find((w) => w.wallet === wallet);
      if (!prevWallet) {
        console.error(`can not find prev wallet '${wallet}'`);
      } else {
        prevWallet.agent.disconnect();
      }
    }
    const newAccount = await targetWallet.agent.connect({
      onConnected: (web3) => {},
      onAccountChanged: ({ account }) => {
        if (state.wallet !== newWallet) {
          console.warn(
            `[${newWallet}][onAccountChanged] current wallet changed '${newWallet}'=>'${state.wallet}'`,
          );
        } else {
          setAccount(account);
        }
      },
      onDisconnected: () => {
        if (state.wallet !== newWallet) {
          console.warn(
            `[${newWallet}][onDisconnected] current wallet changed '${newWallet}'=>'${state.wallet}'`,
          );
        } else {
          setState({
            ...state,
            connected: false,
            wallet: 'none',
          });
          setAccount('');
        }
      },
    });

    setState({
      ...state,
      connected: true,
      wallet: opts.wallet,
    });
    setAccount(newAccount);
  };

  const disconnect = async () => {
    const { wallet } = state;
    const currWallet = _configs.find((w) => w.wallet === wallet);
    if (!currWallet) {
      console.error(`can not find current wallet '${wallet}'`);
    } else {
      await currWallet.agent.disconnect();
      setState((state) => ({
        ...state,
        connected: false,
        wallet: 'none',
      }));
      setAccount('');
    }
  };

  const trySilentConnect = async (opts: { wallet: WalletType }) => {
    const newWallet = opts.wallet;

    const { wallet, connected } = state;
    const targetWallet = _configs.find((w) => w.wallet === newWallet);
    if (!targetWallet) {
      console.error(`can not find current wallet '${wallet}'`);
    } else {
      const targetConnected = await targetWallet.agent.isConnected();
      if (targetConnected) {
        if (connected) {
          const prevWallet = _configs.find((w) => w.wallet === wallet);
          if (!prevWallet) {
            console.error(`can not find prev wallet '${wallet}'`);
          } else {
            prevWallet.agent.disconnect();
          }
        }

        await connect({ wallet: targetWallet.wallet });
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        ...state,
        account,
        connect,
        disconnect,
        trySilentConnect,
        configs: _configs,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
