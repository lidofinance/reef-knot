import { formatEther } from 'viem';

export const formatBalance = (balance: bigint, maxDecimalDigits = 4) => {
  const balanceString = formatEther(balance);

  if (balanceString.includes('.')) {
    const parts = balanceString.split('.');
    if (maxDecimalDigits === 0) return parts[0];
    return `${parts[0]}.${parts[1].slice(0, maxDecimalDigits)}`;
  }

  return balanceString;
};
