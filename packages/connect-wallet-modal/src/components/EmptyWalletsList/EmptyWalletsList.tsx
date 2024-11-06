import React from 'react';
import { Button, Text } from '@lidofinance/lido-ui';
import { Wrap, ContentWrap, WalletIcon } from './styles';

type EmptyWalletsListProps = {
  inputValue: string;
  shouldInvertColor?: boolean;
  onClickClear: React.MouseEventHandler<HTMLButtonElement>;
};

export const EmptyWalletsList = ({
  inputValue,
  shouldInvertColor,
  onClickClear,
}: EmptyWalletsListProps) => {
  return (
    <Wrap>
      <WalletIcon />
      <ContentWrap>
        <Text color="secondary" size="xs" weight={700}>
          Search result:{' '}
          <Text color="default" as="span" size="xs" weight={700}>
            {inputValue}
          </Text>
        </Text>
        <Text color="secondary" size="xxs" weight={400}>
          Nothing found
        </Text>
      </ContentWrap>
      <Button
        size="xs"
        color={shouldInvertColor ? 'secondary' : 'primary'}
        variant="translucent"
        onClick={onClickClear}
      >
        Clear search
      </Button>
    </Wrap>
  );
};
