import { FC, PropsWithChildren } from 'react';

import { WrapperStyle, ActionStyle } from './action-item-styles';

type ActionItemProps = {
  action: () => Promise<unknown>;
  title: string;
};

export const ActionItem: FC<PropsWithChildren<ActionItemProps>> = (props) => {
  const { action, title, children } = props;

  return (
    <WrapperStyle>
      <ActionStyle title={title} walletAction action={action}>
        {children}
      </ActionStyle>
    </WrapperStyle>
  );
};
