# Headless connection API and Lido UI skins

`reef-knot` provides React connection state and actions without a UI kit or CSS dependency. Install one UI skin for a ready-made interface, or build a custom interface with the same public hooks.

A UI skin supplies the visual components for the connection screens. Wallet adapters describe individual wallets, their icons, detection and connectors.

| Package                     | UI dependencies                                    |
| --------------------------- | -------------------------------------------------- |
| `reef-knot`                 | None; React, wagmi, viem and React Query are peers |
| `@reef-knot/ui-lido-legacy` | lido-ui v3 and styled-components 5                 |
| `@reef-knot/ui-lido`        | lido-app-ui (React 18)                             |

The `@reef-knot/ui-lido` UI skin uses `@lidofinance/lido-app-ui@1.4.0`, developed on the [app-ui branch](https://github.com/lidofinance/ui/tree/app-ui). Its React and React DOM peers match the UI kit: React 18. One application uses one UI skin.

## Ready-made UI

Providers and `useConnectionFlow()` stay in `reef-knot`. Import `ReefKnotWalletsModal` from your UI skin and mount it inside `ReefKnotProvider`.

```tsx
import {
  getDefaultConfig,
  getDefaultWalletsModalConfig,
  useConnectionFlow,
} from 'reef-knot';
import { ReefKnotWalletsModal } from '@reef-knot/ui-lido';
```

Load both stylesheets in the application's global stylesheet entry (for Next.js Pages Router, `_app.tsx`):

```tsx
import '@lidofinance/lido-app-ui/index.css';
import '@reef-knot/ui-lido/styles.css';
```

```tsx
<ReefKnotWalletsModal config={walletsModalConfig} theme="dark" />
```

Pass the current application theme to the UI skin. It applies `data-lido-theme` inside its portal and inherits the page's App UI CSS variables; a separate light palette is not generated for the modal.

Start the connection flow from your connect button:

```tsx
const { startConnection } = useConnectionFlow();
const result = await startConnection(); // { success: boolean }
```

The promise resolves when eager connection finishes or the picker is closed. The deprecated `useConnect().connect()` API remains available with the same behavior and result.

## Custom UI

Mount `ReefKnotUIProvider` inside `ReefKnotProvider`, with the modal configuration. It owns discovery, search, errors and connection actions. Multiple hook consumers share this owner; mounting separate owners for the same UI is unnecessary.

```tsx
<ReefKnotUIProvider config={walletsModalConfig}>
  <YourWalletPicker />
</ReefKnotUIProvider>
```

Hooks read the provider configuration. Their optional `config` argument must be the same object passed to the provider.

| API                                      | Returned state and actions                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------------------- |
| `useConnectionFlow()`                    | `startConnection()` starts eager connection or opens the picker                    |
| `useReefKnotModal()`                     | Current screen, stack, async open, close and cancel                                |
| `useWalletPicker(config?)`               | Sorted wallets, search, expansion, discovery, errors and list actions              |
| `useWalletConnection(walletId, config?)` | Wallet data, visibility, disabled/loading/error and `connect()`                    |
| `useTerms(config?)`                      | Consent, links and `setChecked(boolean)`                                           |
| `useEagerConnectScreen(config?)`         | Retry action, loading and mapped error message                                     |
| `useEIP6963Picker(config?)`              | Announced providers, loading, error and `select(provider)`                         |
| `useLedgerFlow()`                        | Device screen, accounts, pagination, derivation paths, retry and account selection |

Render `ReefKnotLedgerProvider` only while displaying the Ledger flow, inside `ReefKnotUIProvider`. Its `isActive` prop defaults to true. It owns the transport and account discovery; view components never receive the transport itself.

Connection actions enforce consent and serialize requests. They own reconnect persistence, callback delivery and completion of nested screens. Failed manual actions leave the screen open and expose an `error`; callers should render it and allow retry. Deeplink/install actions open the wallet and do not report a successful connection.

For a custom dialog, reuse `useModalFocus`, `useEscape`, `useLockScroll` and `useModalClose`, or implement equivalent accessibility behavior. The API deliberately does not dictate DOM structure. `ReefKnotModalRenderer` is an optional composition helper; it requires a complete `ReefKnotUIComponents` map and has no default visuals.

The `apps/demo-react` playground has a **Wallet UI** selector: **Legacy**, **Lido App UI**, and **Custom**. It changes only the wallet dialog, using one wallet catalog and one connection configuration. Legacy is the default; selection resets on reload. Switching is disabled while a wallet screen or connection is active and preserves an already connected account.

The complete custom UI example is in `apps/demo-react/features/wallet-ui/custom-modal.tsx`. It uses public hooks for picker, Terms, eager, EIP-6963 and Ledger, native HTML controls and a CSS Module. Its dialog uses the public focus, Escape and scroll-lock hooks.

Run `yarn build-packages`, then `yarn workspace demo-react dev`. The existing theme switch applies to all three dialogs. This demo intentionally loads both UI kits for comparison; normal applications still choose one UI skin.

## Replace visual parts

Both UI skins accept `components?: Partial<ReefKnotUIComponents>`. Omitted components retain the UI skin defaults. Replace `ModalContainer`, `WalletButton`, `Terms`, `WalletPicker`, `EagerConnect`, `Requirements`, `ConnectionError`, `EIP6963Picker`, `LedgerConnection`, `LedgerAccounts` or `LedgerError`.

```tsx
<ReefKnotWalletsModal
  config={walletsModalConfig}
  theme="light"
  components={{ WalletButton: YourWalletCard }}
/>
```

The component receives prepared props such as `name`, `icon`, `disabled`, `isLoading` and `onConnect`. Screen props contain shared state/actions and prepared child parts. Standard screens honor child-part overrides. Replacing an entire screen gives the application ownership of its composition.

## Migrate a legacy integration

Version 9 removes visual exports from `reef-knot`. Follow the [8.x → 9 migration guide](migration-guide-8.x-to-9.md) for the full upgrade steps. Keep providers, hooks, configuration helpers and wallet catalogs imported from `reef-knot`; move the modal and UI primitives to `@reef-knot/ui-lido-legacy`.

```tsx
import { getDefaultConfig, getDefaultWalletsModalConfig } from 'reef-knot';
import { ReefKnotWalletsModal } from '@reef-knot/ui-lido-legacy';
```

Existing `darkThemeEnabled`, `buttonsFullWidth` and modal props remain supported. The `buttonComponentsByConnectorId` registry and wallet-specific `Connect*` components have been removed. Replace custom buttons with `components.WalletButton`: it receives prepared data and `onConnect`, while the core handles connection rules, loading, reconnect storage and callbacks.

The split does not migrate storage keys or invalidate Terms acceptance. Reconnect, provider selection and derivation paths retain their existing identities.

## Validation

Run `yarn check-packages` for package TypeScript, lint and scenario tests. The gate also checks the TypeScript of the headless/UI tests and build configurations.

Connection failures in the wallet picker and EIP-6963 picker replace the current
view with `components.ConnectionError`. Its props contain the original `error`, a prepared `errorMessage`, and an
`onBack` action. The message uses a non-empty viem/wagmi `shortMessage`, falling
back to `Error.message` for other errors. Back, Close and Escape dismiss the error without completing or
cancelling the underlying connection flow; search, expansion, consent and nested
screens are preserved. Custom interfaces can dismiss errors through
`useWalletPicker().dismissError()` or `useEIP6963Picker().dismissError()`.
Ledger retains its dedicated error screen, and eager connection retains its
inline error and retry action.
