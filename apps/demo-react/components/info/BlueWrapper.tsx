import { ReactNode } from 'react';
import styled from 'styled-components';

const BlueWrapperStyle = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  min-width: 250px;
  max-width: 340px;
  padding: 24px;
  background-color: rgba(0, 163, 255, 0.1);
  border-radius: 20px;
  gap: 10px;

  @media (max-width: 900px) {
    min-width: 200px;
  }
`;

export const BlueWrapper = (props: { children: ReactNode }) => (
  <BlueWrapperStyle>{props.children}</BlueWrapperStyle>
);
