# Reef Knot &nbsp; <img src="logo.svg" alt='Reef Knot logo' height='45' align='top'/> &nbsp;

[![NPM Version](https://img.shields.io/npm/v/reef-knot)](https://www.npmjs.com/package/reef-knot)

Web3 Wallets Connection Library

---

## Documentation

- [How to add a wallet](docs/how-to-add-a-wallet.md)
- [Migration guide](docs/migration-guide.md)

---

## Installation

### Add the reef-knot package

#### Using NPM

```bash
npm install reef-knot
```

#### Using Yarn

```bash
yarn add reef-knot
```

### Wagmi and Viem

Reef Knot relies on the `wagmi` and `viem` libraries as peer dependencies. To install these libraries, follow the ["Getting Started"](https://wagmi.sh/react/getting-started) guide in the wagmi documentation.

### Example Setup

For an example of Reef Knot setup and configuration, check out [this demo app](https://github.com/lidofinance/reef-knot/blob/main/apps/demo-react/providers/web3.tsx).

### Required Imports

To set up Reef Knot, you’ll need the following imports:

```typescript
import { ReefKnotProvider, getDefaultConfig } from 'reef-knot/core-react';
import {
  ReefKnotWalletsModal,
  getDefaultWalletsModalConfig,
} from 'reef-knot/connect-wallet-modal';
import { WalletsListEthereum } from 'reef-knot/wallets';
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

For more details, refer to the `connect-wallet-modal` package's [README](packages/connect-wallet-modal/README.md)

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

To enable a dark theme for the Wallet Connection Modal, use the `darkThemeEnabled` prop on the `<ReefKnotWalletsModal>` component.

### Triggering the Wallet Connection Modal

To open the Wallet Connection Modal, use the `useConnect` hook provided by Reef Knot.

#### Import the Hook

```typescript
import { useConnect } from 'reef-knot/core-react';
```

#### Use the Hook

Call the `useConnect` hook to get the `connect` callback:

```typescript
const { connect } = useConnect();
```

#### How `connect` Works

The `connect` callback determines the current environment (e.g., desktop browser, mobile wallet app, iframe) and behaves accordingly:

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

Install the dependencies, build everything:

```
yarn install & yarn build
```

### Commands

- `yarn dev` runs the `dev` script for all apps and packages.
  Usually apps are launched using `next dev` and packages are built using rollup with `--watch` flag, which rebuilds the bundle when its source files change on disk.
- `yarn build` - Build all apps and packages.
- `yarn build-apps` - Build apps only.
- `yarn build-packages` - Build packages only.

### How to release a new version

The [Changesets](https://github.com/changesets/changesets) tool is used for publishing new versions.  
To release a new version, see [the instruction in the docs](docs/how-to-release.md).
