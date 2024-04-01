import React, { useCallback, useMemo, useState } from 'react';
import { useReefKnotModal } from '@reef-knot/core-react';

import { WalletsModalProps } from '../../types';
import { WalletModalConnectTermsProps } from '../../../Terms';
import { ConnectWalletModalLayout } from '../ConnectWalletModalLayout';

import { sortWalletsList } from './sortWalletsList';

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
    walletDataList,
    walletsShown,
    walletsPinned,
    walletsDisplayInitialCount = 6,
  } = passedDownProps;

  const { termsChecked } = useReefKnotModal();

  const [inputValue, setInputValue] = useState('');
  const [isShownOtherWallets, setShowOtherWallets] = useState(false);

  const walletsListFull = useMemo(() => {
    return sortWalletsList({
      walletDataList,
      walletsShown,
      walletsPinned,
    });
  }, [walletDataList, walletsShown, walletsPinned]);

  const walletsList = useMemo(() => {
    if (!isShownOtherWallets) {
      return walletsListFull.slice(0, walletsDisplayInitialCount);
    }

    if (inputValue) {
      return walletsListFull.filter((wallet) =>
        wallet.walletName.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }

    return walletsListFull;
  }, [
    inputValue,
    walletsListFull,
    isShownOtherWallets,
    walletsDisplayInitialCount,
  ]);

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

  const isWalletsListEmpty = walletsList.length === 0;
  const isWalletsToggleButtonShown =
    walletsListFull.length > walletsList.length || isShownOtherWallets;

  return (
    <ConnectWalletModalLayout
      inputValue={inputValue}
      isEmptyWalletsList={isWalletsListEmpty}
      isShownOtherWallets={isShownOtherWallets}
      isShownWalletsToggleButton={isWalletsToggleButtonShown}
      onInputChange={handleInputChange}
      onInputClear={handleInputClear}
      onToggleWalletsList={handleToggleWalletsList}
      {...passedDownProps}
    >
      {walletsList.map((walletData) => {
        const WalletComponent =
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
