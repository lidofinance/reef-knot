import React, { useEffect, useMemo, useState } from 'react';
import {
  useWalletPicker,
  useReefKnotModal,
  type ModalContainerProps,
  FALLBACK_WALLET_ICON,
  type ReefKnotUIComponents,
  type WalletButtonViewProps,
  type TermsViewProps,
  type WalletPickerViewProps,
  type EagerConnectViewProps,
  type RequirementsViewProps,
  type ConnectionErrorViewProps,
  type EIP6963PickerViewProps,
  type LedgerViewProps,
} from 'reef-knot';
import { Checkbox, Link, Modal, Button, Warning } from '../ui-react';
import { ConnectButtonBase } from './components/ConnectButtonBase';
import { TermsStyle, TermsTextStyle } from './components/Terms/styles';
import { ConnectWalletModalLayout } from './components/ConnectWalletModalLayout';
import {
  CommonButtonsContainer,
  ErrorBlock,
} from './components/EagerConnectModal/styles';
import {
  MEDIA_MOBILE_HEIGHT,
  ContentHeader,
  Subtitle,
  WalletsButtonsContainer,
  WalletsButtonsScrollBox,
} from './components/ConnectWalletModalLayout/styles';
import { LedgerConnectionScreen } from './components/Ledger/LedgerConnectionScreen';
import { LedgerErrorScreen } from './components/Ledger/LedgerErrorScreen';
import { LedgerAccountScreen } from './components/Ledger/LedgerAccountScreen';
import { LedgerModalInnerContainer } from './components/Ledger/styles';
import { BrowserWalletIconsGrid } from './components/BrowserWalletIconsGrid';
import {
  ConnectionErrorIconStyle,
  ConnectionErrorStyle,
} from './components/ConnectionError/styles';

export function WalletButton(props: WalletButtonViewProps) {
  const { iconUrl, walletId, icon } = props;
  const Icon = useMemo(
    () =>
      iconUrl
        ? () => (
            <img
              src={iconUrl}
              alt=""
              onError={(e) => {
                e.currentTarget.src = FALLBACK_WALLET_ICON;
              }}
            />
          )
        : walletId === 'browserExtension'
          ? BrowserWalletIconsGrid
          : icon,
    [iconUrl, walletId, icon],
  );
  return (
    <ConnectButtonBase
      icon={Icon}
      darkThemeEnabled={props.theme === 'dark'}
      isCompact={props.compact}
      disabled={props.disabled}
      isLoading={props.isLoading}
      onClick={props.onConnect}
    >
      {props.name}
    </ConnectButtonBase>
  );
}

export function TermsView(props: TermsViewProps) {
  return (
    <TermsStyle>
      <Checkbox
        checked={props.checked}
        onChange={(event) => props.onChange(event.currentTarget.checked)}
      />
      <TermsTextStyle>
        I certify that I have read and accept the updated{' '}
        <Link href={props.linkTerms}>Terms&nbsp;of&nbsp;Use</Link> and{' '}
        <Link href={props.linkPrivacyNotice}>Privacy&nbsp;Notice</Link>.
      </TermsTextStyle>
    </TermsStyle>
  );
}

function Picker(props: WalletPickerViewProps) {
  const state = props.state;
  return (
    <ConnectWalletModalLayout
      config={{
        walletsShown: [],
        walletsPinned: [],
      }}
      terms={props.terms}
      inputValue={state.search}
      isEmptyWalletsList={!state.isDiscovering && state.wallets.length === 0}
      isShownOtherWallets={state.expanded}
      isShownWalletsToggleButton={state.showToggle}
      onInputChange={(event) => state.setSearch(event.currentTarget.value)}
      onInputClear={state.clearSearch}
      onToggleWalletsList={state.toggleExpanded}
      darkThemeEnabled={props.theme === 'dark'}
      buttonsFullWidth={props.buttonsFullWidth}
    >
      {props.children}
      {state.error && (
        <ErrorBlock role="alert">{state.error.message}</ErrorBlock>
      )}
    </ConnectWalletModalLayout>
  );
}

