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
  OptionValue,
  Divider,
} from '@lidofinance/lido-ui';
import { SWRResponse } from '@lido-sdk/react';
import { TOKENS } from '@lido-sdk/constants';
import { BigNumber } from 'ethers';
import { BlueWrapper } from '../info';
import {
  formatBalance,
  getNFTUrl,
  getTxUrl,
} from '../../util/contractTestingUtils';
import { LinkStyled, RequestCounterStyled, RequestStyled } from './styles';

import { useToken } from '../../hooks/useToken';
import { useSplitRequest } from '../../hooks/useSplitRequests';
import { useWithdrawalRequest } from '../../hooks/useWithdrawalRequest';
import { useRequestTxPrice } from '../../hooks/useWithdrawTxPrice';
import { useWithdrawalRequests } from '../../hooks/useWithdrawalsData';
import { useClaim } from '../../hooks/useClaim';

export interface WithdrawalsFormProps {
  stethBalance: SWRResponse<BigNumber>;
  wstethBalance: SWRResponse<BigNumber>;
  chainId: number | undefined;
  account: string | null | undefined;
}

const WithdrawalsForm = ({
  stethBalance,
  wstethBalance,
  chainId,
  account,
}: WithdrawalsFormProps) => {
  const [inputValue, setInputValue] = useState('0.00001');
  const [selectedToken, setSelectedToken] = useState(
    TOKENS.STETH || TOKENS.WSTETH,
  );
  const [selectedRequests, setSelectedRequests] = useState([] as string[]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRequests((prev) => [...prev, e.target.name]);
    } else if (!e.target.checked) {
      const filteredRequests = selectedRequests.filter(
        (r) => r !== e.target.name,
      );
      setSelectedRequests(filteredRequests);
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
    if (data) {
      const sortedSelectedRequests = data.sortedClaimableRequests.filter(
        (req) => selectedRequests.includes(req.stringId),
      );
      await claimMutation(sortedSelectedRequests);
    }
  };

  const submit = useCallback(async (): Promise<void> => {
    await request(requests, () => null);
  }, [request, requests]);

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
        onChange={(value: OptionValue) => setSelectedToken(value as TOKENS)}
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
      />
      <Button onClick={submit} loading={isTxPending} disabled={!account}>
        Request Withdrawal
      </Button>
      <Button onClick={claim} color="warning" disabled={!selectedRequests[0]}>
        Claim
      </Button>
      <DataTable>
        <DataTableRow title="Pending requests" loading={!data?.pendingCount} />
        {data?.pendingRequests.map((req) => (
          <DataTableRow
            loading={loading}
            title={`ID ${req.stringId}`}
            key={req.stringId}
          >
            <RequestStyled>
              <LinkStyled href={getTxUrl(req.stringId, chainId)}>
                <External />
              </LinkStyled>
            </RequestStyled>
          </DataTableRow>
        ))}
        <Divider />
        {data?.claimableAmountOfETH && (
          <DataTableRow title="Ready to claim">
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
                    name={req.stringId}
                    label={`${formatBalance(req.amountOfStETH, 5)} ETH`}
                    checked={selectedRequests[req.stringId]}
                    onChange={handleSelect}
                  />
                </RequestStyled>
              </DataTableRow>
            ))}
          </div>
        )}
        <Divider />
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
