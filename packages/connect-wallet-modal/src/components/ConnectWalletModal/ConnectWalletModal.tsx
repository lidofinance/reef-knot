import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useConfig } from 'wagmi';
import {
  LS_KEY_RECONNECT_WALLET_ID,
  useReefKnotContext,
  useReefKnotModal,
} from '@reef-knot/core-react';
import type {
  WalletAdapterData,
  ReefKnotWalletsModalProps,
} from '@reef-knot/types';

import { ConnectWalletModalLayout } from '../ConnectWalletModalLayout';

import { sortWalletsList } from '../../helpers/sortWalletsList';

type ConnectWalletModalProps = ReefKnotWalletsModalProps & {
  onCloseSuccess?: () => void;
  onCloseReject?: () => void;
};

export const ConnectWalletModal = ({
  onCloseSuccess,
  ...passedDownProps
}: ConnectWalletModalProps) => {
  const { config: modalConfig, darkThemeEnabled = false } = passedDownProps;
  const {
    buttonComponentsByConnectorId,
    walletsShown,
    walletsPinned,
    walletsDisplayInitialCount = 6,
    onConnectStart,
    onConnectSuccess,
    onClickWalletsMore,
    onClickWalletsLess,
  } = modalConfig;

  const config = useConfig();
  const { walletDataList, loadingWalletId } = useReefKnotContext();
  const { termsChecked } = useReefKnotModal();

  const [inputValue, setInputValue] = useState('');
  const [isShownOtherWallets, setShowOtherWallets] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.currentTarget.value);
    },
    [],
  );

  const handleInputClear = useCallback(() => {
    setInputValue('');
  }, []);

  const handleToggleWalletsList = useCallback(() => {
    const nextShownState = !isShownOtherWallets;
    setShowOtherWallets(nextShownState);
    if (nextShownState) {
      onClickWalletsMore?.();
    } else {
      onClickWalletsLess?.();
    }
  }, [isShownOtherWallets, onClickWalletsMore, onClickWalletsLess]);

  const [walletsListFull, setWalletsListFull] = useState<WalletAdapterData[]>(
    [],
  );

  const handleConnectSuccess = useCallback(
    (walletId: string) => {
      void config.storage?.setItem(LS_KEY_RECONNECT_WALLET_ID, walletId);
      onCloseSuccess?.();
      onConnectSuccess?.({ walletId });
    },
    [onCloseSuccess, onConnectSuccess, config.storage],
  );

  useEffect(() => {
    let isActive = true;
    const fetch = async () => {
      // Asynchronously filling wallets list because there is an async wallet detection during wallets sorting.
      // Actually, almost all wallets can be detected synchronously, so this process is expected to be fast,
      // and a loading indicator is not required for now.
      const _walletsListFull = await sortWalletsList({
        walletDataList,
        walletsShown,
        walletsPinned,
      });
      if (isActive) setWalletsListFull(_walletsListFull);
    };
    void fetch();
    return () => {
      isActive = false;
    };
  }, [config, walletDataList, walletsPinned, walletsShown]);

  const walletsList = useMemo(() => {
    let _walletsList = walletsListFull;

    if (!isShownOtherWallets) {
      _walletsList = walletsListFull.slice(0, walletsDisplayInitialCount);
    }

    if (inputValue) {
      _walletsList = walletsListFull.filter((wallet) =>
        wallet.walletName.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }

    return _walletsList;
  }, [
    inputValue,
    isShownOtherWallets,
    walletsDisplayInitialCount,
    walletsListFull,
  ]);

  const isWalletsToggleButtonShown =
    walletsListFull.length > walletsList.length || isShownOtherWallets;

  const someWalletIsLoading =
    loadingWalletId != null && loadingWalletId.length > 0;

  return (
    <ConnectWalletModalLayout
      inputValue={inputValue}
      isEmptyWalletsList={walletsList.length === 0}
      isShownOtherWallets={isShownOtherWallets}
      isShownWalletsToggleButton={isWalletsToggleButtonShown}
      onInputChange={handleInputChange}
      onInputClear={handleInputClear}
      onToggleWalletsList={handleToggleWalletsList}
      {...passedDownProps}
    >
      {walletsList.map(({ type, walletId, ...walletData }) => {
        const WalletComponent =
          buttonComponentsByConnectorId[walletId] ??
          buttonComponentsByConnectorId[type] ??
          buttonComponentsByConnectorId.default;
        if (!WalletComponent) return null;
        return (
          <WalletComponent
            key={walletId}
            icon={walletData.icon}
            walletId={walletId}
            walletName={walletData.walletName}
            disabled={!termsChecked || someWalletIsLoading}
            darkThemeEnabled={darkThemeEnabled}
            isCompact={isShownOtherWallets}
            connector={walletData.createConnectorFn}
            detector={walletData.detector}
            deeplink={walletData.deeplink}
            downloadURLs={walletData.downloadURLs}
            walletconnectExtras={walletData.walletconnectExtras}
            onConnectStart={() => onConnectStart?.({ walletId })}
            onConnectSuccess={() => handleConnectSuccess(walletId)}
          />
        );
      })}
    </ConnectWalletModalLayout>
  );
};
