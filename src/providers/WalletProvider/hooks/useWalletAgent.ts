import { useWallet } from './useWallet';

export function useWalletAgent() {
  const { wallet, configs } = useWallet();
  return configs.find((conf) => conf.wallet === wallet)?.agent;
}
