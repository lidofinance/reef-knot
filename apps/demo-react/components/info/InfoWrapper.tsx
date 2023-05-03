import { ReactNode } from 'react';
import styled from 'styled-components';

const InfoWrapperStyle = styled.div`
  overflow: auto;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  margin-top: 80px;
  margin-right: 20px;
  padding: 10px;
  background: antiquewhite;
  border-radius: 10px;

  @media (max-width: 500px) {
    margin-top: 20px;
  }
`;

export const InfoWrapper = (props: { children: ReactNode }) => (
  <InfoWrapperStyle>{props.children}</InfoWrapperStyle>
);
