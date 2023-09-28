import { useContext, useEffect } from 'react';
import { WCWarnBannerContext } from './WCWarnBannerContext';

export const WCWarnBannerRequest = () => {
  const wcWarnBannerContext = useContext(WCWarnBannerContext);
  useEffect(() => {
    wcWarnBannerContext.enable();
    return () => wcWarnBannerContext.disable();
  }, [wcWarnBannerContext]);
  return null;
};
