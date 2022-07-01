export const NoneWalletConfig: WalletConfig = {
  wallet: 'none',
  agent: {
    isConnected: async () => false,
    connect: async () => {
      throw new Error('do not connect on NoneWallet');
    },
    disconnect: async () => {},
    getAccount: async () => {
      throw new Error('do not getAccount on NoneWallet');
    },
  },
};
