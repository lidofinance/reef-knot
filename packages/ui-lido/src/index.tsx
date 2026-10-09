import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Button,
  Checkbox,
  Input,
  Modal,
  IconButton,
  IconArrowLeft,
  TokenSelector,
} from '@lidofinance/lido-app-ui';
import {
  ReefKnotModalRenderer,
  useEscape,
  useLockScroll,
  useModalFocus,
  useModalClose,
  FALLBACK_WALLET_ICON,
} from 'reef-knot';
import type {
  ModalContainerProps,
  WalletButtonViewProps,
  TermsViewProps,
  WalletPickerViewProps,
  EagerConnectViewProps,
  RequirementsViewProps,
  EIP6963PickerViewProps,
  LedgerViewProps,
  ReefKnotUIComponents,
  ReefKnotWalletsModalConfig,
  ReefKnotTheme,
} from 'reef-knot';

function PortalDialog({
  title,
  subtitle,
  titleIcon,
  children,
  theme = 'light',
  onClose,
  onBack,
  widthClamp,
  className,
  ...rest
}: ModalContainerProps) {
  useEscape(onClose);
  useLockScroll();
  const focusRef = useModalFocus();
  const { ref: closeRef, handleClick } = useModalClose(onClose);
  return (
    <div
      {...rest}
      className="rk-lido-overlay"
      data-lido-theme={theme}
      onClick={handleClick}
      ref={(node) => {
        const dialog =
          node?.querySelector<HTMLDivElement>('[role="dialog"]') ?? null;
        if (dialog) {
          dialog.tabIndex = -1;
          dialog.setAttribute('aria-modal', 'true');
        }
        (focusRef as React.MutableRefObject<HTMLDivElement | null>).current =
          dialog;
        (closeRef as React.MutableRefObject<HTMLDivElement | null>).current =
          dialog;
      }}
    >
      <div
        className="rk-lido-dialog-container"
        style={{ maxWidth: widthClamp ?? 660 }}
      >
        <Modal
          className={`rk-lido-dialog ${className ?? ''}`}
          onClose={onClose}
          subtitle={subtitle}
          title={
            <span className="rk-lido-title">
              {onBack && (
                <IconButton
                  variant="ghost"
                  icon={<IconArrowLeft />}
                  onClick={onBack}
                  aria-label="Go back"
                />
              )}
              {titleIcon}
              {title}
            </span>
          }
        >
          {children}
        </Modal>
      </div>
    </div>
  );
}

export function ModalContainer({
  open,
  onExited,
  center: _center,
  omitContentStyle: _omit,
  clampHeightByWindow: _clamp,
  stretchHeightByWindow: _stretch,
  ...props
}: ModalContainerProps): React.ReactPortal | null {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    let element = document.getElementById('reef-knot-modal-root');
    if (!element) {
      element = document.createElement('div');
      element.id = 'reef-knot-modal-root';
      document.body.append(element);
    }
    setRoot(element);
    return () => {
      onExited?.();
    };
  }, [open, onExited]);
  return open && root ? createPortal(<PortalDialog {...props} />, root) : null;
}

export function WalletButton({
  name,
  icon,
  iconUrl,
  theme,
  disabled,
  isLoading,
  onConnect,
}: WalletButtonViewProps) {
  const Icon =
    icon && typeof icon === 'object' && 'light' in icon
      ? theme === 'dark'
        ? icon.dark
        : icon.light
      : icon;
  return (
    <Button
      variant="subtle"
      className="rk-lido-wallet"
      disabled={disabled || isLoading}
      loading={isLoading}
      onClick={onConnect}
    >
      <span className="rk-lido-wallet-icon">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            onError={(event) => {
              event.currentTarget.src = FALLBACK_WALLET_ICON;
            }}
          />
        ) : Icon ? (
          <Icon />
        ) : (
          <span aria-hidden="true">◈</span>
        )}
      </span>
      <span className="rk-lido-wallet-name">{name}</span>
    </Button>
  );
}

export function Terms({
  checked,
  onChange,
  linkTerms,
  linkPrivacyNotice,
}: TermsViewProps) {
  return (
    <div className="rk-lido-terms">
      <Checkbox
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
        label={
          <>
            I certify that I have read and accept the updated{' '}
            <a href={linkTerms} target="_blank" rel="noopener noreferrer">
              Terms of Use
            </a>{' '}
            and{' '}
            <a
              href={linkPrivacyNotice}
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Notice
            </a>
            .
          </>
        }
      />
    </div>
  );
}

export function WalletPicker({
  state,
  children,
  terms,
  linkDontHaveWallet,
  buttonsFullWidth,
}: WalletPickerViewProps) {
  return (
    <section className="rk-lido-picker">
      {terms}
      <div className="rk-lido-subtitle">
        <span>Choose wallet</span>
        {linkDontHaveWallet && (
          <a
            href={linkDontHaveWallet}
            target="_blank"
            rel="noopener noreferrer"
          >
            I don&apos;t have a wallet
          </a>
        )}
      </div>
      {state.expanded && (
        <div className="rk-lido-search">
          <Input
            value={state.search}
            onChange={(event) => state.setSearch(event.currentTarget.value)}
            placeholder="Search wallets"
            aria-label="Search wallets"
            size="default"
          />
          <Button variant="ghost" size="small" onClick={state.clearSearch}>
            Clear
          </Button>
        </div>
      )}
      <div
        className={`rk-lido-wallets ${state.expanded || buttonsFullWidth ? 'rk-lido-fullwidth' : ''}`}
      >
        {state.isDiscovering && state.wallets.length === 0 && (
          <p role="status">Discovering wallets…</p>
        )}
        {!state.isDiscovering && state.wallets.length === 0 && (
          <div>
            <p>No wallets found</p>
            <Button onClick={state.clearSearch}>Clear search</Button>
          </div>
        )}
        {children}
      </div>
      {state.error && (
        <p className="rk-lido-error" role="alert">
          {state.error.message}
        </p>
      )}
      {state.showToggle && (
        <Button
          variant="ghost"
          className="rk-lido-toggle"
          onClick={state.toggleExpanded}
        >
          {state.expanded ? 'Less wallets' : 'More wallets'}
        </Button>
      )}
    </section>
  );
}

