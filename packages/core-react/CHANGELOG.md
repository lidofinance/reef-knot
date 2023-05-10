# @reef-knot/core-react

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
