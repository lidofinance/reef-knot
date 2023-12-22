import React, { useState } from 'react';
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
  External,
  SelectIcon,
  Eth,
  InputGroup,
} from '@lidofinance/lido-ui';
import { SWRResponse } from '@lido-sdk/react';
import { WstethAbi } from '@lido-sdk/contracts';
import { BigNumber } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { formatBalance, getTxUrl } from '../../util/contractTestingUtils';
import { BlueWrapper } from '../info';
import { STETH_SUBMIT_GAS_LIMIT_DEFAULT } from '../../hooks/useStethSubmitGasLimit';
import { InputDecoratorMaxButton } from '../input-decorator-max-button';
import {
  unwrapProcessing,
  wrapProcessingWithApprove,
} from '../../util/wrapProcessingWithApprove';
import { LinkStyled } from './styles';
import { CHAINS } from '../../config/chains';

export interface WrapFormProps {
  ethBalance: SWRResponse<BigNumber>;
  stethBalance: SWRResponse<BigNumber>;
  wstethContractWeb3: WstethAbi | null;
  chainId: CHAINS;
  account: string | null | undefined;
  providerWeb3: Web3Provider | undefined;
  wstethBalance: SWRResponse<BigNumber>;
  wrapCostInUsd: number | undefined;
  wrapGasLimit: number;
  oneWstethConverted: BigNumber | undefined;
}

const WrapForm = ({
  ethBalance,
  stethBalance,
  wstethContractWeb3,
  chainId,
  account,
  providerWeb3,
  wstethBalance,
  wrapCostInUsd,
  wrapGasLimit,
  oneWstethConverted,
}: WrapFormProps) => {
  const [inputValue, setInputValue] = useState('0.00001');

  const [estimateWrapGas, setEstimateWrapGas] = useState(0);
  const [wrapTxHash, setWrapTxHash] = useState('');
  const [isWrapLoading, setWrapLoading] = useState(false);
  const [wrapSelect, setWrapSelect] = useState('wrap');
  const [wrapCoin, setWrapCoin] = useState('ETH');

  const [wrapError, setWrapError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleWrapSelectChange = (value: OptionValue) => {
    setWrapSelect(value as string);
  };
  const handleWrapCoinChange = (value: string | number) => {
    setWrapCoin(`${value}`);
    setInputValue('0.00001');
  };
  const setMaxInputValue = () => {
    let choosenCoinBalance;
    switch (wrapCoin) {
      case 'ETH':
        choosenCoinBalance = ethBalance.data;
        break;
      case 'stETH':
        choosenCoinBalance = stethBalance.data;
        break;
      case 'wstETH':
        choosenCoinBalance = wstethBalance.data;
        break;
      default:
        return choosenCoinBalance;
    }
    setInputValue(formatBalance(choosenCoinBalance, 5));
  };

  const calculateWrapGas = () => {
    setEstimateWrapGas(wrapGasLimit);
  };

  const wrap = async () => {
    setWrapTxHash('');
    setWrapError('');
    setWrapLoading(true);
    await wrapProcessingWithApprove(
      chainId,
      providerWeb3,
      wstethContractWeb3,
      ethBalance.update,
      stethBalance.update,
      inputValue,
      wrapCoin,
    )
      .then((data) => {
        setWrapLoading(false);
        setWrapTxHash(data.hash);
      })
      .catch((e) => {
        setWrapTxHash('');
        setWrapLoading(false);
        setWrapError(e?.message.slice(0, 85));
      });
  };

  const unWrap = async () => {
    setWrapError('');
    setWrapTxHash('');
    setWrapLoading(true);
    await unwrapProcessing(
      providerWeb3,
      wstethContractWeb3,
      wstethBalance.update,
      stethBalance.update,
      chainId,
      inputValue,
    )
      .then((data) => {
        setWrapLoading(false);
        setWrapTxHash(data.hash);
      })
      .catch((e) => {
        setWrapTxHash('');
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
      <InputGroup>
        {isWrapSelected && (
          <SelectIcon
            icon={wrapCoin === 'ETH' ? <Eth /> : <Steth />}
            onChange={handleWrapCoinChange}
            value={wrapCoin}
          >
            <Option value="ETH" leftDecorator={<Eth />}>
              ETH
            </Option>
            <Option value="stETH" leftDecorator={<Steth />}>
              stETH
            </Option>
          </SelectIcon>
        )}
        <Input
          placeholder="Amount"
          type="number"
          name="wrapAmount"
          leftDecorator={!isWrapSelected && <Wsteth />}
          value={inputValue}
          onChange={handleInputChange}
          step={0.00001}
          max={formatBalance(
            isWrapSelected ? stethBalance.data : wstethBalance.data,
            5,
          )}
          rightDecorator={
            <InputDecoratorMaxButton onClick={setMaxInputValue} />
          }
        />
      </InputGroup>
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
        <DataTableRow title="Your wstETH balance" loading={!wstethBalance.data}>
          {`${formatBalance(wstethBalance.data, 5)} wstETH`}
        </DataTableRow>
        <DataTableRow title="Exchange rate" loading={!oneWstethConverted}>
          {`1 stETH = ${formatBalance(oneWstethConverted, 5)} wstETH`}
        </DataTableRow>
        <DataTableRow title="Max gas fee" loading={!wrapCostInUsd}>
          {`${wrapCostInUsd?.toFixed(2)}$`}
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
      {wrapTxHash && (
        <>
          <Divider />
          <Text>About transaction</Text>
          <DataTable>
            <DataTableRow title="Transaction status">
              <LinkStyled href={getTxUrl(wrapTxHash, chainId)}>
                <External />
              </LinkStyled>
            </DataTableRow>
          </DataTable>
          <Divider />
        </>
      )}

      {wrapSelect === 'wrap' ? (
        <Button
          color="success"
          onClick={wrap}
          loading={isWrapLoading}
          disabled={!account}
        >
          Wrap
        </Button>
      ) : (
        <Button
          color="warning"
          onClick={unWrap}
          loading={isWrapLoading}
          disabled={!account}
        >
          Unwrap
        </Button>
      )}
    </BlueWrapper>
  );
};

export default WrapForm;
