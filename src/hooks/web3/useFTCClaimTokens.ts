import detectEthereumProvider from '@metamask/detect-provider';
import { useRequest } from 'ahooks';
import Web3 from 'web3';
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
        internalType: 'uint256',
        name: '_tokens',
        type: 'uint256',
      },
      {
        internalType: 'bytes32[]',
        name: '_proofs',
        type: 'bytes32[]',
      },
    ],
    name: 'claimAchievementRewardTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export function useFTCClaimTokens(
  contract: string,
  account: string,
  badgeId: number,
  tokens: number,
  proofs: string[],
) {
  return useRequest(
    async () => {
      if (!account || !contract || !badgeId || !proofs || proofs.length === 0)
        throw new Error('invalid params');

      const provider = (await detectEthereumProvider()) as any;
      const web3 = new Web3(provider);
      const instance = new web3.eth.Contract(Abi, contract);

      await instance.methods['claimAchievementRewardTokens'](
        badgeId,
        tokens.toString() + '000000000000000000',
        proofs,
      ).send({
        from: account,
      });
    },
    {
      manual: true,
      refreshDeps: [contract, badgeId, proofs, account, tokens],
    },
  );
}
