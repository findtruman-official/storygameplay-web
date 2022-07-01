import detectEthereumProvider from '@metamask/detect-provider';
import { useRequest } from 'ahooks';
import Web3 from 'web3';
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
  return useRequest(
    async () => {
      if (!contract || !address) return '0';
      const provider = (await detectEthereumProvider()) as any;
      const web3 = new Web3(provider);
      const instance = new web3.eth.Contract(Abi, contract);
      const balance = await instance.methods.balanceOf(address).call();
      return balance;
    },
    {
      refreshDeps: [contract, address],
    },
  );
}
