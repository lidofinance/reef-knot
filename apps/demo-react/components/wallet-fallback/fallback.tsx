import { FC } from 'react';

import { useErrorMessage } from './useErrorMessage';
import { FallbackWalletStyle } from './styles';

export const WalletFallback: FC = (props) => {
  const error = useErrorMessage();

  if (error) {
    return <FallbackWalletStyle {...props}>{error}</FallbackWalletStyle>;
  }

  return null;
};
