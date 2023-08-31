import React from 'react';
import {
  useEthereumBalance,
  useSDK,
  useSTETHBalance,
  useSTETHContractRPC,
  useSTETHContractWeb3,
  useWSTETHBalance,
  useWSTETHContractWeb3,
} from '@lido-sdk/react';
import { useWeb3 } from 'reef-knot/web3-react';
import StakeForm from './Stake';
import WrapForm from './Wrap';
import WithdrawalsForm from './Withdrawals';
import { useStethSubmitGasLimit } from '../../hooks/useStethSubmitGasLimit';
import { useTxCostInUsd } from '../../hooks/txCost';
import { useWrapGasLimit } from '../../hooks/useWrapGasLimit';

const ContractTesting = () => {
  const stethContractRpc = useSTETHContractRPC();
  const stakeGasLimit = useStethSubmitGasLimit();
  const stakeCostInUsd = useTxCostInUsd({ gasLimit: stakeGasLimit });
  const stethBalance = useSTETHBalance();
  const stethContractWeb3 = useSTETHContractWeb3();

  const { chainId = 5, account } = useWeb3();
  const { providerWeb3 } = useSDK();
  const ethBalance = useEthereumBalance();
  const wstethBalance = useWSTETHBalance();

  const wstethContractWeb3 = useWSTETHContractWeb3();
  const wrapGasLimit = useWrapGasLimit(true);
  const wrapCostInUsd = useTxCostInUsd({ gasLimit: wrapGasLimit });

  const stakeFormProps = {
    stakeCostInUsd,
    stethBalance,
    stethContractWeb3,
    chainId,
    account,
    providerWeb3,
    stethContractRpc,
  };
  const wrapFormProps = {
    ethBalance,
    stethBalance,
    wstethContractWeb3,
    chainId,
    account,
    providerWeb3,
    wstethBalance,
    wrapCostInUsd,
    wrapGasLimit,
  };
  const withdrawalsFormProps = {
    stethBalance,
    wstethBalance,
    chainId,
    account,
  };

  return (
    <>
      <StakeForm {...stakeFormProps} />
      <WrapForm {...wrapFormProps} />
      <WithdrawalsForm {...withdrawalsFormProps} />
    </>
  );
};

export default ContractTesting;
