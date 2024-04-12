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
import { Terms, WalletModalConnectTermsProps } from '../../../Terms';

import { isMobileOrTablet } from '@reef-knot/wallets-helpers';
import type { WalletsModalProps } from '../../types';
import { WalletModalInput } from '../WalletModalInput';

type ConnectWalletModalLayoutProps = WalletsModalProps & {
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
  const { buttonsFullWidth = false, shouldInvertWalletIcon } = passedDownProps;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isMobileHeight, setIsMobileHeight] = useState(false);
  const [isSupportedCustomScrollbar, setIsSupportedCustomScrollbar] =
    useState(true);

  useEffect(() => {
    if (isShownOtherWallets) {
      if (!isMobileOrTablet) inputRef.current?.focus();
    } else {
      onInputClear();
    }
  }, [isShownOtherWallets, onInputClear]);

  useEffect(() => {
    // Additional check because `@supports selector(::-webkit-scrollbar)`
    // passes as true on iOS device, but styles will not really apply
    // Also the `helpers/userAgents` does not work really well in my tested case,
    // so there is another iPhone/iPad check implementation
    const isIOS =
      /Macintosh/i.test(navigator.userAgent) &&
      navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 1;
    setIsSupportedCustomScrollbar(!isIOS);

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
                shouldInvertColor={shouldInvertWalletIcon}
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
