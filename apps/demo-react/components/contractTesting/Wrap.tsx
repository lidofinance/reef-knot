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
  Option,
  Select,
  OptionValue,
  Wsteth,
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
  const [wrapSelect, setWrapSelect] = useState('wrap');

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
  const wrapTxCostInUsd = useTxCostInUsd({ gasLimit: wrapGasLimit });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleWrapSelectChange = (value: OptionValue) => {
    setWrapSelect(value as string);
  };
  const setMaxInputValue = () => {
    setInputValue(
      formatBalance(isWrapSelected ? stethBalance.data : wstETHBalance.data, 5),
    );
  };

  const wrapGas = useWrapGasLimit(true);

  const calculateWrapGas = () => {
    setEstimateWrapGas(wrapGas);
  };

  const wrap = async () => {
    setWrapSuccess(false);
    setWrapError('');
    setWrapLoading(true);
    await wrapProcessingWithApprove(
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
  const isWrapSelected = wrapSelect === 'wrap';

  return (
    <BlueWrapper>
      <H3>Wrap/Unwrap</H3>
      <Select value={wrapSelect} onChange={handleWrapSelectChange}>
        <Option value="wrap">Wrap</Option>
        <Option value="unwrap">Unwrap</Option>
      </Select>
      <Input
        placeholder="Amount"
        type="number"
        name="wrapAmount"
        leftDecorator={isWrapSelected ? <Steth /> : <Wsteth />}
        value={inputValue}
        onChange={handleInputChange}
        step={0.00001}
        max={formatBalance(
          isWrapSelected ? stethBalance.data : wstETHBalance.data,
          5,
        )}
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
        <DataTableRow title="Your stETH balance" loading={!stethBalance.data}>
          {`${formatBalance(stethBalance.data, 5)} stETH`}
        </DataTableRow>
        <DataTableRow title="Your wstETH balance" loading={!wstETHBalance.data}>
          {`${formatBalance(wstETHBalance.data, 5)} wstETH`}
        </DataTableRow>
        <DataTableRow title="Exchange rate" loading={!oneWstethConverted}>
          {`1 stETH = ${formatBalance(oneWstethConverted, 5)} wstETH`}
        </DataTableRow>
        <DataTableRow title="Max gas fee" loading={!wrapTxCostInUsd}>
          {`${wrapTxCostInUsd?.toFixed(2)}$`}
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
      {wrapSelect === 'wrap' ? (
        <Button color="success" onClick={wrap} loading={isWrapLoading}>
          Wrap
        </Button>
      ) : (
        <Button color="warning" onClick={unWrap} loading={isWrapLoading}>
          Unwrap
        </Button>
      )}
    </BlueWrapper>
  );
};

export default WrapForm;
