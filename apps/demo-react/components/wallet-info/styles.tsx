import styled from 'styled-components';
import { DataTableRow, ButtonIcon, Button, Input } from '@lidofinance/lido-ui';

export const ContainerStyle = styled.div`
  position: fixed;
  inset: 0px;
  overflow: hidden;
  z-index: 300;
  pointer-events: none;
`;

export const WrapperStyle = styled.div<{ $show: boolean }>`
  z-index: 200;
  overflow-y: scroll;
  width: 472px;
  height: 100vh;
  padding: 22px 40px;
  background-color: ${({ theme }) =>
    theme.name === 'dark' ? '#1e2938' : '#dddfe2'};
  position: absolute;
  left: 100%;
  top: 0%;
  transform: ${({ $show }) =>
    $show ? 'translate(-100%, 0%)' : 'translate(0%, 0%)'};
  transition: transform 0.15s ease-out;
  pointer-events: all;

  @media (max-width: 900px) {
    min-width: 200px;
  }

  box-shadow: ${({ theme }) => theme.boxShadows.lg} rgba(39, 56, 82, 0.08);
  background: var(--lido-color-background);
  color: var(--lido-color-textSecondary);
`;

export const HeadingStyle = styled.h4`
  margin: 12px 0;
`;

export const DataTableRowStyle = styled(DataTableRow)`
  margin: 4px 0;
  align-items: center;
`;

export const DataTableRowInput = styled(Input)`
  width: 220px;

  > span {
    padding: 4px 10px;
  }

  input {
    font-size: 12px;
  }
`;

export const DataTableRowAction = styled(Button).attrs({
  size: 'xs',
})`
  padding: 0;
  min-width: auto;
  margin-left: 6px;
  border: none;
  width: 26px;
  height: 26px;
  cursor: pointer;
`;

export const ProviderInfoRowStyle = styled(DataTableRowStyle)`
  & div:last-child {
    word-break: break-all;
  }
`;

export const ProviderInfoContentStyle = styled.div`
  padding: 8px 12px;
`;

export const WalletInfoHeaderStyles = styled.div`
  margin-bottom: 22px;
  display: flex;
`;

export const CloseButtonStyle = styled(ButtonIcon)`
  margin-left: auto;

  &:before {
    border: 1px solid rgba(0, 10, 61, 0.12);
  }
`;
