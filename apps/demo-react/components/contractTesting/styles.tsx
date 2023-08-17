import { Link } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const RequestCounterStyled = styled.span`
  margin-right: 16px;

  svg {
    margin-right: 8px;
    line-height: 0;
    vertical-align: middle;
    margin-top: -2px;
    border: 0;
    padding: 0;
  }
`;

export const RequestStyled = styled.div<{
  $disabled?: boolean;
  $loading?: boolean;
}>`
  padding: 12px 0;
  margin-bottom: 8px;
  background-color: '#F2F5F8';
  display: flex;
  align-items: center;
  height: 24px;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  &:last-child {
    border-bottom-color: var(--lido-color-backgroundSecondary);
  }

  ${({ $loading }) => $loading && `cursor: progress;`}

  a:visited {
    color: var(--lido-color-primary);
  }
`;

export const LinkStyled = styled(Link)`
  display: flex;
  width: 24px;
  height: 24px;

  background: rgba(0, 163, 255, 0.1);
  border-radius: 4px;

  &:hover {
    background: rgba(0, 163, 255, 0.2);
  }
`;
