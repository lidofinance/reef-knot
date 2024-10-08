import {
  createContext,
  useMemo,
  useCallback,
  memo,
  useState,
  FC,
  PropsWithChildren,
} from 'react';
import { useThemeToggle } from '@lidofinance/lido-ui';
import { WalletsModalForEth } from 'reef-knot/connect-wallet-modal';
import WalletModal from 'components/walletModal';
import metrics from 'utils/metrics';

export type ModalContextValue = {
  openModal: (modal: MODAL) => void;
  closeModal: () => void;
};

export enum MODAL {
  connect,
  wallet,
}

export const ModalContext = createContext({} as ModalContextValue);

const LINK_DONT_HAVE_WALLET_DEFAULT =
  'https://support.metamask.io/hc/en-us/articles/360015489531-Getting-started-with-MetaMask';

const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [active, setActive] = useState<MODAL | null>(null);
  const { themeName } = useThemeToggle();

  const openModal = useCallback((modal: MODAL) => {
    setActive(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActive(null);
  }, []);

  const value = useMemo(
    () => ({
      openModal,
      closeModal,
    }),
    [closeModal, openModal],
  );

  const common = {
    onClose: closeModal,
    shouldInvertWalletIcon: themeName === 'dark',
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <WalletModal open={active === MODAL.wallet} {...common} />
      <WalletsModalForEth
        metrics={metrics}
        shouldInvertWalletIcon={themeName === 'dark'}
        linkDontHaveWallet={LINK_DONT_HAVE_WALLET_DEFAULT}
        walletsPinned={['binanceWallet', 'browserExtension']}
        onClickWalletsMore={() =>
          console.log('metrics: wallets modal show more')
        }
        onClickWalletsLess={() =>
          console.log('metrics: wallets modal show less')
        }
      />
    </ModalContext.Provider>
  );
};

export default memo<FC<PropsWithChildren>>(ModalProvider);
