# @reef-knot/web3-react

## 1.0.3

### Patch Changes

- - Get account address from the shimmed `useWeb3` hook
  - Fix setting `providerWeb3` when a wallet is connected via wagmi

## 1.0.2

### Patch Changes

- Set typescript compilerOptions.jsx = "react"

## 1.0.1

### Patch Changes

- Shim useWeb3, useSupportedChains to also support wagmi data

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

## 0.3.0

### Minor Changes

- Add Zerion wallet detection

## 0.2.0

### Minor Changes

- Add Metrics Events support

## 0.1.0

### Minor Changes

- Support Trust Wallet browser extension
