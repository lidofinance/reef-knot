import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useConfig } from 'wagmi';
import { useReefKnotContext, useReefKnotModal } from '@reef-knot/core-react';

import { WalletsModalProps } from '../../types';
import { WalletModalConnectTermsProps } from '../../../Terms';
import { ConnectWalletModalLayout } from '../ConnectWalletModalLayout';

import { sortWalletsList } from './sortWalletsList';
import type { WalletConnectorData } from '@reef-knot/types';

type ConnectWalletModalProps = WalletsModalProps & {
  onCloseSuccess?: () => void;
  onCloseReject?: () => void;
  termsProps: WalletModalConnectTermsProps;
};

export const ConnectWalletModal = ({
  onCloseSuccess,
  ...passedDownProps
}: ConnectWalletModalProps) => {
  const {
    shouldInvertWalletIcon = false,
    metrics,
    buttonComponentsByConnectorId,
    walletsShown,
    walletsPinned,
    walletsDisplayInitialCount = 6,
  } = passedDownProps;

  const config = useConfig();
  const { walletConnectorsList } = useReefKnotContext();
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
    setShowOtherWallets((value) => !value);
  }, []);

  const isWalletsToggleButtonShown = useRef(false);

  const [walletsList, setWalletsList] = useState<WalletConnectorData[]>([]);
  const [walletsListFull, setWalletsListFull] = useState<WalletConnectorData[]>(
    [],
  );

  const getWalletsListFull = useCallback(async () => {
    // Asynchronously filling wallets list because there is an async wallet detection during wallets sorting.
    // Actually, almost all wallets can be detected synchronously, so this process is expected to be fast,
    // and a loading indicator is not required for now.
    const _walletsListFull = await sortWalletsList({
      config,
      walletConnectorsList,
      walletsShown,
      walletsPinned,
    });
    setWalletsListFull(_walletsListFull);
  }, [config, walletConnectorsList, walletsPinned, walletsShown]);

  useEffect(() => {
    void getWalletsListFull();
  }, [getWalletsListFull]);

  useEffect(() => {
    let _walletsList = walletsListFull;
    if (!isShownOtherWallets) {
      _walletsList = walletsListFull.slice(0, walletsDisplayInitialCount);
    }

    if (inputValue) {
      _walletsList = walletsListFull.filter((wallet) =>
        wallet.walletName.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }

    setWalletsList(_walletsList);
    isWalletsToggleButtonShown.current =
      walletsListFull.length > walletsList.length || isShownOtherWallets;
  }, [
    inputValue,
    isShownOtherWallets,
    walletsDisplayInitialCount,
    walletsList.length,
    walletsListFull,
  ]);

  return (
    <ConnectWalletModalLayout
      inputValue={inputValue}
      isEmptyWalletsList={walletsList.length === 0}
      isShownOtherWallets={isShownOtherWallets}
      isShownWalletsToggleButton={isWalletsToggleButtonShown.current}
      onInputChange={handleInputChange}
      onInputClear={handleInputClear}
      onToggleWalletsList={handleToggleWalletsList}
      {...passedDownProps}
    >
      {walletsList.map((walletData) => {
        const WalletComponent =
          buttonComponentsByConnectorId[walletData.walletId] ??
          buttonComponentsByConnectorId[walletData.connector.id] ??
          buttonComponentsByConnectorId.default;
        if (!WalletComponent) return null;
        return (
          <WalletComponent
            key={walletData.walletId}
            disabled={!termsChecked}
            onConnect={onCloseSuccess}
            shouldInvertWalletIcon={shouldInvertWalletIcon}
            metrics={metrics}
            isCompact={isShownOtherWallets}
            {...walletData}
          />
        );
      })}
    </ConnectWalletModalLayout>
  );
};
