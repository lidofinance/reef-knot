import { useCallback } from 'react';

import { hexValue, splitSignature } from '@ethersproject/bytes';
import { parseEther } from '@ethersproject/units';
import { MaxUint256 } from '@ethersproject/constants';
import { BigNumber, TypedDataDomain } from 'ethers';
import { useSDK } from '@lido-sdk/react';

import { Erc20Abi, StethAbi } from '@lido-sdk/contracts';
import { useWeb3 } from 'reef-knot/web3-react';

export enum PermitType {
  AMOUNT = 1,
  ALLOWED = 2,
}

export type GatherPermitSignatureResult = {
  v: number;
  r: string;
  s: string;
  deadline: BigNumber;
  value: BigNumber;
  chainId: number;
  nonce: string;
  owner: string;
  spender: string;
  permitType?: PermitType;
};

type UseERC20PermitSignatureResult = {
  gatherPermitSignature: () => Promise<GatherPermitSignatureResult>;
};

type UseERC20PermitSignatureProps<
  T extends Pick<Erc20Abi, 'nonces' | 'address'>,
> = {
  value: string;
  tokenProvider: T | null;
  spender: string;
};

const INFINITY_DEADLINE_VALUE = MaxUint256;

const isStethPermit = (provider: unknown): provider is StethAbi => {
  return !!(
    typeof provider === 'object' &&
    provider !== null &&
    'eip712Domain' in provider
  );
};

const EIP2612_TYPE = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
];

export const useERC20PermitSignature = <
  T extends Pick<Erc20Abi, 'nonces' | 'address'>,
>({
  value,
  tokenProvider,
  spender,
}: UseERC20PermitSignatureProps<T>): UseERC20PermitSignatureResult => {
  const { chainId, account } = useWeb3();
  const { providerWeb3 } = useSDK();

  const gatherPermitSignature = useCallback(async () => {
    const deadline = INFINITY_DEADLINE_VALUE;
    const parsedValue = parseEther(value).toString();
    let domain: TypedDataDomain;
    if (isStethPermit(tokenProvider)) {
      const eip712Domain = await tokenProvider.eip712Domain();
      domain = {
        name: eip712Domain.name,
        version: eip712Domain.version,
        chainId: eip712Domain.chainId.toNumber(),
        verifyingContract: eip712Domain.verifyingContract,
      };
    } else {
      domain = {
        name: 'Wrapped liquid staked Ether 2.0',
        version: '1',
        chainId,
        verifyingContract: tokenProvider?.address,
      };
    }
    const nonce = await tokenProvider?.nonces(account as string);

    const message = {
      owner: account,
      spender,
      value: parsedValue,
      nonce: hexValue(nonce || 0),
      deadline: hexValue(deadline),
    };
    const types = {
      Permit: EIP2612_TYPE,
    };

    const signer = providerWeb3?.getSigner();

    return signer
      ?._signTypedData(domain, types, message)
      .then(splitSignature)
      .then((signature) => {
        return {
          v: signature.v,
          r: signature.r,
          s: signature.s,
          value: parseEther(value),
          deadline,
          chainId,
          nonce: message.nonce,
          owner: account,
          spender,
          permitType: PermitType.AMOUNT,
        };
      });
  }, [chainId, account, providerWeb3, tokenProvider, value, spender]);

  return { gatherPermitSignature } as UseERC20PermitSignatureResult;
};
