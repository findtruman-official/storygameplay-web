import type { WalletAgent } from '../types';
import { useWallet } from './useWallet';

export function useWalletAgent(): WalletAgent | null {
  const { wallet, configs } = useWallet();
  return configs.find((conf) => conf.wallet === wallet)?.agent || null;
}
