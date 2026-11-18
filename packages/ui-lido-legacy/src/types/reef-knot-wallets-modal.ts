import type { ReefKnotWalletsModalConfig } from 'reef-knot';
import type { ModalProps } from '../ui-react/index';

export type { ReefKnotWalletsModalConfig } from 'reef-knot';

export type ReefKnotWalletsModalProps<I extends string = string> =
  ModalProps & {
    config: ReefKnotWalletsModalConfig<I>;
    darkThemeEnabled?: boolean;
    buttonsFullWidth?: boolean;
    components?: Partial<import('reef-knot').ReefKnotUIComponents>;
  };
