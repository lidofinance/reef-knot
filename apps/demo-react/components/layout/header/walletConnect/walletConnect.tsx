import { FC, useCallback } from 'react';
import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { useConnect } from 'reef-knot/core-react';

import { useClientConfig } from 'providers/client-config';

const WalletConnect: FC<ButtonProps> = (props) => {
  const { isWalletConnectionAllowed } = useClientConfig();
  const { onClick, ...rest } = props;
  const { connect } = useConnect();

  const handleClick = useCallback(() => {
    if (!isWalletConnectionAllowed) return;
    void connect();
  }, [isWalletConnectionAllowed, connect]);

  return (
    <Button
      disabled={!isWalletConnectionAllowed}
      onClick={handleClick}
      data-testid="connectBtn"
      {...rest}
    >
      Connect wallet
    </Button>
  );
};

export default WalletConnect;
