import React from 'react'
import { Section, Block } from '@lidofinance/lido-ui';

const MainSection: React.FC = ({ children }) => {
  return (
    <Section>
      <Block>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '40px' }}>
          {children}
        </div>
      </Block>
    </Section>
  )
}
export default MainSection;