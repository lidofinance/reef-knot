import styled from 'styled-components';
import { Action } from 'components/action';

export const WrapperStyle = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0;
`;

export const ActionStyle = styled(Action)`
  word-break: break-word;
  display: flex;
`;
