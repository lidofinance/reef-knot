import React, { FC } from 'react';
import {
  Text,
  Button,
  Stack,
  StackItem,
  useBreakpoint,
} from '@lidofinance/lido-ui';
import styled from '@reef-knot/ui-react/styled-wrapper';
import { LedgerScreenContainerStyled } from './styles';
import { LedgerImageError } from './icons/LedgerImageError';
import { LedgerImageErrorMobile } from './icons/LedgerImageErrorMobile';

const HeadingStyled = styled(Text)`
  padding-bottom: 4px;
`;

export const LedgerErrorScreen: FC<{ message: string; retry: () => void }> = ({
  message,
  retry,
}) => (
  <LedgerScreenContainerStyled>
    <Stack direction="column" spacing="xl" align="stretch">
      <StackItem>
        <Stack direction="column" spacing="xl" align="center">
          <StackItem>
            {useBreakpoint('md') ? (
              <LedgerImageErrorMobile />
            ) : (
              <LedgerImageError />
            )}
          </StackItem>
          <StackItem>
            <HeadingStyled color="default" size="sm" strong>
              Something went wrong
            </HeadingStyled>
            <Text color="secondary" size="xs">
              {message}
            </Text>
          </StackItem>
        </Stack>
      </StackItem>
      <StackItem>
        <Button variant="ghost" fullwidth onClick={retry}>
          Retry
        </Button>
      </StackItem>
    </Stack>
  </LedgerScreenContainerStyled>
);