function ModalContainer({ theme: _theme, ...props }: ModalContainerProps) {
  const { expanded } = useWalletPicker();
  const { currentModal } = useReefKnotModal();
  const [smallHeight, setSmallHeight] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(MEDIA_MOBILE_HEIGHT);
    setSmallHeight(query.matches);
    const update = (event: MediaQueryListEvent) =>
      setSmallHeight(event.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const picker = currentModal?.type === 'wallet';
  return (
    <Modal
      {...props}
      titleIcon={
        currentModal?.type === 'requirements'
          ? (currentModal.props.icon ??
            (currentModal.props.kind === 'no-wallets' ? (
              <Warning />
            ) : undefined))
          : props.titleIcon
      }
      subtitle={
        currentModal?.type === 'requirements'
          ? currentModal.props.text
          : props.subtitle
      }
      clampHeightByWindow={picker && !expanded && smallHeight}
      stretchHeightByWindow={picker && expanded && smallHeight}
    />
  );
}

function EagerConnect({ state, terms }: EagerConnectViewProps) {
  return (
    <>
      {terms}
      {state.errorMessage && (
        <ErrorBlock role="alert">{state.errorMessage}</ErrorBlock>
      )}
      <CommonButtonsContainer>
        <Button
          fullwidth
          disabled={state.disabled}
          loading={state.isLoading}
          onClick={() => {
            void state.connect();
          }}
        >
          Connect
        </Button>
      </CommonButtonsContainer>
    </>
  );
}

function Requirements(_props: RequirementsViewProps) {
  // The legacy container displays requirements in its title, icon and subtitle.
  return null;
}

// The modal header has Back and Close, so this view has no buttons.
function ConnectionError({ errorMessage }: ConnectionErrorViewProps) {
  return (
    <ConnectionErrorStyle role="alert">
      <ConnectionErrorIconStyle aria-hidden="true">
        <Warning width={48} height={48} />
      </ConnectionErrorIconStyle>
      <div>{errorMessage}</div>
    </ConnectionErrorStyle>
  );
}

function EIP6963Picker({ terms, children, error }: EIP6963PickerViewProps) {
  return (
    <>
      <ContentHeader>
        {terms}
        <Subtitle>Select browser wallet</Subtitle>
      </ContentHeader>
      <WalletsButtonsScrollBox $isCompact $isSupportedCustomScrollbar={false}>
        <WalletsButtonsContainer
          $buttonsFullWidth
          $isCompact
          $isSupportedCustomScrollbar={false}
        >
          {children}
        </WalletsButtonsContainer>
      </WalletsButtonsScrollBox>
      {error && <ErrorBlock role="alert">{error.message}</ErrorBlock>}
    </>
  );
}

function LedgerConnection({ state }: LedgerViewProps) {
  return (
    <LedgerModalInnerContainer>
      <LedgerConnectionScreen
        showConnectButton={state.isUserActivationRequired}
        isLoadingLedgerLibs={state.isLoadingLedgerLibs}
        onClickConnect={() => {
          void state.retry();
        }}
      />
    </LedgerModalInnerContainer>
  );
}

function LedgerAccounts({ state }: LedgerViewProps) {
  return (
    <LedgerModalInnerContainer>
      <LedgerAccountScreen state={state} />
    </LedgerModalInnerContainer>
  );
}

function LedgerError({ state }: LedgerViewProps) {
  return (
    <LedgerModalInnerContainer>
      <LedgerErrorScreen
        message={state.error?.message}
        onClickRetry={() => {
          void state.retry();
        }}
      />
    </LedgerModalInnerContainer>
  );
}

export const LEGACY_COMPONENTS: ReefKnotUIComponents = {
  ModalContainer,
  WalletButton,
  Terms: TermsView,
  WalletPicker: Picker,
  EagerConnect,
  Requirements,
  ConnectionError,
  EIP6963Picker,
  LedgerConnection,
  LedgerAccounts,
  LedgerError,
};
