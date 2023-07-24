import { ReactNode } from 'react';
import styled from 'styled-components';

const BlueWrapperStyle = styled.div`
  overflow: auto;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  min-width: 340px;
  padding: 24px;
  background-color: rgba(0, 163, 255, 0.1);
  border-radius: 20px;
  gap: 10px;

  @media (max-width: 500px) {
    margin-top: 20px;
  }
`;

export const BlueWrapper = (props: { children: ReactNode }) => (
  <BlueWrapperStyle>{props.children}</BlueWrapperStyle>
);
