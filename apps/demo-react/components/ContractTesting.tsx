import React, { useEffect, useState } from "react";
import { BlueWrapper } from "./info";
import { Input, Button, Text, Eth, Option, Select, Loader, Section } from "@lidofinance/lido-ui";
import { useContractSWR, useSDK, useSTETHBalance, useSTETHContractRPC, useSTETHContractWeb3 } from "@lido-sdk/react";
import { useWeb3 } from "reef-knot/web3-react";
import { formatBalance } from '../util/contractTestingUtils'
import { parseEther } from "ethers/lib/utils.js";
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from "ethers";
import { STETH_SUBMIT_GAS_LIMIT_DEFAULT, useStethSubmitGasLimit } from "../hooks/useStethSubmitGasLimit";
import { useTxCostInUsd } from "../hooks/txCost";


const SUBMIT_EXTRA_GAS_TRANSACTION_RATIO = 1.05;

const ContractTesting = () => {
  const [inputValue, setInputValue] = useState('0.0001');
  const [isLoading, setIsLoading] = useState(false);

  const [stakeData, setStakeData] = useState({} as any);
  const [referralAddress, setReferralAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [estimateGas, setEstimateGas] = useState(0);
  const [isGasLoading, setGasLoading] = useState(false);
  const [txError, setTxError] = useState('');
  const [gasError, setGasError] = useState('');

  const submitGasLimit = useStethSubmitGasLimit();
  const txCostInUsd = useTxCostInUsd({ gasLimit: submitGasLimit })
  const stethBalance = useSTETHBalance();
  const stethContractWeb3 = useSTETHContractWeb3();

  const { chainId, account } = useWeb3();
  const { providerWeb3 } = useSDK();
  const contractRpc = useSTETHContractRPC();
  const lidoFee = useContractSWR({
    contract: contractRpc,
    method: 'getFee',
  });

  const calculateGas = async () => {
    setGasError('');
    setGasLoading(true);
    try {
      const feeData = await providerWeb3?.getFeeData();
      const maxPriorityFeePerGas = feeData?.maxPriorityFeePerGas ?? undefined;
    
      const maxFeePerGas = feeData?.maxFeePerGas ?? undefined;
      const overrides = {
        value: parseEther(inputValue),
        maxPriorityFeePerGas,
        maxFeePerGas,
      };
      const originalGasLimit = await stethContractWeb3?.estimateGas.submit(
        referralAddress || AddressZero,
        overrides,
      );
      setEstimateGas(originalGasLimit as any);
      setGasLoading(false);

    } catch (e: any) {
      setEstimateGas(STETH_SUBMIT_GAS_LIMIT_DEFAULT);
      setGasError(e?.message)
    }
  }

  const stake = async () => {
    setTxError('');
    if (!stethContractWeb3 || !chainId) {
      return;
    }

    try {
      const feeData = await providerWeb3?.getFeeData();

      const maxPriorityFeePerGas = feeData?.maxPriorityFeePerGas ?? undefined;
      const maxFeePerGas = feeData?.maxFeePerGas ?? undefined;

      const overrides = {
        value: parseEther(inputValue),
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
      }

      const transaction = await callback();

      setIsLoading(true);

      if (typeof transaction === 'object') {

        await transaction.wait().then((data) => {
          setIsLoading(false);
          setStakeData(data);
        })
      }
    } catch (error: any) {
      console.log({
        error,
      })
      setTxError(error?.reason)
    };
  }
  useEffect(() => {
    if (providerWeb3) {
      const balance = async () => {
        await providerWeb3.getBalance(account || '').then((data) => setWalletBalance(formatBalance(data, 4)));
      }
      balance();
    }
  }, []);

  return (
    <Section title="Contract Testing">
      <BlueWrapper>
        <Select
          disabled
          label="Contract action"
          onChange={() => null}
          themeOverride="light"
          defaultValue="stake"
        >
          <Option value="stake">Stake</Option>
        </Select>
        <Input placeholder="Amount" type="number" leftDecorator={<Eth />} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <Input type="text" placeholder="Referral Address" value={referralAddress} onChange={(e) => setReferralAddress(e.target.value)} />
        
        <Input type="text" value={estimateGas} disabled label="Estimate GAS"/>
        {gasError && <Text color="warning">{gasError}</Text>}
        <Button onClick={calculateGas} loading={isGasLoading}>Calculate GAS</Button>
        
        <Text color="secondary">
          You will receive: {`${inputValue} stEth`}
        </Text>
        <Text color="secondary">
          Your Wallet Balance: {walletBalance} ETH<br />
          Your Stake Balance: {stethBalance.data ? `${formatBalance(stethBalance.data, 4)} stEth` : <Loader style={{ display: 'inline' }} />} <br />
          Max TX cost: {txCostInUsd ? ` ${txCostInUsd?.toFixed(2)}$` : <Loader style={{ display: 'inline' }} />} <br />
          Lido Reward Fee: &nbsp;{lidoFee.data ? `${lidoFee.data / 100}%` : <Loader style={{ display: 'inline' }} />}
        </Text>
        {stakeData.blockHash && <>
          <Text>
            About transaction
          </Text>
          <Text color="secondary">
            Gas used: {(stakeData.gasUsed).toNumber()} WEI
          </Text>
          <Text color="secondary">
            Status: {stakeData.status && 'success'}
          </Text>
        </>
        }
        {!stakeData.blockHash && <Text color="error">
            {txError}
          </Text>}

        <Button loading={isLoading || isGasLoading} onClick={stake}>
          Stake
        </Button>
      </BlueWrapper>
    </Section>
  )
}

export default ContractTesting;