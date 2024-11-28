import React, { FC } from 'react';
import { Text, Button, Stack, StackItem } from '@lidofinance/lido-ui';
import styled from '@reef-knot/ui-react/styled-wrapper';
import { LedgerScreenContainerStyled } from './styles';

const HeadingStyled = styled(Text)`
  padding-bottom: 4px;
`;

type LedgerActionScreenProps = {
  icon: React.ReactNode;
  heading?: React.ReactNode;
  message?: React.ReactNode;
  action?: React.ReactNode;
  onClickAction?: () => void;
};

export const LedgerModalScreen: FC<LedgerActionScreenProps> = ({
  icon,
  heading,
  message,
  action,
  onClickAction,
}) => (
  <LedgerScreenContainerStyled>
    <Stack direction="column" spacing="xl" align="stretch">
      <StackItem>
        <Stack direction="column" spacing="xl" align="center">
          <StackItem>{icon}</StackItem>
          <StackItem>
            {heading && (
              <HeadingStyled color="default" size="sm" strong>
                {heading}
              </HeadingStyled>
            )}
            {message && (
              <Text color="secondary" size="xs">
                {message}
              </Text>
            )}
          </StackItem>
        </Stack>
      </StackItem>
      {action && (
        <StackItem>
          <Button variant="ghost" fullwidth onClick={onClickAction}>
            {action}
          </Button>
        </StackItem>
      )}
    </Stack>
  </LedgerScreenContainerStyled>
);
