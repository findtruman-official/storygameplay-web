import { useWalletAgent } from '@/providers/WalletProvider';
import { useRequest } from 'ahooks';

export function useChainId() {
  const agent = useWalletAgent();

  return useRequest(
    async () => {
      if (!agent) return 0;

      const web3 = await agent.getWeb3();
      if (!web3) return 0;

      const chainId = await web3.eth.getChainId();
      return chainId;
    },
    {
      refreshDeps: [agent],
    },
  );
}
