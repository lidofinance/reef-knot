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

function buildGridSlots(
  providers: readonly EIP6963ProviderDetail[],
): IconSlot[] {
  const count = Math.min(providers.length, 4);
  const detectedSlots: IconSlot[] = providers.slice(0, count).map((p) => ({
    kind: 'detected',
    icon: p.info.icon,
    name: p.info.name,
    key: p.info.uuid,
  }));

  const detectedNames = new Set(
    providers.map((p) => p.info.name.toLowerCase()),
  );
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
