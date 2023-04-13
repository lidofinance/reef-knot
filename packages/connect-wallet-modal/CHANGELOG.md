# @reef-knot/connect-wallet-modal

## 1.0.8

### Patch Changes

- Tally => Taho in conflict checks
- Reset the Terms acceptance for all users
- Updated dependencies
  - @reef-knot/web3-react@1.0.6

## 1.0.7

### Patch Changes

- Update Terms text
- Updated dependencies
  - @reef-knot/ui-react@1.0.3

## 1.0.6

### Patch Changes

- Replace Tally legacy connector with Taho wallet adapter
- Fix: duplicated "Injected" react element key for wallet connection buttons
- Updated dependencies
  - @reef-knot/web3-react@1.0.5

## 1.0.5

### Patch Changes

- Support custom connectors for wallet adapters. Improve getWalletsButtons().
- Updated dependencies
  - @reef-knot/core-react@1.0.1
  - @reef-knot/web3-react@1.0.4
  - @reef-knot/ui-react@1.0.2

## 1.0.4

### Patch Changes

- Remove wagmiChains props, make walletConnectProjectId optional
- Updated dependencies
  - @reef-knot/web3-react@1.0.3

## 1.0.3

### Patch Changes

- Add checks that `window` is defined

## 1.0.2

### Patch Changes

- Set typescript compilerOptions.jsx = "react"
- Updated dependencies
  - @reef-knot/ui-react@1.0.1
  - @reef-knot/web3-react@1.0.2

## 1.0.1

### Patch Changes

- Fix error with useLocalStorage hook

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

### Patch Changes

- Updated dependencies
  - @reef-knot/web3-react@1.0.0
  - @reef-knot/core-react@1.0.0
  - @reef-knot/ui-react@1.0.0
  - @reef-knot/wallets-icons@1.0.0
  - @reef-knot/wallets-list@1.0.0

## 0.5.2

### Patch Changes

- Fix scrollbar padding and margin
- Support dark color theme
- ua-parser-js 1.0.33

## 0.5.1

### Patch Changes

- Improve the modal's scrollbar

## 0.5.0

### Minor Changes

- Improve the modal's styles, rework scroll behavior

### Patch Changes

- Updated dependencies
  - @reef-knot/ui-react@0.2.0

## 0.4.0

### Minor Changes

- Add Zerion wallet

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-icons@0.2.0

## 0.3.0

### Minor Changes

- Add Metrics Events for clicks on wallets connection buttons

## 0.2.0

### Minor Changes

- Add Metrics Events support

### Patch Changes

- Updated dependencies
  - @reef-knot/web3-react@0.2.0

## 0.1.1

### Patch Changes

- Add explanation for Ledger direct connection error

## 0.1.0

### Minor Changes

- Support Trust Wallet browser extension

### Patch Changes

- Updated dependencies
  - @reef-knot/web3-react@0.1.0
