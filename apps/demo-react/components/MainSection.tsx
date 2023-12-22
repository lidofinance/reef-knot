import { ReactNode } from 'react';
import { Section } from '@lidofinance/lido-ui';
import { MainSection } from '../styles/global';

const Main = ({ children }: { children?: ReactNode }) => {
  return (
    <Section>
      <MainSection>{children}</MainSection>
    </Section>
  );
};
export default Main;
