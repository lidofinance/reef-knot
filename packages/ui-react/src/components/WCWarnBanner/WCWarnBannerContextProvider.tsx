import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { WCWarnBannerContext } from './WCWarnBannerContext';
import { WCWarnBanner } from './WCWarnBanner';
import { WCWarnBannerAutoRequest } from './WCWarnBannerAutoRequest';

export const WCWarnBannerContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [counter, setCounter] = useState(0);
  const [portalTarget, setPortalTarget] = useState<HTMLElement>();
  const providerValue = useMemo(
    () => ({
      enable: () => setCounter((val) => val + 1),
      disable: () => setCounter((val) => val - 1),
    }),
    [],
  );

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    setPortalTarget(
      counter <= 0
        ? undefined
        : (value) => {
            if (value) {
              return value;
            }
            return document.createElement('div');
          },
    );
  }, [counter, portalTarget]);

  useEffect(() => {
    if (typeof document === 'undefined' || !portalTarget) {
      return;
    }
    portalTarget.style.position = 'relative';
    portalTarget.style.zIndex = '10000';
    document.body.insertAdjacentElement('afterbegin', portalTarget);
    return () => {
      document.body.removeChild(portalTarget);
    };
  }, [portalTarget]);

  return (
    <WCWarnBannerContext.Provider value={providerValue}>
      <WCWarnBannerAutoRequest />
      {portalTarget ? createPortal(<WCWarnBanner />, portalTarget) : null}
      {children}
    </WCWarnBannerContext.Provider>
  );
};
