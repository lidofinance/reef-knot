import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useReefKnotModal } from '@reef-knot/core-react';
import { isMobileOrTablet } from '@reef-knot/wallets-helpers';

import { Link } from '@lidofinance/lido-ui';
import { Modal } from '@reef-knot/ui-react';
import { WalletsModalProps } from '../../types';
import { Terms, WalletModalConnectTermsProps } from '../../../Terms';
import { EmptyWalletsList } from '../EmptyWalletsList';
import {
  Subtitle,
  WalletsButtonsScrollBox,
  WalletsButtonsContainer,
  ContentHeader,
  MoreWalletsToggleButton,
  WalletInput,
  SearchIconWrap,
  MoreWalletsText,
  InputClearButton,
  IconSearch,
  IconMoreWallets,
  IconInputClear,
} from './styles';

import { sortWalletsList } from './sortWalletsList';

type ConnectWalletModalProps = WalletsModalProps & {
  onCloseSuccess?: () => void;
  onCloseReject?: () => void;
  termsProps: WalletModalConnectTermsProps;
};

export const ConnectWalletModal = ({
  onCloseSuccess,
  onCloseReject,
  termsProps,
  ...passedDownProps
}: ConnectWalletModalProps) => {
  const {
    shouldInvertWalletIcon = false,
    buttonsFullWidth = false,
    metrics,
    buttonComponentsByConnectorId,
    walletDataList,
    walletsShown,
    walletsPinned,
    walletsDisplayInitialCount = 6,
    linkDontHaveWallet,
  } = passedDownProps;

  const { termsChecked } = useReefKnotModal();

  const inputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (isShownOtherWallets) {
      if (!isMobileOrTablet) inputRef.current?.focus();
    } else {
      setInputValue('');
    }
  }, [isShownOtherWallets]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.currentTarget.value);
    },
    [],
  );

  const handleClearInput = useCallback(() => {
    setInputValue('');
  }, []);

  const handleToggleWalletsList = useCallback(() => {
    setShowOtherWallets((value) => !value);
  }, []);

  return (
    <Modal
      {...passedDownProps}
      open
      title="Connect wallet"
      center={false}
      omitContentStyle
      onClose={onCloseReject}
      widthClamp={660}
    >
      <ContentHeader>
        <Terms {...termsProps} />
        <Subtitle>
          Choose wallet{' '}
          {linkDontHaveWallet && (
            <Link href={linkDontHaveWallet}>I don&apos;t have a wallet</Link>
          )}
        </Subtitle>
        {isShownOtherWallets && (
          <WalletInput
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Wallet name"
            leftDecorator={
              <SearchIconWrap>
                <IconSearch />
              </SearchIconWrap>
            }
            rightDecorator={
              inputValue && (
                <InputClearButton onClick={handleClearInput}>
                  <IconInputClear />
                </InputClearButton>
              )
            }
          />
        )}
      </ContentHeader>

      <WalletsButtonsScrollBox $isCompact={!isShownOtherWallets}>
        {walletsList.length === 0 && (
          <EmptyWalletsList
            inputValue={inputValue}
            onClickClear={handleClearInput}
          />
        )}
        {walletsList.length > 0 && (
          <WalletsButtonsContainer
            $isCompact={isShownOtherWallets}
            $buttonsFullWidth={isShownOtherWallets || buttonsFullWidth}
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
          </WalletsButtonsContainer>
        )}
      </WalletsButtonsScrollBox>

      {(walletsListFull.length > walletsList.length || isShownOtherWallets) && (
        <MoreWalletsToggleButton onClick={handleToggleWalletsList}>
          <IconMoreWallets />
          <MoreWalletsText>
            {isShownOtherWallets ? 'Hide wallets' : 'Other wallets'}
          </MoreWalletsText>
        </MoreWalletsToggleButton>
      )}
    </Modal>
  );
};
