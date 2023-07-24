import { isAddress } from "ethers/lib/utils.js";
import { CHAINS } from "../config/chains";
import { getStaticRpcBatchProvider } from "@lido-sdk/providers";
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';
import { Zero } from '@ethersproject/constants';

export const getBackendRPCPath = (chainId: string | number): string => {
    const BASE_URL = 'https://ethereum-goerli.publicnode.com';

    return `${BASE_URL}/api/rpc?chainId=${chainId}`;
};

export const getAddress = async (
    input: string | undefined,
    chainId: CHAINS | undefined,
): Promise<string> => {
    if (!input || !chainId) return '';
    if (isAddress(input)) return input;

    try {
        const provider = getStaticRpcBatchProvider(
            chainId,
            getBackendRPCPath(chainId),
        );
        const address = await provider.resolveName(input);

        if (address) return address;
    } catch (error) {
        throw new Error('Failed to resolve referral address');
    }

    throw new Error('Invalid referral address');
};

export const ONE_GWEI = BigNumber.from(10 ** 9);


type FormatBalance = (balance?: BigNumber, maxDecimalDigits?: number) => string;

export const formatBalance: FormatBalance = (
    balance = Zero,
    maxDecimalDigits = 4,
) => {
    const balanceString = formatEther(balance);

    if (balanceString.includes('.')) {
        const parts = balanceString.split('.');
        if (maxDecimalDigits === 0) return parts[0];
        return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
    }

    return balanceString;
};