export function EagerConnect({ state, terms }: EagerConnectViewProps) {
  return (
    <section className="rk-lido-screen">
      {terms}
      {state.errorMessage && (
        <p className="rk-lido-error" role="alert">
          {state.errorMessage}
        </p>
      )}
      <Button
        disabled={state.disabled}
        loading={state.isLoading}
        onClick={() => {
          void state.connect();
        }}
      >
        Connect
      </Button>
    </section>
  );
}

export function Requirements({ requirements }: RequirementsViewProps) {
  return (
    <section className="rk-lido-screen">
      {requirements.icon}
      {requirements.kind === 'no-wallets' && (
        <p>Install a browser wallet to connect.</p>
      )}
      {requirements.text}
    </section>
  );
}

export function EIP6963Picker({
  terms,
  children,
  error,
}: EIP6963PickerViewProps) {
  return (
    <section className="rk-lido-picker">
      {terms}
      <p>Select browser wallet</p>
      <div className="rk-lido-wallets rk-lido-fullwidth">{children}</div>
      {error && (
        <p className="rk-lido-error" role="alert">
          {error.message}
        </p>
      )}
    </section>
  );
}

export function LedgerConnection({ state }: LedgerViewProps) {
  return (
    <section className="rk-lido-screen">
      <p role="status">
        {state.isLoadingLedgerLibs
          ? 'Loading connector…'
          : 'Please connect your Ledger and launch Ethereum app on your device'}
      </p>
      {state.isUserActivationRequired && (
        <Button
          onClick={() => {
            void state.retry();
          }}
        >
          Connect
        </Button>
      )}
    </section>
  );
}

export function LedgerAccounts({ state }: LedgerViewProps) {
  return (
    <section className="rk-lido-screen">
      <fieldset
        className="rk-lido-path"
        disabled={state.isLoading}
        onKeyDown={(event) => {
          if (event.key !== 'Escape') return;
          const dropdown = event.currentTarget.querySelector<HTMLElement>(
            '[aria-expanded="true"]',
          );
          if (!dropdown) return;
          event.preventDefault();
          event.stopPropagation();
          dropdown.click();
        }}
      >
        <legend>Select HD derivation path</legend>
        <TokenSelector
          value={state.derivationPath}
          options={state.derivationPaths.map((path) => ({
            value: path.template,
            label: path.title,
          }))}
          onChange={state.setDerivationPath}
        />
      </fieldset>
      <div className="rk-lido-accounts">
        {state.accounts.length < state.accountsPerPage ? (
          <p role="status">Loading accounts…</p>
        ) : (
          state.accounts.map((account) => (
            <Button
              key={account.path}
              variant="subtle"
              className="rk-lido-account"
              disabled={state.isLoading}
              onClick={() => {
                void state.selectAccount(account);
              }}
            >
              <code>{account.address}</code>
              <span>
                {account.balance} {account.token}
              </span>
            </Button>
          ))
        )}
      </div>
      <nav className="rk-lido-pagination" aria-label="Ledger account pages">
        {Array.from({ length: state.pagesCount }, (_, i) => (
          <Button
            key={i}
            size="small"
            variant={state.currentPage === i + 1 ? 'primary' : 'ghost'}
            aria-current={state.currentPage === i + 1 ? 'page' : undefined}
            onClick={() => state.setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </nav>
    </section>
  );
}

export function LedgerError({ state }: LedgerViewProps) {
  return (
    <section className="rk-lido-screen">
      <h3>Something went wrong</h3>
      <p className="rk-lido-error" role="alert">
        {state.error?.message}
      </p>
      <Button
        onClick={() => {
          void state.retry();
        }}
      >
        Retry
      </Button>
    </section>
  );
}

export const LIDO_COMPONENTS: ReefKnotUIComponents = {
  ModalContainer,
  WalletButton,
  Terms,
  WalletPicker,
  EagerConnect,
  Requirements,
  EIP6963Picker,
  LedgerConnection,
  LedgerAccounts,
  LedgerError,
};

export type ReefKnotWalletsModalProps<I extends string = string> = {
  config: ReefKnotWalletsModalConfig<I>;
  theme: ReefKnotTheme;
  components?: Partial<ReefKnotUIComponents>;
  buttonsFullWidth?: boolean;
};

export function ReefKnotWalletsModal({
  config,
  theme,
  components,
  buttonsFullWidth,
}: ReefKnotWalletsModalProps) {
  const views = useMemo(
    () => ({ ...LIDO_COMPONENTS, ...components }),
    [components],
  );
  return (
    <ReefKnotModalRenderer
      config={config}
      theme={theme}
      components={views}
      buttonsFullWidth={buttonsFullWidth}
    />
  );
}
