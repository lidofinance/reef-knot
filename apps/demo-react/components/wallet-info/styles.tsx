import styled from 'styled-components';
import { DataTableRow, ArrowLeft, ButtonIcon } from '@lidofinance/lido-ui';

export const ContainerStyle = styled.div`
  position: fixed;
  inset: 0px;
  overflow: hidden;
  z-index: 300;
  pointer-events: none;
`;

export const WrapperStyle = styled.div<{ $show: boolean }>`
  z-index: 200;
  margin: var(--header-size) 0;
  width: 360px;
  padding: 24px;
  background-color: ${({ theme }) =>
    theme.name === 'dark' ? '#1e2938' : '#dddfe2'};
  border-radius: 20px;
  position: absolute;
  left: 100%;
  top: 50%;
  transform: ${({ $show }) =>
    $show ? 'translate(-100%, -50%)' : 'translate(0%, -50%)'};
  transition: transform 0.15s ease-out;
  pointer-events: all;

  @media (max-width: 900px) {
    min-width: 200px;
  }
`;

export const HeadingStyle = styled.h4`
  margin: 12px 0;
`;

export const DataTableRowStyle = styled(DataTableRow)`
  margin: 4px 0;
`;

export const ArrowLeftStyle = styled(ArrowLeft)<{ $open: boolean }>`
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.15s ease-out;
`;

export const ButtonIconStyle = styled(ButtonIcon)`
  position: absolute;
  right: 100%;
  top: 50%;
  margin-right: 8px;
  transform: translate(0, -50%);
`;

export const ProviderInfoRowStyle = styled(DataTableRowStyle)`
  & div:last-child {
    word-break: break-all;
  }
`;

export const ProviderInfoContentStyle = styled.div`
  padding: 8px 12px;
`;
