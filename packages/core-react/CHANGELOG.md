# @reef-knot/core-react

## 2.1.0

### Minor Changes

- 85b3f79:
  - rework getUnsupportedChainError, hide mumbai network in the error
  - (web3-react) fix logic of useConnectorError
  - (web3-react) deprecate useConnectorInfo, useDisconnect
  - (core-react) rework and add hooks: useConnectorInfo, useDisconnect, useEagerConnect
  - (reef-knot) add connectors export as "Connectors"

## 2.0.0

### Major Changes

- 1046886: Add auto-connect, based on wagmi and autoConnectOnly wallet adapters

## 1.8.1

### Patch Changes

- 253796d: Fix typings

## 1.8.0

### Minor Changes

- Use Ledger hid wallet adapter, based on wagmi

## 1.7.0

### Minor Changes

- Handle connection errors in AcceptTermsModal

## 1.6.0

### Minor Changes

- Add Holesky custom wagmi chain

## 1.5.1

### Patch Changes

- Move TERMS_ACCEPTANCE_LS_K const into core-react package

## 1.5.0

### Minor Changes

- 217c144: Show "Accept Terms" Modal for Ledger Live, Safe, dapp browsers

### Patch Changes

- 48d8c4b: Update wagmi to 0.12.19

## 1.4.3

### Patch Changes

- e6e579e: wagmi 0.12.18

## 1.4.2

### Patch Changes

- Add a notification about WC v2 issues
- Updated dependencies
  - @reef-knot/ui-react@1.0.4

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
