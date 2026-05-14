import React, { FC } from 'react';
import { useEIP6963Providers } from '@reef-knot/core-react';
import type { EIP6963ProviderDetail } from '@reef-knot/core-react';
import TrustIcon from './icons/trust.svg';
import RabbyIcon from './icons/rabby.svg';
import BraveIcon from './icons/brave.svg';
import ZerionIcon from './icons/zerion.svg';
import { Grid, DefaultSvgIcon, IconImg } from './styles';

const DEFAULT_WALLETS = [
  { id: 'trust', name: 'Trust', Icon: TrustIcon },
  { id: 'rabby', name: 'Rabby', Icon: RabbyIcon },
  { id: 'brave', name: 'Brave', Icon: BraveIcon },
  { id: 'zerion', name: 'Zerion', Icon: ZerionIcon },
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

  // Build a set of detected wallet names.
  // The set is needed here so we can avoid duplicates for wallets already detected,
  // e.g. when Trust is both detected and a default.
  const detectedNames = new Set(
    providers.map((p) => p.info.name.toLowerCase()),
  );

  // Slots (count+1)–4: static fallback icons for wallets not yet detected,
  // filling the remainder of the grid.
  const defaultSlots: IconSlot[] = DEFAULT_WALLETS.filter(
    (w) => !detectedNames.has(w.name.toLowerCase()),
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
  const providers = useEIP6963Providers();
  const slots = buildGridSlots(providers);

  return (
    <Grid>
      {slots.map((slot) =>
        slot.kind === 'detected' ? (
          <IconImg key={slot.key} src={slot.icon} alt={slot.name} />
        ) : (
          <DefaultSvgIcon key={slot.id} as={slot.Icon} />
        ),
      )}
    </Grid>
  );
};
