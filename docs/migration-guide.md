# Migration guide from 0.x to the current version

This guide provides detailed instructions and best practices for migrating your project from Reef Knot v0.x to the current version.
It covers breaking changes, updated dependencies, and new component implementations to ensure a smooth transition.
Use this guide to update your project efficiently while leveraging the latest features and improvements in Reef Knot.

If you're looking for instructions to install Reef Knot from scratch, refer to the [README](README.md#installation).

#### Note about wagmi library

Before you begin, you may want to familiarize yourself with the following:

- [wagmi library](https://wagmi.sh/)
- [viem library](https://viem.sh/)

Historically, Reef Knot v0.x-v1.x utilized both `web3-react` v6 and `wagmi` v0.x at the same time.
Some wallets relied on the legacy `web3-react` code, while others were transitioned to `wagmi`.

The current version of Reef Knot uses `wagmi` for all wallet connections.

## Dependencies

### 1. Update TS to v5

`wagmi` types require TypeScript >=5.0.4. For more details, refer to the [wagmi TypeScript documentation](https://wagmi.sh/react/typescript).

Since Reef Knot also depends on TypeScript v5, you will need to upgrade your TypeScript version if your dApp is currently using TypeScript v4.

### 2. Update wagmi to v2, add viem, @tanstack/react-query

There is a chance, that your app is using wagmi v0.12.x, which is not maintained anymore.

The current version of Reef Knot is built on wagmi v2.x.
There were a lot of [breaking changes between 0.x and 1.x versions](https://1.x.wagmi.sh/react/migration-guide),
and then [between 1.x and 2.x](https://wagmi.sh/react/guides/migrate-from-v1-to-v2).

The good news is that most of this changes were handled inside reef-knot and doesn't require a lot of actions on a dApp side.

Use [manual installation instructions](https://wagmi.sh/react/getting-started#manual-installation) from wagmi docs for details.

Basically, you will need to:

1. Update the `wagmi` dependency to the latest 2.x version
2. Add `viem` v2.x and `@tanstack/react-query` v5.x
3. Update config for `WagmiProvider`

### 3. Remove web3-react dependency

web3-react is a library similar to wagmi, previously used to manage wallet connections in reef-knot.

At one point, Reef Knot partially used web3-react for some wallets and wagmi for others.
However, Reef Knot has since transitioned to using wagmi exclusively for all wallet connections.

As a result, the web3-react dependency is no longer needed and should be completely removed from your project.

### 4. React v18

Reef Knot v0.x was built using React v17. The current version of Reef Knot is now based on React v18.
If your app is using React v17, you will likely need to upgrade it to React v18.

### 5. Update reef-knot package

Use the latest available version – v7.x at the moment of writing.

### 6. reef-knot subpackages

Ensure that the project depends on 'reef-knot' package only and there are no dependencies on '@reef-knot/\*' subpackages.

## Code changes

### 1. reef-knot imports

Ensure your code does not contain direct imports from Reef Knot subpackages. If found, simply remove the `@` sign to correct the import.

**BAD:**

```ts
import { useWeb3 } from '@reef-knot/web3-react';
```

**GOOD:**

```ts
import { useWeb3 } from 'reef-knot/web3-react';
```

### 2. Remove deprecated code

1. Search your project's code for the `WalletsModalForEth` component and remove it completely, as the Wallet Connection Modal has been updated.
2. Search your project's code for the `ProviderWeb3` React Context Provider and remove it if it exists.
3. If your app depends on reef-knot v2-v5, then remove the `ReefKnot` React Context Provider and the `AutoConnect` component.

### 3. Set Up Reef Knot

Follow the latest [installation instructions](README.md#installation) to properly set up the updated version of Reef Knot in your project.

## Other Notes

### NoSSRWrapper

If you are using reef-knot v0.x, then, most likely, your code already has some NoSSRWrapper usage.
This is still needed. For the additional info, see the [NoSSRWrapper paragraph in README](README.md#nossrwrapper).

### useWeb3 hook deprecation

The `useWeb3` hook provides various details about the connected wallet.
There is a high chance that it is used extensively throughout your application.

Previously, it played a crucial role by returning information from either the web3-react or wagmi libraries,
depending on the connected wallet. However, since the web3-react library has been removed from Reef Knot,
the current version is based solely on wagmi.

As a result, the useWeb3 hook now acts as a redundant proxy for wagmi hooks. While it will continue to function,
it is recommended to replace it with standard wagmi hooks to avoid unnecessary abstractions.

### Additional references

The most significant changes were introduced during the v2 and v6 updates.
You can use these PRs as references for updating Reef Knot versions:

- [Update to v2](https://github.com/lidofinance/ethereum-staking-widget/pull/265/files)
- [Update to v6](https://github.com/lidofinance/reef-knot/pull/183/files)
