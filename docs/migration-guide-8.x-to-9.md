# Migration guide: Reef Knot 8.x → 9

This guide describes the v9 changes implemented in this branch. Version 9 and the UI skin packages must be published before the stable installation commands below can be used; use the corresponding prerelease versions when testing before release.

For older integrations, start with [0.x → latest](migration-guide-0.x-to-latest.md). See the [headless API guide](headless-ui.md) for the complete UI contract.

## What changes

| Area                      | 8.x                                          | 9                                                               |
| ------------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| Ready-made UI             | Exported by `reef-knot`                      | Supplied by a separate UI skin                                  |
| Core UI dependencies      | Legacy Lido UI and styled-components         | No UI kit, styled-components or CSS dependency                  |
| Modal configuration       | Includes `buttonComponentsByConnectorId`     | Data, links and callbacks only                                  |
| Custom connection buttons | Registry of wallet-specific React components | `components.WalletButton` or headless hooks                     |
| Connection entry point    | `useConnect().connect()`                     | `useConnectionFlow().startConnection()`; old call is deprecated |
| Custom interface          | Connection behavior mixed into UI components | Public headless hooks and view contracts                        |

Wagmi v3 was already introduced in Reef Knot 8.0. The minimum wagmi 3.6 and viem 2.50 requirements were introduced in 8.3; they are not new v9 requirements. If you are upgrading from an earlier 8.x release, update these dependencies too. The current development setup uses wagmi 3.6.21 and viem 2.51.3. Current wagmi types require [TypeScript 5.9.3 or later](https://wagmi.sh/react/typescript).

## Choose and install one UI skin

### Preserve the legacy appearance

After the v9 release:

```sh
yarn add reef-knot@^9 @reef-knot/ui-lido-legacy @lidofinance/lido-ui@^3.18.0 styled-components@^5.3.5
```

Keep the existing legacy Lido UI ThemeProvider and styled-components SSR setup. The modal still accepts `darkThemeEnabled`, `buttonsFullWidth` and legacy modal props.

### Use Lido App UI

After the v9 release:

```sh
yarn add reef-knot@^9 @reef-knot/ui-lido @lidofinance/lido-app-ui@1.4.0
```

The Lido App UI skin requires React and React DOM 18. It does not require legacy `@lidofinance/lido-ui` or styled-components. Remove those dependencies only if no other part of the application uses them. Load both CSS exports from your global stylesheet entry, such as `_app.tsx` in Next.js Pages Router:

```tsx
import '@lidofinance/lido-app-ui/index.css';
import '@reef-knot/ui-lido/styles.css';
```

The UI skin packages have their own release versions. Install a skin release compatible with Reef Knot 9; do not assume that its major version is also 9. Choose one skin for a normal application.

### Use a custom interface

Install `reef-knot@^9` and its connection peers without either UI skin. Implement the interface with public hooks and mount `ReefKnotUIProvider` inside `ReefKnotProvider`. See [the custom UI example](../apps/demo-react/features/wallet-ui/custom-modal.tsx) and the [headless API guide](headless-ui.md#custom-ui).

## Update imports and configuration

Before:

```tsx
import {
  ReefKnotProvider,
  ReefKnotWalletsModal,
  getDefaultConfig,
  getDefaultWalletsModalConfig,
} from 'reef-knot';
```

After, for the legacy skin:

```tsx
import {
  ReefKnotProvider,
  getDefaultConfig,
  getDefaultWalletsModalConfig,
} from 'reef-knot';
import { ReefKnotWalletsModal } from '@reef-knot/ui-lido-legacy';
```

For the Lido App UI skin, import the modal from `@reef-knot/ui-lido` instead. UI primitives such as `Modal`, `Button` and `ConnectButtonBase`, and their visual prop types, move to the legacy skin if your application still uses them. `ButtonComponentsByConnectorId`, `ConnectWalletButtonProps`, `WALLETS_MODAL_BUTTON_COMPONENTS_DEFAULT` and wallet-specific `Connect*` components are removed.

Configuration helpers remain in the core. Remove `buttonComponentsByConnectorId` from arguments passed to `getDefaultConfig` and from modal configuration; `getDefaultWalletsModalConfig()` no longer returns it. Keep your wallet catalog, list settings, links and connection callbacks.

The root `reef-knot` entry point is the supported import path for core APIs. Update old package or deep imports instead of importing files from `reef-knot/dist` or `reef-knot/src`.

## Keep one provider stack

The provider structure remains the same:

```tsx
<WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
  <QueryClientProvider client={queryClient}>
    <ReefKnotProvider config={reefKnotConfig}>
      <ReefKnotWalletsModal
        config={walletsModalConfig}
        darkThemeEnabled={isDark}
      />
      {children}
    </ReefKnotProvider>
  </QueryClientProvider>
</WagmiProvider>
```

This example uses the legacy skin. A ready-made modal creates its own `ReefKnotUIProvider`; do not add a second UI provider around it. Keep `getDefaultConfig` results and the QueryClient stable, and retain `reconnectOnMount={false}` so wagmi does not duplicate Reef Knot's reconnect flow.

With the Lido App UI skin, replace the modal props with:

```tsx
<ReefKnotWalletsModal
  config={walletsModalConfig}
  theme={isDark ? 'dark' : 'light'}
/>
```

`theme` is required. The skin applies `data-lido-theme` inside its portal. Switching to this skin does not automatically restyle the rest of the application.

## Update the connection entry point

Before:

```tsx
import { useConnect } from 'reef-knot';
const { connect } = useConnect();
await connect();
```

After:

```tsx
import { useConnectionFlow } from 'reef-knot';
const { startConnection } = useConnectionFlow();
const result = await startConnection(); // { success: boolean }
```

This starts eager connection or opens the picker and waits for the scenario's result. `useConnect().connect()` remains available as a deprecated compatibility wrapper, so this rename can be migrated separately from the required UI import changes. Wagmi's `useConnect` is unchanged and does not replace the Reef Knot entry point.

## Replace custom connect buttons

Remove the old registry and use `components.WalletButton`. The replacement receives `WalletButtonViewProps` from `reef-knot`:

```tsx
import type { WalletButtonViewProps } from 'reef-knot';

function CustomWalletButton({
  walletId,
  name,
  disabled,
  isLoading,
  onConnect,
}: WalletButtonViewProps) {
  return (
    <button
      type="button"
      data-wallet-id={walletId}
      disabled={disabled}
      onClick={onConnect}
    >
      {isLoading ? 'Connecting…' : name}
    </button>
  );
}

// Example with the Lido App UI skin:
<ReefKnotWalletsModal
  config={walletsModalConfig}
  theme="light"
  components={{ WalletButton: CustomWalletButton }}
/>;
```

Use `walletId` to choose wallet-specific visuals when necessary. Call the provided `onConnect` rather than reimplementing connector selection, consent checks, loading, reconnect persistence or connection callbacks. Legacy `onConnectStart` / `onConnectSuccess` button props are removed; application callbacks belong in the modal config.

Other replaceable parts include `ModalContainer`, `Terms`, `WalletPicker`, `EagerConnect`, `Requirements`, `EIP6963Picker` and the three Ledger screens. Omitted parts keep the skin's defaults. Replacing a whole screen gives your application responsibility for composing that screen; see [component customization](headless-ui.md#replace-visual-parts).

## Connection state and validation

The storage keys for Terms acceptance, reconnect and Ledger derivation paths are unchanged. The migration does not intentionally clear accepted Terms or remembered wallets. Keep the existing `onConnectStart`, `onConnectSuccess`, `onAutoConnect` and `onReconnect` configuration callbacks as applicable.

Run your application's TypeScript check and production build, then verify connection, cancellation, errors/retry, reconnect and disconnect. For custom views, also check Terms gating, nested screen navigation, Ledger/EIP-6963 where used, keyboard focus, mobile layout and both themes. Ensure there is only one mounted modal implementation and callbacks fire once.
