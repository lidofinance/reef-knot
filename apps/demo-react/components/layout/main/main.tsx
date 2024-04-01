import { FC, PropsWithChildren } from 'react';

import { MainStyle } from './mainStyles';

const Main: FC<PropsWithChildren> = (props) => {
  const { children, ...rest } = props;
  return (
    <MainStyle size="full" forwardedAs="main" {...rest}>
      {children}
    </MainStyle>
  );
};

export default Main;
