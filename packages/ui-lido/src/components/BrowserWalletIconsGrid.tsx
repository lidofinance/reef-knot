import React from 'react';
import {
  useEIP6963ProvidersWithoutAdapters,
  validateIcon,
  FALLBACK_WALLET_ICON,
} from 'reef-knot';
import TrustIcon from './browser-wallet-icons/trust';
import RabbyIcon from './browser-wallet-icons/rabby';
import BraveIcon from './browser-wallet-icons/brave';
import ZerionIcon from './browser-wallet-icons/zerion';

const DEFAULT_WALLETS = [
  { rdns: 'com.trustwallet.app', Icon: TrustIcon },
  { rdns: 'io.rabby', Icon: RabbyIcon },
  { rdns: 'com.brave.wallet', Icon: BraveIcon },
  { rdns: 'io.zerion.extension', Icon: ZerionIcon },
];

/** Preview the Browser picker providers, filling unused slots with familiar wallets. */
export function BrowserWalletIconsGrid() {
  const providers = useEIP6963ProvidersWithoutAdapters();
  const detected = providers.slice(0, 4);
  const detectedRdns = new Set(providers.map((provider) => provider.info.rdns));
  const defaults = DEFAULT_WALLETS.filter(
    (wallet) => !detectedRdns.has(wallet.rdns),
  ).slice(0, 4 - detected.length);

  return (
    <span className="rk-lido-browser-icons" aria-hidden="true">
      {detected.map(({ info }) => (
        <img
          key={info.uuid}
          src={validateIcon(info.icon) ?? FALLBACK_WALLET_ICON}
          alt=""
          onError={(event) => {
            event.currentTarget.src = FALLBACK_WALLET_ICON;
          }}
        />
      ))}
      {defaults.map(({ rdns, Icon }) => (
        <Icon key={rdns} />
      ))}
    </span>
  );
}
