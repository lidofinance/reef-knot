import React, { useCallback, useState } from 'react';
import {
  DataTable,
  DataTableRow,
  H3,
  TickSquare,
  TimeSquare,
  Tooltip,
  Input,
  Select,
  Option,
  Button,
  Checkbox,
  External,
} from '@lidofinance/lido-ui';
import { useSTETHBalance, useWSTETHBalance } from '@lido-sdk/react';
import { TOKENS } from '@lido-sdk/constants';
import { useWeb3 } from 'reef-knot/web3-react';
import { BlueWrapper } from '../info';
import { formatBalance, getNFTUrl } from '../../util/contractTestingUtils';
import { LinkStyled, RequestCounterStyled, RequestStyled } from './styles';

import { useToken } from '../../hooks/useToken';
import { useSplitRequest } from '../../hooks/useSplitRequests';
import { useWithdrawalRequest } from '../../hooks/useWithdrawalRequest';
import { useRequestTxPrice } from '../../hooks/useWithdrawTxPrice';
import { useWithdrawalRequests } from '../../hooks/useWithdrawalsData';
import { useClaim } from '../../hooks/useClaim';

const WithdrawalsForm = () => {
  const stethBalance = useSTETHBalance();
  const wstethBalance = useWSTETHBalance();
  const { chainId } = useWeb3();
  const [inputValue, setInputValue] = useState('0.00001');
  const [selectedToken, setSelectedToken] = useState(TOKENS.STETH);
  const [selectedRequests, setSelectedRequests] = useState([] as string[]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRequests((prev) => [...prev, e.target.name]);
    } else {
      setSelectedRequests((prev) =>
        prev.filter((val) => val !== e.target.name),
      );
    }
  };

  const { requests, requestCount } = useSplitRequest(inputValue, selectedToken);

  const { tokenContract, token } = useToken(selectedToken);

  const { data, loading } = useWithdrawalRequests();

  const { isApprovalFlow, request, isTxPending } = useWithdrawalRequest({
    value: inputValue,
    tokenContract,
    token,
  });

  const { txPriceUsd, loading: requestTxPriceLoading } = useRequestTxPrice({
    token,
    isApprovalFlow,
    requestCount,
  });

  const claimMutation = useClaim();

  const claim = async () => {
    const sortedSelectedRequests = data?.sortedClaimableRequests.filter((req) =>
      selectedRequests.includes(req.stringId),
    );
    await claimMutation(sortedSelectedRequests);
  };

  const submit = useCallback(
    async (_: string, resetForm: () => void) => {
      await request(requests, resetForm);
    },
    [request, requests],
  );

  return (
    <BlueWrapper>
      <H3>Withdrawals</H3>
      <DataTable>
        <DataTableRow title="My requests" loading={!data}>
          <RequestCounterStyled>
            <Tooltip title="Ready to claim">
              <span>
                <TickSquare />
                <span>{data?.readyCount}</span>
              </span>
            </Tooltip>
          </RequestCounterStyled>
          <RequestCounterStyled>
            <Tooltip title="Pending">
              <span>
                <TimeSquare />
                <span>{data?.pendingCount}</span>
              </span>
            </Tooltip>
          </RequestCounterStyled>
        </DataTableRow>
      </DataTable>
      <Select
        value={selectedToken}
        onChange={(value) => setSelectedToken(value)}
      >
        <Option value={TOKENS.STETH}>stETH</Option>
        <Option value={TOKENS.WSTETH}>wstETH</Option>
      </Select>
      <Input
        type="number"
        onChange={handleInputChange}
        value={inputValue}
        step="0.00001"
        max={
          selectedToken === TOKENS.WSTETH
            ? wstethBalance.data?.toString()
            : stethBalance.data?.toString()
        }
        error={
          selectedToken === TOKENS.WSTETH && +inputValue < 1
            ? 'Min value is 1 wstETH'
            : null
        }
      />
      <Button onClick={submit} loading={isTxPending}>
        Request Withdrawal
      </Button>
      <Button onClick={claim} color="warning" disabled={!selectedRequests[0]}>
        Claim
      </Button>
      <DataTable>
        {data?.claimableAmountOfETH && (
          <DataTableRow title="Claimable amount">
            {`${formatBalance(data.claimableAmountOfETH, 5)} ETH`}
          </DataTableRow>
        )}
        {data?.sortedClaimableRequests && (
          <div>
            {data?.sortedClaimableRequests.map((req) => (
              <DataTableRow
                loading={loading}
                title={`ID ${req.stringId}`}
                key={req.stringId}
              >
                <RequestStyled>
                  <LinkStyled href={getNFTUrl(req.stringId, chainId)}>
                    <External />
                  </LinkStyled>
                  <Checkbox
                    name={req.id.toString()}
                    label={`${formatBalance(req.amountOfStETH, 5)} ETH`}
                    checked={selectedRequests[req.id.toString()]}
                    onChange={handleSelect}
                  />
                </RequestStyled>
              </DataTableRow>
            ))}
          </div>
        )}
        <DataTableRow title="Your stETH balance" loading={!stethBalance.data}>
          {`${formatBalance(stethBalance.data, 5)} stETH`}
        </DataTableRow>
        <DataTableRow title="Your wstETH balance">
          {`${formatBalance(wstethBalance.data, 5)} wstETH`}
        </DataTableRow>
        <DataTableRow title="Exchange rate">1 stETH = 1 ETH</DataTableRow>
        <DataTableRow
          title="Max transaction cost"
          loading={requestTxPriceLoading || !txPriceUsd}
        >
          {`${txPriceUsd?.toFixed(2)}$`}
        </DataTableRow>
      </DataTable>
    </BlueWrapper>
  );
};

export default WithdrawalsForm;
