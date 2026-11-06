import { FC, useCallback } from 'react';
import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { useConnectionFlow } from 'reef-knot';

import { useClientConfig } from 'providers/client-config';

const WalletConnect: FC<ButtonProps> = (props) => {
  const { isWalletConnectionAllowed } = useClientConfig();
  const { onClick, ...rest } = props;
  const { startConnection } = useConnectionFlow();

  const handleClick = useCallback(() => {
    if (!isWalletConnectionAllowed) return;
    void startConnection();
  }, [isWalletConnectionAllowed, startConnection]);

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
