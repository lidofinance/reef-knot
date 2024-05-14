import React, { useCallback, useEffect, useState } from 'react';
import {
  Input,
  Button,
  Text,
  Eth,
  Divider,
  H3,
  DataTableRow,
  DataTable,
  External,
} from '@lidofinance/lido-ui';
import { SWRResponse, useContractSWR } from '@lido-sdk/react';
import { parseEther } from 'ethers/lib/utils.js';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';

import { StethAbi } from '@lido-sdk/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { formatBalance, getTxUrl } from '../../util/contractTestingUtils';
import { BlueWrapper } from '../info';
import { STETH_SUBMIT_GAS_LIMIT_DEFAULT } from '../../hooks/useStethSubmitGasLimit';
import { InputDecoratorMaxButton } from '../input-decorator-max-button';
import { LinkStyled } from './styles';

const SUBMIT_EXTRA_GAS_TRANSACTION_RATIO = 1.05;

export interface StakeFormProps {
  stakeCostInUsd: number | undefined;
  stethBalance: SWRResponse<BigNumber>;
  stethContractWeb3: StethAbi | null;
  chainId: number | undefined;
  account: string | null | undefined;
  providerWeb3: Web3Provider | undefined;
  stethContractRpc: StethAbi;
}

const StakeForm = ({
  stakeCostInUsd,
  stethBalance,
  stethContractWeb3,
  chainId,
  account,
  providerWeb3,
  stethContractRpc,
}: StakeFormProps) => {
  const defaultWrapInputValue = {
    eth: '0.00001',
    steth: '0.00001',
  };
  const [inputValue, setInputValue] = useState(defaultWrapInputValue);
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stakeData, setStakeData] = useState({} as any);
  const [referralAddress, setReferralAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [estimateStakeGas, setEstimateStakeGas] = useState(0);
  const [isStakeGasLoading, setStakeGasLoading] = useState(false);

  const [txError, setTxError] = useState('');
  const [stakeGasError, setStakeGasError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value,
    });
  };

  const lidoFee = useContractSWR({
    contract: stethContractRpc,
    method: 'getFee',
  });

  const calculateStakeGas = useCallback(async () => {
    setStakeGasError('');
    setStakeGasLoading(true);
    try {
      const feeData = await providerWeb3?.getFeeData();
      const maxPriorityFeePerGas = feeData?.maxPriorityFeePerGas ?? undefined;
      const maxFeePerGas = feeData?.maxFeePerGas ?? undefined;
      const overrides = {
        value: parseEther(inputValue.eth),
        maxPriorityFeePerGas,
        maxFeePerGas,
      };
      const originalGasLimit = await stethContractWeb3?.estimateGas.submit(
        referralAddress || AddressZero,
        overrides,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setEstimateStakeGas(originalGasLimit as any);
      setStakeGasLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setEstimateStakeGas(STETH_SUBMIT_GAS_LIMIT_DEFAULT);
      setStakeGasError(e?.message);
    }
  }, [
    inputValue.eth,
    providerWeb3,
    referralAddress,
    stethContractWeb3?.estimateGas,
  ]);

  const stake = useCallback(async () => {
    setTxError('');
    if (!stethContractWeb3 || !chainId) {
      return;
    }

    try {
      const feeData = await providerWeb3?.getFeeData();

      const maxPriorityFeePerGas = feeData?.maxPriorityFeePerGas ?? undefined;
      const maxFeePerGas = feeData?.maxFeePerGas ?? undefined;

      const overrides = {
        value: parseEther(inputValue.eth),
        maxPriorityFeePerGas,
        maxFeePerGas,
      };
      const originalGasLimit = await stethContractWeb3.estimateGas.submit(
        referralAddress || AddressZero,
        overrides,
      );

      const gasLimit = originalGasLimit
        ? Math.ceil(
            originalGasLimit.toNumber() * SUBMIT_EXTRA_GAS_TRANSACTION_RATIO,
          )
        : null;

      const callback = async () => {
        return stethContractWeb3.submit(referralAddress || AddressZero, {
          ...overrides,
          gasLimit: gasLimit ? BigNumber.from(gasLimit) : undefined,
        });
      };

      const transaction = await callback();

      setIsLoading(true);

      if (typeof transaction === 'object') {
        await transaction.wait().then((data) => {
          setIsLoading(false);
          setStakeData(data);
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setTxError(error?.reason);
    }
  }, [
    stethContractWeb3,
    chainId,
    providerWeb3,
    inputValue.eth,
    referralAddress,
  ]);

  useEffect(() => {
    void providerWeb3
      ?.getBalance(account || '')
      .then((data) => setWalletBalance(formatBalance(data, 5)), console.log);
  }, [account, providerWeb3]);

  return (
    <BlueWrapper>
      <H3>Stake</H3>
      <Input
        placeholder="Amount"
        type="number"
        name="eth"
        leftDecorator={<Eth />}
        value={inputValue.eth}
        onChange={handleInputChange}
        max={walletBalance}
        rightDecorator={
          <InputDecoratorMaxButton
            onClick={() => setInputValue({ ...inputValue, eth: walletBalance })}
          />
        }
      />
      <Input
        type="text"
        placeholder="Referral Address"
        value={referralAddress}
        onChange={(e) => setReferralAddress(e.target.value)}
      />
      <Input
        type="number"
        max={STETH_SUBMIT_GAS_LIMIT_DEFAULT}
        value={estimateStakeGas}
        onChange={(e) => setEstimateStakeGas(+e.target.value)}
        rightDecorator={
          <Button
            size="xxs"
            variant="translucent"
            onClick={calculateStakeGas}
            loading={isStakeGasLoading}
            style={{ marginRight: '-10px' }}
          >
            Calculate Gas
          </Button>
        }
      />
      {stakeGasError && <Text color="warning">{stakeGasError}</Text>}
      <DataTable>
        <DataTableRow title="You will receive">
          {`${inputValue.eth} stETH`}
        </DataTableRow>
        <DataTableRow title="Your wallet balance" loading={!stethBalance.data}>
          {`${walletBalance} ETH`}
        </DataTableRow>
        <DataTableRow title="Max TX cost" loading={!stakeCostInUsd}>
          {`${stakeCostInUsd?.toFixed(2)}$`}
        </DataTableRow>
        <DataTableRow title="Lido reward fee" loading={!lidoFee.data}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {`${(lidoFee.data as any) / 100} %`}
        </DataTableRow>
      </DataTable>
      {stakeData.blockHash && (
        <>
          <Divider />
          <Text>About transaction</Text>
          <DataTable>
            <DataTableRow title="Gas used">
              {stakeData.gasUsed.toNumber()} WEI
            </DataTableRow>
            <DataTableRow title="Transaction status">
              <LinkStyled href={getTxUrl(stakeData.transactionHash, chainId)}>
                <External />
              </LinkStyled>
            </DataTableRow>
          </DataTable>
          <Divider />
        </>
      )}
      {!stakeData.blockHash && <Text color="error">{txError}</Text>}
      <Button
        loading={isLoading || isStakeGasLoading}
        onClick={stake}
        disabled={!account}
      >
        Stake
      </Button>
    </BlueWrapper>
  );
};

export default StakeForm;
