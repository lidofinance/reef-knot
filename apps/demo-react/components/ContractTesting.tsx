import React, { useState } from "react";
import { BlueWrapper } from "./info";
import { Input, Button, Text, Eth, Option, Select, Loader, Section } from "@lidofinance/lido-ui";
import { useContractSWR, useSDK, useSTETHBalance, useSTETHContractRPC, useSTETHContractWeb3 } from "@lido-sdk/react";

import { useWeb3 } from "reef-knot/web3-react";
import { formatBalance, getAddress } from '../util/contractTestingUtils';
import { useRouter } from "next/router";

import { parseEther } from "ethers/lib/utils.js";
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from "ethers";
import { useStethSubmitGasLimit } from "../hooks/useStethSubmitGasLimit";
import { useTxCostInUsd } from "../hooks/txCost";

const SUBMIT_EXTRA_GAS_TRANSACTION_RATIO = 1.05;

const ContractTesting = () => {
  const [inputValue, setInputValue] = useState('0.00001');
  const [isLoading, setIsLoading] = useState(false);

  const [stakeData, setStakeData] = useState({} as any);

  const submitGasLimit = useStethSubmitGasLimit();
  const txCostInUsd = useTxCostInUsd({ gasLimit: submitGasLimit })
  const stethBalance = useSTETHBalance();
  const stethContractWeb3 = useSTETHContractWeb3();

  const { chainId } = useWeb3();
  const { providerWeb3 } = useSDK();
  const contractRpc = useSTETHContractRPC();
  const lidoFee = useContractSWR({
    contract: contractRpc,
    method: 'getFee',
  });
  const router = useRouter();
  const refFromQuery = router?.query?.ref as string | undefined

  const stake = async () => {
    if (!stethContractWeb3 || !chainId) {
      return;
    }
    try {
      const referralAddress = await getAddress(refFromQuery, chainId);


      const feeData = await providerWeb3?.getFeeData();

      const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? undefined;
      const maxFeePerGas = feeData.maxFeePerGas ?? undefined;

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
    };
  }

  return (
    <Section title="Contract Testing">
      <BlueWrapper>
        <Select
          disabled
          label="Contract action"
          onChange={function noRefCheck() { }}
          themeOverride="light"
          defaultValue="stake"
        >
          <Option value="stake">Stake</Option>
        </Select>
        <Input placeholder="Amount" type="number" leftDecorator={<Eth />} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <Text color="secondary">
          You will receive: {`${inputValue} stEth`}
        </Text>
        <Text color="secondary">
          Your Balance: {stethBalance.data ? `${formatBalance(stethBalance.data, 4)} stEth` : <Loader style={{ display: 'inline' }} />} <br />
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
            Status: {stakeData.status ? 'success' : 'fail'}
          </Text>
        </>
        }

        <Button loading={isLoading} onClick={stake}>
          Stake
        </Button>
      </BlueWrapper>
    </Section>

  )
}

export default ContractTesting;