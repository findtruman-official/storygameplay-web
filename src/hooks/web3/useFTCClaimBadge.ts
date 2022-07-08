import { useWalletAgent } from '@/providers/WalletProvider';
import { useRequest } from 'ahooks';
import type { AbiItem } from 'web3-utils';
const Abi: AbiItem[] = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_sceneId',
        type: 'uint256',
      },
      {
        internalType: 'bytes32[]',
        name: '_proofs',
        type: 'bytes32[]',
      },
    ],
    name: 'claimAchievement',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export function useFTCClaimBadge(
  contract: string,
  account: string,
  badgeId: number,
  proofs: string[],
) {
  const agent = useWalletAgent();

  return useRequest(
    async () => {
      if (
        !account ||
        !contract ||
        !badgeId ||
        !proofs ||
        proofs.length === 0 ||
        !agent
      )
        throw new Error('invalid params');
      const web3 = await agent.getWeb3();
      if (!web3) {
        throw new Error('no web3');
      }

      const instance = new web3.eth.Contract(Abi, contract);
      await instance.methods['claimAchievement'](badgeId, proofs).send({
        from: account,
      });
    },
    {
      manual: true,
      refreshDeps: [contract, badgeId, proofs, account, agent],
    },
  );
}
