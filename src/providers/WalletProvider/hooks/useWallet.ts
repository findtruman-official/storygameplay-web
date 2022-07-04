import { WalletContext } from '../context';
import { useContext } from 'react';

export function useWallet() {
  return useContext(WalletContext);
}
