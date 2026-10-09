import React, { useEffect, useRef } from 'react';

import type { ReefKnotWalletsModalProps } from '../../../types/index';
import { EmptyWalletsList } from '../EmptyWalletsList';
import {
  ContentWrapper,
  ContentWrapperInner,
  WalletsButtonsScrollBox,
  WalletsButtonsContainer,
  Subtitle,
  ContentHeader,
  NoWalletLink,
  MoreWalletsToggleButton,
  MoreWalletsText,
  IconMoreWallets,
} from './styles';

import { isMobileOrTablet, isIOS, isIPad } from 'reef-knot';
import { WalletModalInput } from '../WalletModalInput';

// Additional check because `@supports selector(::-webkit-scrollbar)`
// passes as true on iOS/iPad devices, but styles will not really apply
const isSupportedCustomScrollbar = !isIOS && !isIPad;

type ConnectWalletModalLayoutProps = ReefKnotWalletsModalProps & {
  terms: React.ReactNode;
  inputValue: string;
  isEmptyWalletsList: boolean;
  isShownOtherWallets: boolean;
  isShownWalletsToggleButton: boolean;
  onCloseReject?: () => void;
  onToggleWalletsList: () => void;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onInputClear: () => void;
};

export const ConnectWalletModalLayout = ({
  config,
  terms,
  inputValue,
  onInputChange,
  onInputClear,
  onCloseReject,
  onToggleWalletsList,
  isEmptyWalletsList,
  isShownOtherWallets,
  isShownWalletsToggleButton,
  children,
  ...passedDownProps
}: ConnectWalletModalLayoutProps) => {
  const { linkDontHaveWallet } = config;
  const { buttonsFullWidth = false, darkThemeEnabled } = passedDownProps;

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isShownOtherWallets) {
      if (!isMobileOrTablet) inputRef.current?.focus();
    } else {
      onInputClear();
    }
  }, [isShownOtherWallets, onInputClear]);

  return (
    <ContentWrapper
      key={isShownOtherWallets ? 'compact' : 'full'}
      $isSupportedCustomScrollbar={isSupportedCustomScrollbar}
    >
      <ContentWrapperInner
        $isSupportedCustomScrollbar={isSupportedCustomScrollbar}
      >
        <ContentHeader>
          {terms}
          <Subtitle>
            <span>Choose wallet </span>
            {linkDontHaveWallet && (
              <NoWalletLink href={linkDontHaveWallet}>
                I don&apos;t have a wallet
              </NoWalletLink>
            )}
          </Subtitle>
          {isShownOtherWallets && (
            <WalletModalInput
              ref={inputRef}
              value={inputValue}
              onChange={onInputChange}
              onClear={onInputClear}
            />
          )}
        </ContentHeader>

        <WalletsButtonsScrollBox
          key={isShownOtherWallets ? 'full' : 'compact'}
          $isCompact={!isShownOtherWallets}
          $isSupportedCustomScrollbar={isSupportedCustomScrollbar}
        >
          {isEmptyWalletsList && (
            <EmptyWalletsList
              inputValue={inputValue}
              shouldInvertColor={darkThemeEnabled}
              onClickClear={onInputClear}
            />
          )}

          {!isEmptyWalletsList && (
            <WalletsButtonsContainer
              $isCompact={isShownOtherWallets}
              $buttonsFullWidth={isShownOtherWallets || buttonsFullWidth}
              $isSupportedCustomScrollbar={isSupportedCustomScrollbar}
            >
              {children}
            </WalletsButtonsContainer>
          )}
        </WalletsButtonsScrollBox>

        {isShownWalletsToggleButton && (
          <MoreWalletsToggleButton onClick={onToggleWalletsList}>
            <IconMoreWallets />
            <MoreWalletsText>
              {isShownOtherWallets ? 'Less wallets' : 'More wallets'}
            </MoreWalletsText>
          </MoreWalletsToggleButton>
        )}
      </ContentWrapperInner>
    </ContentWrapper>
  );
};
