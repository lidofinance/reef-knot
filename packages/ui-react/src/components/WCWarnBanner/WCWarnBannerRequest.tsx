import React, { useContext, useEffect } from 'react';
import { WCWarnBannerContext } from './WCWarnBannerContext';

export const WCWarnBannerRequest = () => {
  const wcWarnBannerContext = useContext(WCWarnBannerContext);
  useEffect(() => {
    console.trace('enabling', wcWarnBannerContext.enable);
    wcWarnBannerContext.enable();
    return () => {
      console.trace('disabling');
      wcWarnBannerContext.disable();
    };
  }, [wcWarnBannerContext]);
  return null;
};
