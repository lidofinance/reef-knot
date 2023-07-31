import React, { useMemo, useState } from 'react';
import {
  Input,
  Button,
  Text,
  H3,
  Steth,
  DataTableRow,
  DataTable,
  Divider,
} from '@lidofinance/lido-ui';
import {
  useEthereumBalance,
  useSDK,
  useSTETHBalance,
  useWSTETHBalance,
  useWSTETHContractWeb3,
} from '@lido-sdk/react';
import { useWeb3 } from 'reef-knot/web3-react';
import { parseEther } from 'ethers/lib/utils.js';

import { formatBalance } from '../../util/contractTestingUtils';
import { BlueWrapper } from '../info';
import { STETH_SUBMIT_GAS_LIMIT_DEFAULT } from '../../hooks/useStethSubmitGasLimit';
import { useTxCostInUsd } from '../../hooks/txCost';
import { useWstethBySteth } from '../../hooks/useWstethBySteth';
import { useWrapGasLimit } from '../../hooks/useWrapGasLimit';
import { InputDecoratorMaxButton } from '../input-decorator-max-button';
import {
  unwrapProcessing,
  wrapProcessingWithApprove,
} from '../../util/wrapProcessingWithApprove';

const WrapForm = () => {
  const [inputValue, setInputValue] = useState('0.00001');

  const [estimateWrapGas, setEstimateWrapGas] = useState(0);
  const [wrapSuccess, setWrapSuccess] = useState(false);
  const [isWrapLoading, setWrapLoading] = useState(false);

  const [wrapError, setWrapError] = useState('');

  const ethBalance = useEthereumBalance();
  const stethBalance = useSTETHBalance();
  const wstethContractWeb3 = useWSTETHContractWeb3();

  const { chainId } = useWeb3();
  const { providerWeb3 } = useSDK();

  const oneSteth = useMemo(() => parseEther('1'), []);
  const oneWstethConverted = useWstethBySteth(oneSteth);

  const wstETHBalance = useWSTETHBalance();

  const wrapGasLimit = useWrapGasLimit(true);
  const wrapTxCostInUsd = useTxCostInUsd(wrapGasLimit);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const setMaxInputValue = (e: any) => {
    console.log({ e });
    setInputValue(formatBalance(stethBalance.data, 5));
  };

  const wrapGas = useWrapGasLimit(true);

  const calculateWrapGas = () => {
    setEstimateWrapGas(wrapGas);
  };

  const wrap = async () => {
    setWrapSuccess(false);
    setWrapError('');
    setWrapLoading(true);
    const tx = await wrapProcessingWithApprove(
      chainId,
      providerWeb3,
      wstethContractWeb3,
      ethBalance.update,
      stethBalance.update,
      inputValue,
      'ETH',
    )
      .then(() => {
        setWrapLoading(false);
        setWrapSuccess(true);
      })
      .catch((e) => {
        setWrapSuccess(false);
        setWrapLoading(false);
        setWrapError(e?.message.slice(0, 85));
      });
  };

  const unWrap = async () => {
    setWrapError('');
    setWrapSuccess(false);
    setWrapLoading(true);
    await unwrapProcessing(
      providerWeb3,
      wstethContractWeb3,
      wstETHBalance.update,
      stethBalance.update,
      chainId,
      inputValue,
    )
      .then(() => {
        setWrapLoading(false);
        setWrapSuccess(true);
      })
      .catch((e) => {
        setWrapSuccess(false);
        setWrapError(e?.message);
        setWrapLoading(false);
      });
  };

  return (
    <BlueWrapper>
      <H3>Wrap</H3>
      <Input
        placeholder="Amount"
        type="number"
        name="wrapAmount"
        leftDecorator={<Steth />}
        value={inputValue}
        onChange={handleInputChange}
        step={0.00001}
        max={formatBalance(stethBalance.data, 5)}
        rightDecorator={<InputDecoratorMaxButton onClick={setMaxInputValue} />}
      />
      <Input
        type="number"
        max={STETH_SUBMIT_GAS_LIMIT_DEFAULT}
        value={estimateWrapGas}
        onChange={(e) => setEstimateWrapGas(+e.target.value)}
        rightDecorator={
          <Button
            size="xxs"
            variant="translucent"
            onClick={calculateWrapGas}
            style={{ marginRight: '-10px' }}
          >
            Calculate Gas
          </Button>
        }
      />
      <DataTable>
        <DataTableRow title="Your stETH Balance" loading={!stethBalance.data}>
          {formatBalance(stethBalance.data, 5)}
        </DataTableRow>
        <DataTableRow title="Your wstETH balance" loading={!wstETHBalance.data}>
          {formatBalance(wstETHBalance.data, 5)}
        </DataTableRow>
        <DataTableRow title="Exchange rate" loading={!oneWstethConverted}>
          {`1 stETH = ${formatBalance(oneWstethConverted, 5)} wstETH`}
        </DataTableRow>
        <DataTableRow title="Max gas fee" loading={!wrapTxCostInUsd}>
          {wrapTxCostInUsd}
        </DataTableRow>
      </DataTable>
      {wrapError && (
        <>
          <Divider indents="md" />
          <Text color="error" size="xs">
            {wrapError}
          </Text>
        </>
      )}
      {wrapSuccess && <Text color="success">Success!</Text>}
      <Button color="success" onClick={wrap} loading={isWrapLoading}>
        Wrap
      </Button>
      <Button color="warning" onClick={unWrap} loading={isWrapLoading}>
        Unwrap
      </Button>
    </BlueWrapper>
  );
};

export default WrapForm;
