# @reef-knot/ui-react

## 1.0.2

### Patch Changes

- Fix modal width.

## 1.0.1

### Patch Changes

- Set typescript compilerOptions.jsx = "react"

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

- Improve the modal's styles, rework scroll behavior
