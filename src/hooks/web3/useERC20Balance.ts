import { useWalletAgent } from '@/providers/WalletProvider';
import { useRequest } from 'ahooks';
import type { AbiItem } from 'web3-utils';
const Abi: AbiItem[] = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export function useERC20Balance(contract: string, address: string) {
  const agent = useWalletAgent();

  return useRequest(
    async () => {
      if (!contract || !address || !agent) return '0';

      const web3 = await agent.getWeb3();
      if (!web3) return '0';

      const instance = new web3.eth.Contract(Abi, contract);
      const balance = await instance.methods.balanceOf(address).call();

      return balance;
    },
    {
      refreshDeps: [contract, address, agent],
    },
  );
}
