import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useConnection } from 'wagmi';
import {
  useReefKnotContext,
  useReefKnotModal,
  type ReefKnotWalletsModalConfig,
  type ReefKnotTheme,
} from 'reef-knot';
import { ReefKnotWalletsModal as LegacyModal } from '@reef-knot/ui-lido-legacy';
import { ReefKnotWalletsModal as LidoModal } from '@reef-knot/ui-lido';
import { Card, RadioButton, Typography } from '@lidofinance/lido-app-ui';
import { CustomWalletsModal } from './custom-modal';
import styles from './wallet-ui.module.css';

type WalletUIMode = 'legacy' | 'lido-app-ui' | 'custom';
const WalletUIContext = createContext<{
  mode: WalletUIMode;
  theme: ReefKnotTheme;
  disabled: boolean;
  setMode: (mode: WalletUIMode) => void;
} | null>(null);

export const WalletUIProvider = ({
  config,
  theme,
  children,
}: PropsWithChildren<{
  config: ReefKnotWalletsModalConfig;
  theme: ReefKnotTheme;
}>) => {
  const [mode, updateMode] = useState<WalletUIMode>('legacy');
  const { currentModal } = useReefKnotModal();
  const { loadingWalletId } = useReefKnotContext();
  const { status } = useConnection();
  const disabled =
    !!currentModal ||
    loadingWalletId !== null ||
    status === 'connecting' ||
    status === 'reconnecting';
  const setMode = useCallback(
    (next: WalletUIMode) => {
      if (!disabled) updateMode(next);
    },
    [disabled],
  );
  const value = useMemo(
    () => ({ mode, theme, disabled, setMode }),
    [mode, theme, disabled, setMode],
  );
  return (
    <WalletUIContext.Provider value={value}>
      {mode === 'legacy' ? (
        <LegacyModal config={config} darkThemeEnabled={theme === 'dark'} />
      ) : mode === 'lido-app-ui' ? (
        <LidoModal config={config} theme={theme} />
      ) : (
        <CustomWalletsModal config={config} theme={theme} />
      )}
      {children}
    </WalletUIContext.Provider>
  );
};

const MODES = [
  {
    value: 'legacy',
    label: 'Legacy',
    description: 'The original Lido wallet interface.',
  },
  {
    value: 'lido-app-ui',
    label: 'Lido App UI',
    description: 'The wallet interface built with Lido App UI.',
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Custom HTML screens using the public Reef Knot hooks.',
  },
] as const;

export const WalletUISelector = () => {
  const state = useContext(WalletUIContext);
  const titleId = useId();
  if (!state) throw new Error('WalletUISelector requires WalletUIProvider.');
  return (
    <Card className={styles.selector} data-lido-theme={state.theme}>
      <div>
        <fieldset disabled={state.disabled} aria-labelledby={titleId}>
          <Typography
            variant="body"
            weight="semibold"
            as="span"
            id={titleId}
            className={styles.selectorTitle}
          >
            Wallet UI:
          </Typography>
          <div className={styles.options}>
            {MODES.map(({ value, label }) => (
              <RadioButton
                key={value}
                name="wallet-ui"
                value={value}
                checked={state.mode === value}
                disabled={state.disabled}
                onChange={() => state.setMode(value)}
                label={
                  <Typography variant="body" as="span">
                    {label}
                  </Typography>
                }
              />
            ))}
          </div>
        </fieldset>
        <Typography variant="description" className={styles.description}>
          {MODES.find(({ value }) => value === state.mode)?.description}
        </Typography>
        {state.disabled && (
          <Typography
            variant="description"
            className={styles.description}
            role="status"
          >
            Close the wallet dialog and wait for connection to finish before
            switching UI.
          </Typography>
        )}
      </div>
    </Card>
  );
};
