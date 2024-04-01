import { FC, PropsWithChildren } from 'react';
import { Section, SectionProps, Block } from '@lidofinance/lido-ui';

export const Content: FC<PropsWithChildren<SectionProps>> = ({
  children,
  ...rest
}) => {
  return (
    <Section {...rest}>
      <Block>{children}</Block>
    </Section>
  );
};
