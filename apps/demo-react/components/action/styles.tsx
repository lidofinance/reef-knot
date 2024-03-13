import { Block } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const ActionBlock = styled(Block)`
  padding: 8px;
`;
export const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 5px;
`;

export const ResultCode = styled.div`
  overflow: auto;
  max-width: 100%;
  max-height: 500px;
`;

export const SuccessMessage = styled.span`
  color: ${({ theme }) => theme.colors.success};
`;

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error};
  word-break: break-word;
  white-space: break-spaces;
`;
