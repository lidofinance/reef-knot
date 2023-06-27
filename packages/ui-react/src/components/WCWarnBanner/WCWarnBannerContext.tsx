import React from 'react';
import { createContext } from 'react';

export const WCWarnBannerContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  enable: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disable: () => {},
});
