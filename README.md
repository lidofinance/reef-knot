# Reef Knot &nbsp; <img src="logo.svg" alt='Reef Knot logo' height='45' align='top'/> &nbsp;

[![NPM Version](https://img.shields.io/npm/v/reef-knot)](https://www.npmjs.com/package/reef-knot)

Web3 Wallets Connection Library

---

## Documentation

- [How to add a wallet](docs/how-to-add-a-wallet.md)
- [Migration guide: 0.x → latest](docs/migration-guide-0.x-to-latest.md)
- [Migration guide: 8.x → 9](docs/migration-guide-8.x-to-9.md)

---

## Installation

### Add the reef-knot package

#### Using NPM

```bash
npm install reef-knot @reef-knot/ui-lido-legacy
```

#### Using Yarn

```bash
yarn add reef-knot @reef-knot/ui-lido-legacy
```

### Wagmi and Viem

Reef Knot relies on the `wagmi` and `viem` libraries as peer dependencies. To install these libraries, follow the ["Getting Started"](https://wagmi.sh/react/getting-started) guide in the wagmi documentation.

### Example Setup

For an example of Reef Knot setup and configuration, check out [this demo app](https://github.com/lidofinance/reef-knot/blob/main/apps/demo-react/providers/web3.tsx).

### Required Imports

To set up Reef Knot, you’ll need the following imports:

```typescript
import {
  ReefKnotProvider,
  WalletsListEthereum,
  getDefaultConfig,
  getDefaultWalletsModalConfig,
} from 'reef-knot';
import { ReefKnotWalletsModal } from '@reef-knot/ui-lido-legacy';
```

### Setting Up Providers

1. Place the `<ReefKnotProvider>` inside the Wagmi Context Provider.
2. Place the `<ReefKnotWalletsModal>` component inside the `<ReefKnotProvider>`. This component manages the Wallet Connection Modal.

### Configuration

#### Example

You can refer to [the code of the Reef Knot demo app](https://github.com/lidofinance/reef-knot/blob/main/apps/demo-react/providers/web3.tsx) as a reference for setting up the configuration.

#### Description

Reef Knot provides the `getDefaultConfig` helper function, which acts as a single entry point for configuring both `wagmi` and Reef Knot:

```typescript
const { wagmiConfig, reefKnotConfig, walletsModalConfig } = getDefaultConfig({
walletsList: WalletsListEthereum,
// Other config options
...

// Wallets configuration
...getDefaultWalletsModalConfig(),
});
```

The `getDefaultWalletsModalConfig` function provides default configuration options for the Wallet Connection Modal, such as:

- The wallets to display or pin
- Links to the terms of service and privacy policy

Providers, headless hooks, configuration types and the default wallet list are exported from `reef-knot`. UI components are exported from `@reef-knot/ui-lido-legacy` or `@reef-knot/ui-lido`. See [headless UI and migration](docs/headless-ui.md).

### WalletsListEthereum

`WalletsListEthereum` is a default list of wallet adapters.  
A wallet adapter is a package dedicated to a specific wallet.  
Each adapter exports an object that specifies the wallet's name,
its icon, how the wallet should be detected and connected, additional metadata and configuration.

You can import the default `WalletsListEthereum`, or create a custom list of wallet adapters by including only the wallets you need and excluding the unnecessary ones.

### How to Hide a Wallet

To hide a wallet from the Wallet Connection Modal, use the `walletsShown` prop, which is included by default in the configuration returned by `...getDefaultWalletsModalConfig()`.

The `walletsShown` prop is an array of wallet IDs. Simply remove the desired wallet ID from this array to hide the corresponding wallet in the modal.

### Passing Configurations

- Pass the `wagmiConfig` and `reefKnotConfig` objects from `getDefaultConfig` to the `config` props of their respective Context Providers.
- Pass the `walletsModalConfig` object to the `<ReefKnotWalletsModal>` component.

#### Dark Theme

The legacy UI skin accepts `darkThemeEnabled`. The Lido App UI skin accepts `theme="light"` or `theme="dark"`.

### Starting the Wallet Connection Flow

To start eager connection or open the wallet picker, use the `useConnectionFlow` hook provided by Reef Knot.

#### Import the Hook

```typescript
import { useConnectionFlow } from 'reef-knot';
```

#### Use the Hook

Call the `useConnectionFlow` hook to get the `startConnection` callback:

```typescript
const { startConnection } = useConnectionFlow();
```

#### How `startConnection` Works

The `startConnection` callback determines the current environment (e.g., desktop browser, mobile wallet app, iframe) and behaves accordingly:

- If the dApp is opened inside a wallet's dApp browser, it attempts an automatic connection with this specific wallet.
- Otherwise, it opens the Wallet Connection Modal for manual wallet selection.

---

## Troubleshooting

### NoSSRWrapper

If you encounter errors during server-side rendering, you may need to wrap certain parts of your code in a `NoSSRWrapper`. This wrapper disables server-side rendering for the specified area, helping to avoid SSR-related issues.
Here is an example of what the `NoSSRWrapper` code might look like:

```ts
import React from 'react';
import dynamic from 'next/dynamic';

const NoSSRWrapper = (props: { children: React.ReactNode }) => (
  <>{props.children}</>
);

export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
```

This restriction comes from early versions of wagmi library, which had limitations with SSR.
It is a known issue, and we are working on removing the need for such wrapping.

---

## Development

### Project structure

- The project is organized as monorepo using [turborepo](https://turbo.build/repo) tools.
- The `packages` dir contains packages, most of them are published to npm, but some are not.
- The `apps` dir contains an example application, which uses the packages to demonstrate wallets connection.

### Initial setup

Use Node.js 24.11 or later within the 24.x line (or Node.js 26+) and the pinned Yarn 4.17.1 through Corepack. Install the dependencies and build everything:

```bash
yarn install --immutable && yarn build
```

### TypeScript and bundling

Packages and the separate `playwright-tests/` project use the native TypeScript 7.0.2 compiler (`tsc`). The `@typescript/native` dependency aliases the stable `typescript` package. The `typescript` dependency aliases `@typescript/typescript6`, preserving the TypeScript 6 JS Compiler API for ESLint and Next.js and providing `tsc6` without a binary-name collision.

The Next.js 12 demo uses `tsc6` for its CLI check and TypeScript 6 for `next build`. Its `ignoreDeprecations: "6.0"` is local: Next.js 12 requires legacy module resolution, and the demo still uses `baseUrl` imports. Packages use `bundler` resolution; Playwright uses `NodeNext` with its existing CommonJS package scope. `types: ["*"]` preserves the global types loaded before TypeScript 6 changed the default.

tsdown 0.23.1 builds ES2020 ESM with external dependencies and unbundled output. Its built-in `tsgo` generator emits declarations and declaration maps through native TypeScript 7. The compiler path is resolved explicitly from `@typescript/native` because `typescript` supplies the TS 6 API. Declaration-generation failures fail the build; `yarn typecheck` remains the type-error gate. Legacy UI checks map `@lidofinance/lido-ui` to its existing declarations because that dependency's exports omit its types. tslib remains at 2.8.1.

Validation covered a clean build of all 18 packages, package type/lint/test gates, UI/configuration type checks, the Next.js demo build, watch rebuilding, and Playwright type/lint/test discovery (28 tests; no transactions executed). All 18 declaration entrypoints compile with TypeScript 5.9.3 using both `node10` and `bundler` resolution; the latter needs the same legacy Lido UI type mapping. Declaration maps, default exports, SVG output and UI CSS/assets were checked. The built-in generator preserves public entrypoint exports and default exports. Re-export-only declaration files do not require maps; concrete declarations retain source maps. OKX uses an explicit `rootDir: "src"` to preserve its declaration entrypoint. This development-tool upgrade does not raise the consumer TypeScript minimum (5.9.3).

### Commands

- `yarn dev` runs the `dev` script for all apps and packages.
  Usually apps are launched using `next dev` and packages are built using tsdown with `--watch`, which rebuilds the bundle when its source files change on disk.
- `yarn build` - Build all apps and packages.
- `yarn build-apps` - Build apps only.
- `yarn build-packages` - Build packages only.

### How to release a new version

The [Changesets](https://github.com/changesets/changesets) tool is used for publishing new versions.  
To release a new version, see [the instruction in the docs](docs/how-to-release.md).
