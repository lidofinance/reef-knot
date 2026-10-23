import { useId, useState, useEffect, type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import {
  ReefKnotUIProvider,
  ReefKnotLedgerProvider,
  useWalletPicker,
  useWalletConnection,
  useTerms,
  useEagerConnectScreen,
  useEIP6963Picker,
  useLedgerFlow,
  useReefKnotModal,
  useModalFocus,
  useModalClose,
  useEscape,
  useLockScroll,
  type ReefKnotWalletsModalConfig,
  type ReefKnotTheme,
} from 'reef-knot';
import styles from './wallet-ui.module.css';

const ErrorMessage = ({ error }: { error?: Error | null }) =>
  error ? (
    <p role="alert" className={styles.error}>
      {error.message}
    </p>
  ) : null;

const Terms = () => {
  const { checked, setChecked, linkTerms, linkPrivacyNotice } = useTerms();
  return (
    <label className={styles.terms}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.currentTarget.checked)}
      />
      <span>
        I accept the{' '}
        <a href={linkTerms} target="_blank" rel="noopener noreferrer">
          Terms of Use
        </a>{' '}
        and{' '}
        <a href={linkPrivacyNotice} target="_blank" rel="noopener noreferrer">
          Privacy Notice
        </a>
        .
      </span>
    </label>
  );
};

const Wallet = ({ walletId }: { walletId: string }) => {
  const { wallet, isVisible, disabled, isLoading, connect } =
    useWalletConnection(walletId);
  if (!wallet || !isVisible) return null;
  return (
    <button
      type="button"
      disabled={disabled}
      aria-busy={isLoading}
      onClick={() => {
        void connect();
      }}
    >
      {wallet.walletName}
      {isLoading ? ' — connecting…' : ''}
    </button>
  );
};

const WalletPicker = () => {
  const picker = useWalletPicker();
  return (
    <>
      <Terms />
      <label className={styles.search}>
        Search wallets
        <input
          type="search"
          value={picker.search}
          onChange={(e) => picker.setSearch(e.currentTarget.value)}
        />
      </label>
      {picker.search && (
        <button type="button" onClick={picker.clearSearch}>
          Clear search
        </button>
      )}
      {picker.isDiscovering && <p role="status">Discovering wallets…</p>}
      {!picker.isDiscovering && picker.wallets.length === 0 && (
        <p>No wallets found</p>
      )}
      <div className={styles.list}>
        {picker.wallets.map((wallet) => (
          <Wallet key={wallet.walletId} walletId={wallet.walletId} />
        ))}
      </div>
      <ErrorMessage error={picker.error} />
      {picker.showToggle && (
        <button type="button" onClick={picker.toggleExpanded}>
          {picker.expanded ? 'Less wallets' : 'More wallets'}
        </button>
      )}
    </>
  );
};

const EagerConnect = () => {
  const state = useEagerConnectScreen();
  return (
    <>
      <Terms />
      {state.errorMessage && (
        <p role="alert" className={styles.error}>
          {state.errorMessage}
        </p>
      )}
      <button
        type="button"
        disabled={state.disabled}
        aria-busy={state.isLoading}
        onClick={() => {
          void state.connect();
        }}
      >
        {state.isLoading ? 'Connecting…' : 'Connect'}
      </button>
    </>
  );
};

const EIP6963Picker = () => {
  const state = useEIP6963Picker();
  return (
    <>
      <Terms />
      <p>Select browser wallet</p>
      <div className={styles.list}>
        {state.providers.map((provider) => (
          <button
            type="button"
            key={provider.info.uuid}
            disabled={state.disabled}
            aria-busy={state.loadingWalletId === provider.info.rdns}
            onClick={() => {
              void state.select(provider);
            }}
          >
            {provider.info.name}
            {state.loadingWalletId === provider.info.rdns
              ? ' — connecting…'
              : ''}
          </button>
        ))}
      </div>
      <ErrorMessage error={state.error} />
    </>
  );
};

