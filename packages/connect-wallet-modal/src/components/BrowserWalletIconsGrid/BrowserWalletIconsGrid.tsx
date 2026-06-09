import React, { FC } from 'react';
import type { EIP6963ProviderDetail } from '@reef-knot/core-react';
import TrustIcon from './icons/trust.svg';
import RabbyIcon from './icons/rabby.svg';
import BraveIcon from './icons/brave.svg';
import ZerionIcon from './icons/zerion.svg';
import { Grid, DefaultSvgIcon, IconImg } from './styles';
import { validateIcon } from '../../helpers/validateIcon';
import { useEIP6963ProvidersWithoutAdapters } from '../../hooks/useEIP6963ProvidersWithoutAdapters';

const DEFAULT_WALLETS = [
  { id: 'trust', rdns: 'com.trustwallet.app', Icon: TrustIcon },
  { id: 'rabby', rdns: 'io.rabby', Icon: RabbyIcon },
  { id: 'brave', rdns: 'com.brave.wallet', Icon: BraveIcon },
  { id: 'zerion', rdns: 'io.zerion.extension', Icon: ZerionIcon },
];

type DetectedSlot = {
  kind: 'detected';
  icon: string;
  name: string;
  key: string;
};
type DefaultSlot = {
  kind: 'default';
  Icon: React.FC<React.SVGAttributes<SVGElement>>;
  id: string;
};
type IconSlot = DetectedSlot | DefaultSlot;

// Builds up to 4 icon slots for the grid preview shown on the "Browser Wallet"
// connect button. Detected (EIP-6963) wallets are shown first; any remaining
// slots are filled with static fallback icons so the grid never looks empty.
function buildGridSlots(
  providers: readonly EIP6963ProviderDetail[],
): IconSlot[] {
  // Cap at 4 — that's all the grid displays.
  const count = Math.min(providers.length, 4);

  // First, fill as many slots as possible with real detected provider icons.
  const detectedSlots: IconSlot[] = providers.slice(0, count).map((p) => ({
    kind: 'detected',
    icon: p.info.icon,
    name: p.info.name,
    key: p.info.uuid,
  }));

  // Build a set of detected rdns values to exclude default icons for wallets
  // already shown as detected (e.g. Brave detected via EIP-6963 → hide static Brave icon).
  const detectedRdnsSet = new Set(providers.map((p) => p.info.rdns));

  // Slots (count+1)–4: static fallback icons for wallets not yet detected,
  // filling the remainder of the grid.
  const defaultSlots: IconSlot[] = DEFAULT_WALLETS.filter(
    (w) => !detectedRdnsSet.has(w.rdns),
  )
    .slice(0, 4 - count)
    .map((w) => ({
      kind: 'default',
      Icon: w.Icon,
      id: w.id,
    }));

  return [...detectedSlots, ...defaultSlots];
}

export const BrowserWalletIconsGrid: FC = () => {
  const providers = useEIP6963ProvidersWithoutAdapters();
  const slots = buildGridSlots(providers);

  return (
    <Grid>
      {slots.map((slot) =>
        slot.kind === 'detected' ? (
          <IconImg
            key={slot.key}
            src={validateIcon(slot.icon)}
            alt={slot.name}
          />
        ) : (
          <DefaultSvgIcon key={slot.id} as={slot.Icon} />
        ),
      )}
    </Grid>
  );
};
