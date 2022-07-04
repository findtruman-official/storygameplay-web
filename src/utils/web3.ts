import { BigNumber } from '@ethersproject/bignumber';
export function readableTokens(
  tokens: string | number,
  {
    decimals = 18,
    precision = 2,
  }: { decimals?: number; precision?: number } = {},
) {
  return (
    BigNumber.from(tokens)
      .div(BigNumber.from(10).pow(decimals - precision))
      .toNumber() / Math.pow(10, precision)
  );
}
