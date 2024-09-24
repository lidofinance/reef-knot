import styled, { keyframes } from 'styled-components';
import { ArrowBottom } from '@lidofinance/lido-ui';

export const ArrowBottomStyle = styled(ArrowBottom)<{ $open: boolean }>`
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.15s ease-out;
`;

const openAnimation = keyframes`
  0% {
    height: 0;
  }
  100% {
    height: 150px;
  }
`;

const closeAnimation = keyframes`
  0% {
    height: 150px;
  }
  100% {
    height: 0;
  }
`;

export const ContentStyle = styled.div<{ $open: boolean }>`
  height: ${({ $open }) => ($open ? '160px' : '0')};
  overflow-y: auto;
  animation-name: ${({ $open }) => ($open ? openAnimation : closeAnimation)};
  animation-duration: 0.15s;
  animation-timing-function: ease-out;
  transition: all 0.15s ease-out;
`;
