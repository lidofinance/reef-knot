import React, { useEffect, useRef, useState } from 'react';

import { Modal } from '@reef-knot/ui-react';
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
  MEDIA_MOBILE_HEIGHT,
} from './styles';
import { Terms, WalletModalConnectTermsProps } from '../Terms';

import { isMobileOrTablet, isIOS, isIPad } from '@reef-knot/wallets-helpers';
import type { ReefKnotWalletsModalProps } from '../ReefKnotWalletsModal/types';
import { WalletModalInput } from '../WalletModalInput';

// Additional check because `@supports selector(::-webkit-scrollbar)`
// passes as true on iOS/iPad devices, but styles will not really apply
const isSupportedCustomScrollbar = !isIOS && !isIPad;

type ConnectWalletModalLayoutProps = ReefKnotWalletsModalProps & {
  termsProps: WalletModalConnectTermsProps;
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
  termsProps,
  linkDontHaveWallet,
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
  const { buttonsFullWidth = false, darkThemeEnabled } = passedDownProps;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isMobileHeight, setIsMobileHeight] = useState(false);

  useEffect(() => {
    if (isShownOtherWallets) {
      if (!isMobileOrTablet) inputRef.current?.focus();
    } else {
      onInputClear();
    }
  }, [isShownOtherWallets, onInputClear]);

  useEffect(() => {
    // Screen height media query
    const mediaQuery = window.matchMedia(MEDIA_MOBILE_HEIGHT);
    setIsMobileHeight(mediaQuery.matches);
    const onMediaChange = (e: MediaQueryListEvent) => {
      setIsMobileHeight(e.matches);
    };
    mediaQuery.addEventListener('change', onMediaChange);
    return () => {
      mediaQuery.removeEventListener('change', onMediaChange);
    };
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
      clampHeightByWindow={!isShownOtherWallets && isMobileHeight}
      stretchHeightByWindow={isShownOtherWallets && isMobileHeight}
    >
      <ContentWrapper
        key={isShownOtherWallets ? 'compact' : 'full'}
        $isSupportedCustomScrollbar={isSupportedCustomScrollbar}
      >
        <ContentWrapperInner
          $isSupportedCustomScrollbar={isSupportedCustomScrollbar}
        >
          <ContentHeader>
            <Terms {...termsProps} />
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
    </Modal>
  );
};
