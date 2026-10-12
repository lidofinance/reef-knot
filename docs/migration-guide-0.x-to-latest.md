# Migration guide: Reef Knot 0.x → latest

This guide covers the migration from a 0.x integration to the current Reef Knot architecture. The headless/UI split described here is planned for v9; until v9 is published, the corresponding packages and API may require a prerelease. See the [changelog](../packages/reef-knot/CHANGELOG.md) for released versions.

If your application already uses 8.x, follow [8.x → 9](migration-guide-8.x-to-9.md). For a new integration, use the [README](../README.md#installation).

## 1. Update the connection dependencies

The current integration uses:

| Dependency              | Requirement                                           |
| ----------------------- | ----------------------------------------------------- |
| `wagmi`                 | Compatible 3.x release, at least 3.6                  |
| `viem`                  | Compatible 2.x release, at least 2.50                 |
| `@tanstack/react-query` | 5.x, at least 5.51.1                                  |
| React and React DOM     | 18 for the Lido App UI skin; the core declares `>=18` |
| TypeScript              | At least 5.9.3 for the current wagmi types            |

See [wagmi's TypeScript requirements](https://wagmi.sh/react/typescript). Pin and upgrade wagmi and TypeScript together when reproducible type checking is important.

Migrating an old application's direct wagmi calls is separate from upgrading Reef Knot. Review the wagmi migration guides for the versions you cross: [0.x → 1.x](https://1.x.wagmi.sh/react/migration-guide), [1.x → 2.x](https://wagmi.sh/react/guides/migrate-from-v1-to-v2) and [2.x → 3.x](https://wagmi.sh/react/guides/migrate-from-v2-to-v3).

Remove old Reef Knot packages such as `@reef-knot/web3-react`, `@reef-knot/core-react` and `@reef-knot/connect-wallet-modal` after migrating their imports. Remove web3-react or ethers dependencies only if no other part of the application uses them. Wallet adapter packages remain available for custom wallet catalogs.

## 2. Choose a UI skin or build a custom interface

In v9, `reef-knot` contains providers, wallet catalogs, configuration and headless hooks. It has no Lido UI or styled-components dependency. A ready-made modal requires one UI skin:

| Choice                   | Package                     | Additional UI dependencies                                 |
| ------------------------ | --------------------------- | ---------------------------------------------------------- |
| Previous Lido appearance | `@reef-knot/ui-lido-legacy` | `@lidofinance/lido-ui` 3.x and styled-components 5         |
| Lido App UI appearance   | `@reef-knot/ui-lido`        | `@lidofinance/lido-app-ui` (verified with 1.4.0), React 18 |
| Custom UI                | None                        | Your own view components                                   |

The legacy skin is the simplest starting point for preserving the previous appearance. Custom components from a 0.x integration still need migration; choosing the legacy skin does not restore the old connection APIs.

Use the [v9 migration guide](migration-guide-8.x-to-9.md) for installation, imports, CSS and configuration examples. Use the [headless API guide](headless-ui.md) for custom interfaces and component replacements.

Version 9 removes all `reef-knot/*` subpath imports and the root namespace exports. If your integration uses intermediate releases with paths such as `reef-knot/core-react`, `reef-knot/wallets` or `reef-knot/web3-react`, follow the [old path → new path table](migration-guide-8.x-to-9.md#update-imports-and-configuration).

## 3. Replace the old provider setup

Remove the old `ProviderWeb3`, `WalletsModalForEth` and standalone auto-connect wiring where present. Integrations copied from intermediate v2–v5 releases may also contain the former `ReefKnot` provider and `AutoConnect` component.

Configure the current integration through `getDefaultConfig` and `getDefaultWalletsModalConfig` from `reef-knot`. Keep one instance of each provider in this order:

```tsx
<WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
  <QueryClientProvider client={queryClient}>
    <ReefKnotProvider config={reefKnotConfig}>
      <ReefKnotWalletsModal config={walletsModalConfig} />
      {children}
    </ReefKnotProvider>
  </QueryClientProvider>
</WagmiProvider>
```

This example uses `ReefKnotWalletsModal` from the legacy skin. The Lido App UI skin requires an explicit `theme="light"` or `theme="dark"` prop.

Set `autoConnect` in the Reef Knot config according to your application requirements. Keep wagmi's `reconnectOnMount={false}` because Reef Knot owns eager connection and reconnect. Keep the configuration and QueryClient stable across renders.

## 4. Replace `useWeb3` by responsibility

`useWeb3` is no longer exported. It previously combined state from multiple connection libraries; there is no single replacement for every field it returned.

`useSupportedChains` is also removed. Use `useConfig().chains` and `useConnection().chainId` from wagmi, or keep a local helper. See [the replacement example and unsupported-chain behavior](migration-guide-8.x-to-9.md#replace-removed-web3-react-hooks).

| Application task                             | Current API                                             |
| -------------------------------------------- | ------------------------------------------------------- |
| Read address, chain and connection status    | `useConnection` from `wagmi`                            |
| Read the wagmi configuration                 | `useConfig` from `wagmi`                                |
| Access a wallet client                       | `useWalletClient` from `wagmi`                          |
| Start the Reef Knot connection scenario      | `useConnectionFlow` from `reef-knot`                    |
| Disconnect using Reef Knot's storage cleanup | `useDisconnect` / `useForceDisconnect` from `reef-knot` |

```tsx
import { useConnection } from 'wagmi';
import { useConnectionFlow } from 'reef-knot';

const { address, isConnected } = useConnection();
const { startConnection } = useConnectionFlow();
```

`startConnection()` attempts eager connection or opens the wallet picker. Its promise returns `{ success: boolean }` when that scenario finishes. It does not provide connection state. Reef Knot's older `useConnect().connect()` remains available as a deprecated wrapper; wagmi's hook of the same name has a different contract.

## 5. Review the wallet catalog and UI customizations

Use `WalletsListEthereum` as the current default catalog or compose a custom catalog from supported wallet adapters. Old wallet IDs may no longer exist. Version 8.0 removed the `binanceWallet`, `coinbase`, `trust`, `exodus`, `brave`, `ctrl` and `coin98` adapters; review saved configuration and `walletsShown` / `walletsPinned` against the current catalog.

The `buttonComponentsByConnectorId` registry and wallet-specific `Connect*` components are removed in v9. Use `components.WalletButton` or the public headless hooks, as described in [8.x → 9](migration-guide-8.x-to-9.md#replace-custom-connect-buttons).

The modal configuration option `linkDontHaveWallet` is also removed, including its link in the legacy skin. Remove it from your configuration; keep `linkTerms` and `linkPrivacyNotice`. If you need a wallet help link, render it in your application or a custom `components.WalletPicker` view.

## 6. Review SSR and unrelated legacy SDK code

Do not assume that a `NoSSRWrapper` is required for every new integration. Server rendering of the Lido App UI skin has been verified with a bundled application. Browser interactions and wallet connection still run on the client. Keep any existing client-only boundary until you have checked your framework's SSR and hydration setup; see the [headless API guide](headless-ui.md) for the direct Node.js import limitation.

A legacy Lido JS SDK integration is a separate migration. If the application still uses its `ProviderSDK` or ethers-based code, review those dependencies independently; removing Reef Knot's old web3-react layer does not prove that the rest of the application no longer needs them.

## Verify the migration

Run the application's TypeScript check and production build. Exercise consent, manual connection, cancellation, eager connection where applicable, reconnect, disconnect and any Ledger or EIP-6963 paths the application supports. Check that analytics callbacks fire once and that keyboard focus returns after closing the dialog.

For the v9-specific changes and examples, continue with [8.x → 9](migration-guide-8.x-to-9.md).
