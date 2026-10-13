import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LedgerImage } from './components/LedgerImage';
import { LedgerAccountIcon } from './components/LedgerAccountIcon';
import { BrowserWalletIconsGrid } from './components/BrowserWalletIconsGrid';
import {
  Button,
  Checkbox,
  Input,
  IconCross,
  IconButton,
  IconChevronDown,
  IconChevronUp,
  IconChevronRight,
  TokenSelector,
  IconSearch,
} from '@lidofinance/lido-app-ui';
import {
  ReefKnotModalRenderer,
  useEscape,
  useLockScroll,
  useModalFocus,
  useModalClose,
  FALLBACK_WALLET_ICON,
  useReefKnotModal,
} from 'reef-knot';
import type {
  ModalContainerProps,
  WalletButtonViewProps,
  TermsViewProps,
  WalletPickerViewProps,
  EagerConnectViewProps,
  RequirementsViewProps,
  ConnectionErrorViewProps,
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
  onBack: _onBack,
  widthClamp: _widthClamp,
  className,
  ...rest
}: ModalContainerProps) {
  const { currentModal } = useReefKnotModal();
  const titleId = useId();
  const subtitleId = useId();
  useEscape(onClose);
  useLockScroll();
  const focusRef = useModalFocus();
  const { ref: closeRef, handleClick } = useModalClose(onClose);
  return (
    <div
      {...rest}
      className="rk-lido-overlay"
      role="presentation"
      data-lido-theme={theme}
      data-screen={currentModal?.type}
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
      <div className="rk-lido-dialog-container" style={{ maxWidth: 500 }}>
        <div
          className={`rk-lido-dialog ${className ?? ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title != null ? titleId : undefined}
          aria-label={title == null ? 'Wallet connection' : undefined}
          aria-describedby={subtitle != null ? subtitleId : undefined}
          tabIndex={-1}
        >
          <div className="rk-lido-header-group">
            <div className="rk-lido-header">
              <h2 className="rk-lido-title" id={titleId}>
                {titleIcon}
                <span className="rk-lido-heading">{title}</span>
              </h2>
              {onClose && (
                <IconButton
                  variant="outline"
                  aria-label="Close"
                  icon={<IconCross />}
                  onClick={onClose}
                />
              )}
            </div>
            {subtitle != null && (
              <p className="rk-lido-subtitle" id={subtitleId}>
                {subtitle}
              </p>
            )}
          </div>
          <div className="rk-lido-body">{children}</div>
        </div>
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
  walletId,
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
      variant="outline"
      className="rk-lido-wallet"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
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
        ) : walletId === 'browserExtension' ? (
          <BrowserWalletIconsGrid />
        ) : Icon ? (
          <Icon />
        ) : (
          <span aria-hidden="true">◈</span>
        )}
      </span>
      <span className="rk-lido-wallet-name">{name}</span>
      {isLoading && <span className="rk-lido-connecting">Connecting…</span>}
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
}: WalletPickerViewProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // A new search or list mode starts at the first matching wallet.
    if (listRef.current) listRef.current.scrollTop = 0;
    setIsScrolled(false);
  }, [state.search, state.expanded]);

  return (
    <section className="rk-lido-picker">
      {terms}
      <div className="rk-lido-picker-content">
        {state.expanded && (
          <div className="rk-lido-search">
            <Input
              icon={<IconSearch />}
              value={state.search}
              onChange={(event) => state.setSearch(event.currentTarget.value)}
              placeholder="Search wallets"
              aria-label="Search wallets"
              size="small"
            />
          </div>
        )}
        <div
          ref={listRef}
          className="rk-lido-picker-list"
          data-scrolled={isScrolled}
          data-expanded={state.expanded}
          onScroll={(event) => setIsScrolled(event.currentTarget.scrollTop > 0)}
        >
          <div className="rk-lido-wallets">
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
              {state.expanded ? <IconChevronUp /> : <IconChevronDown />}
            </Button>
          )}
        </div>
      </div>
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
  const { closeModal } = useReefKnotModal();
  const noWallets = requirements.kind === 'no-wallets';
  return (
    <section className="rk-lido-requirements">
      <div className="rk-lido-requirements-content">
        {noWallets ? (
          <span className="rk-lido-requirements-icon" aria-hidden="true" />
        ) : (
          requirements.icon
        )}
        <h2>{noWallets ? 'No browser wallet detected' : requirements.title}</h2>
        <div className="rk-lido-description">
          {noWallets
            ? "This connection method requires a browser wallet. Install a compatible wallet extension or enable it if it's already installed, then reload the page."
            : requirements.text}
        </div>
      </div>
      <Button
        className="rk-lido-action"
        onClick={() => closeModal({ success: false })}
      >
        Select another wallet
      </Button>
    </section>
  );
}

export function ConnectionError({
  errorMessage,
  onBack,
}: ConnectionErrorViewProps) {
  return (
    <section className="rk-lido-screen rk-lido-connection-error">
      <p className="rk-lido-description" role="alert">
        {errorMessage}
      </p>
      <Button className="rk-lido-action" onClick={onBack}>
        Back to wallets
      </Button>
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
      <div className="rk-lido-wallets">{children}</div>
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
    <section className="rk-lido-screen rk-lido-ledger-connection">
      <LedgerImage />
      <p className="rk-lido-description" role="status">
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
    <section className="rk-lido-screen rk-lido-ledger-accounts">
      {/* Escape only dismisses the focused dropdown; the fieldset remains a semantic group. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
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
          size="small"
          value={state.derivationPath}
          options={state.derivationPaths.map((path) => ({
            value: path.template,
            label: <span className="rk-lido-path-label">{path.title}</span>,
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
              variant="outline"
              className="rk-lido-account"
              disabled={state.isLoading}
              onClick={() => {
                void state.selectAccount(account);
              }}
            >
              <span className="rk-lido-account-icon">
                <LedgerAccountIcon />
              </span>
              <span className="rk-lido-account-address" title={account.address}>
                {account.address.slice(0, 8)}…{account.address.slice(-8)}
              </span>
              <span className="rk-lido-account-balance">
                {account.balance} {account.token}
              </span>
            </Button>
          ))
        )}
      </div>
      <nav className="rk-lido-pagination" aria-label="Ledger account pages">
        <IconButton
          variant="ghost"
          icon={<IconChevronRight className="rk-lido-previous-page-icon" />}
          aria-label="Previous page"
          disabled={state.isLoading || state.currentPage <= 1}
          onClick={() => state.setPage(state.currentPage - 1)}
        />
        <label className="rk-lido-page-label">
          Page
          <input
            type="number"
            aria-label="Ledger account page"
            min={1}
            max={state.pagesCount}
            value={state.currentPage}
            disabled={state.isLoading}
            onChange={(event) => {
              const page = event.currentTarget.valueAsNumber;
              if (
                Number.isInteger(page) &&
                page >= 1 &&
                page <= state.pagesCount
              )
                state.setPage(page);
            }}
          />
          <span>/ {state.pagesCount}</span>
        </label>
        <IconButton
          variant="ghost"
          icon={<IconChevronRight />}
          aria-label="Next page"
          disabled={state.isLoading || state.currentPage >= state.pagesCount}
          onClick={() => state.setPage(state.currentPage + 1)}
        />
      </nav>
    </section>
  );
}

export function LedgerError({ state }: LedgerViewProps) {
  return (
    <section className="rk-lido-screen rk-lido-ledger-connection">
      <LedgerImage error />
      <p className="rk-lido-description" role="alert">
        {state.error?.message}
      </p>
      <Button
        className="rk-lido-action"
        variant="outline"
        onClick={() => {
          void state.retry();
        }}
      >
        Try again
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
  ConnectionError,
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
