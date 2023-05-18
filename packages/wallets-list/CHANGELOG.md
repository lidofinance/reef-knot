# @reef-knot/wallets-list

## 1.3.0

### Minor Changes

- faa8815: Add adapters: Ambire, Blockchain.com, WalletConnect, ZenGo, Zerion

### Patch Changes

- Updated dependencies [faa8815]
  - @reef-knot/types@1.1.0
  - @reef-knot/wallet-adapter-exodus@1.1.0
  - @reef-knot/wallet-adapter-okx@1.1.0
  - @reef-knot/wallet-adapter-phantom@1.1.0
  - @reef-knot/wallet-adapter-taho@1.1.0
  - @reef-knot/wallet-adapter-ambire@1.1.0
  - @reef-knot/wallet-adapter-blockchaincom@1.1.0
  - @reef-knot/wallet-adapter-walletconnect@1.1.0
  - @reef-knot/wallet-adapter-zengo@1.1.0
  - @reef-knot/wallet-adapter-zerion@1.1.0

## 1.2.0

### Minor Changes

- Enable Phantom wallet

## 1.1.0

### Minor Changes

- Add OKX wallet

## 1.0.2

### Patch Changes

- Add Taho wallet

## 1.0.1

### Patch Changes

- Use @reef-knot/types.
- Updated dependencies
  - @reef-knot/wallet-adapter-exodus@1.0.1

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
  - @reef-knot/core-react@1.0.0
  - @reef-knot/wallet-adapter-exodus@1.0.0
