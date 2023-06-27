import React, { ReactNode } from 'react';

import {
  Wrapper,
  Container,
  Title,
  Description,
} from './GradientBanner.styles';

type Props = {
  title: ReactNode;
  description: ReactNode;
};

export const GradientBanner = ({ title, description }: Props) => (
  <Wrapper>
    <Container>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Container>
  </Wrapper>
);
