# @reef-knot/core-react

## 1.4.1

### Patch Changes

- Update wagmi to v0.12.17
- Updated dependencies
  - @reef-knot/types@1.2.1
  - @reef-knot/wallets-list@1.4.1

## 1.4.0

### Minor Changes

- Explicitly pass chains to wagmi connectors, update wagmi to v0.12.16

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- Take WalletConnect project ID as a prop
- Add and export getWalletDataList, use a single instance of walletDataList
- Updated dependencies
  - @reef-knot/types@1.1.1
  - @reef-knot/wallets-list@1.3.1

## 1.3.0

### Minor Changes

- faa8815: Add Reef Knot context, clean up, wagmi v0.12

### Patch Changes

- Updated dependencies [faa8815]

## 1.2.0

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-list@1.2.0

## 1.1.1

### Patch Changes

- WalletConnect: actualize mobileLinks (wallets list on mobiles)

## 1.1.0

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-list@1.1.0

## 1.0.1

### Patch Changes

- Support custom connectors for wallet adapters. Reorganize code.
- Updated dependencies
  - @reef-knot/wallets-list@1.0.1

## 1.0.0

### Major Changes

- #### v1.0 is an update starting migration to wagmi
  - Update TS to 4.9.5, tslib to 2.5.0, rollup to 3.15.0
  - Update build config: generate ESM modules only, update tsconfig, change packages exports
  - Workaround styled-components ESM issue
  - Add wagmi dependency
  - Use wagmi controllers for all WalletConnect wallets (WC v2 support)
  - Add a modular wallet adapter API
  - Use a wallet adapter API with wagmi injected controller for Exodus wallet
  - Remove most of @lido-sdk dependencies
  - Cleanup and other minor changes
