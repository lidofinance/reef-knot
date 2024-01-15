# @reef-knot/wallets-icons

## 1.6.0

### Minor Changes

- DEPRECATE

## 1.5.0

### Minor Changes

- Remove Coinbase related code

## 1.4.0

### Minor Changes

- Remove XDEFI, Trust, imToken icons

## 1.3.0

### Minor Changes

- Remove MathWallet related code

## 1.2.0

### Minor Changes

- Remove Brave, Coin98, Opera, Gamestop wallets unneeded legacy code

## 1.1.0

### Minor Changes

- Update XDEFI and Trust logo, remove not used logos

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

## 0.2.0

### Minor Changes

- Add Zerion wallet