export const HeadlessLedgerScreen = () => {
  const state = useLedgerFlow();
  if (state.screen === 'error')
    return (
      <>
        <ErrorMessage error={state.error} />
        <button
          type="button"
          onClick={() => {
            void state.retry();
          }}
        >
          Retry
        </button>
      </>
    );
  if (state.screen === 'connection')
    return (
      <>
        <p role="status">
          {state.isLoadingLedgerLibs
            ? 'Loading connector…'
            : 'Connect your Ledger and open the Ethereum app on the device.'}
        </p>
        {state.isUserActivationRequired && (
          <button
            type="button"
            onClick={() => {
              void state.retry();
            }}
          >
            Connect
          </button>
        )}
      </>
    );
  return (
    <>
      <fieldset disabled={state.isLoading} className={styles.paths}>
        <legend>Select HD derivation path</legend>
        {state.derivationPaths.map((path) => (
          <label key={path.template}>
            <input
              type="radio"
              name="headless-ledger-path"
              value={path.template}
              checked={state.derivationPath === path.template}
              onChange={() => state.setDerivationPath(path.template)}
            />{' '}
            {path.title}
          </label>
        ))}
      </fieldset>
      {state.accounts.length < state.accountsPerPage ? (
        <p role="status">Loading accounts…</p>
      ) : (
        <div className={styles.list}>
          {state.accounts.map((account) => (
            <button
              type="button"
              key={account.path}
              disabled={state.isLoading}
              onClick={() => {
                void state.selectAccount(account);
              }}
            >
              <code>{account.address}</code>
              <span>
                {account.balance} {account.token}
              </span>
            </button>
          ))}
        </div>
      )}
      <nav aria-label="Ledger account pages" className={styles.pages}>
        {Array.from({ length: state.pagesCount }, (_, index) => (
          <button
            type="button"
            key={index}
            disabled={state.isLoading}
            aria-current={state.currentPage === index + 1 ? 'page' : undefined}
            onClick={() => state.setPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </nav>
    </>
  );
};

const ModalContainer = ({
  title,
  theme,
  onClose,
  onBack,
  children,
}: PropsWithChildren<{
  title: string;
  theme: ReefKnotTheme;
  onClose?: () => void;
  onBack?: () => void;
}>) => {
  const titleId = useId();
  const focusRef = useModalFocus();
  const { ref: closeRef, handleClick } = useModalClose(onClose);
  useEscape(onClose);
  useLockScroll();
  return (
    <div
      className={styles.overlay}
      data-theme={theme}
      onClick={handleClick}
      role="presentation"
    >
      <div
        ref={(node) => {
          (focusRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
          (closeRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={styles.dialog}
      >
        <header className={styles.header}>
          {onBack && (
            <button type="button" onClick={onBack}>
              Back
            </button>
          )}
          <h2 id={titleId}>{title}</h2>
          {onClose && (
            <button type="button" onClick={onClose}>
              Close
            </button>
          )}
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

const CustomContent = ({ theme }: { theme: ReefKnotTheme }) => {
  const { currentModal, closeModal } = useReefKnotModal();
  const [root, setRoot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const element = document.createElement('div');
    document.body.append(element);
    setRoot(element);
    return () => element.remove();
  }, []);
  if (!currentModal || !root) return null;
  const reject = () => closeModal({ success: false });
  const onClose =
    currentModal.type === 'eager'
      ? undefined
      : currentModal.type === 'requirements' || currentModal.type === 'eip6963'
        ? () => closeModal({ success: true })
        : reject;
  const onBack =
    currentModal.type === 'wallet' || currentModal.type === 'eager'
      ? undefined
      : reject;
  const title =
    currentModal.type === 'eager'
      ? 'Confirm connection'
      : currentModal.type === 'ledger'
        ? 'Ledger connect'
        : currentModal.type === 'requirements'
          ? (currentModal.props.title ?? 'Wallet requirements')
          : 'Connect wallet';
  const body =
    currentModal.type === 'wallet' ? (
      <WalletPicker />
    ) : currentModal.type === 'eager' ? (
      <EagerConnect />
    ) : currentModal.type === 'eip6963' ? (
      <EIP6963Picker />
    ) : currentModal.type === 'ledger' ? (
      <ReefKnotLedgerProvider>
        <HeadlessLedgerScreen />
      </ReefKnotLedgerProvider>
    ) : (
      <>
        {currentModal.props?.kind === 'no-wallets' && (
          <p>Install a browser wallet to connect.</p>
        )}
        {currentModal.props?.text}
      </>
    );
  return createPortal(
    <ModalContainer
      title={title}
      theme={theme}
      onClose={onClose}
      onBack={onBack}
    >
      {body}
    </ModalContainer>,
    root,
  );
};

export const CustomWalletsModal = ({
  config,
  theme,
}: {
  config: ReefKnotWalletsModalConfig;
  theme: ReefKnotTheme;
}) => (
  <ReefKnotUIProvider config={config}>
    <CustomContent theme={theme} />
  </ReefKnotUIProvider>
);
