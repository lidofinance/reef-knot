# @reef-knot/web3-react

## 1.3.0

### Minor Changes

- Use ledger connectors from reef-knot, pass supportedChainsId in LedgerHQFrameConnector

### Patch Changes

- Updated dependencies
  - @reef-knot/ledger-connector@1.0.0

## 1.2.2

### Patch Changes

- remove walletconnect v1 leftovers

## 1.2.1

### Patch Changes

- Update wagmi to v0.12.17
- Updated dependencies
  - @reef-knot/core-react@1.4.1

## 1.2.0

### Minor Changes

- Explicitly pass chains to wagmi connectors, update wagmi to v0.12.16

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- Remove circular deps
- Pass through WalletConnect project ID to the ReefKnot context
- Updated dependencies
  - @reef-knot/core-react@1.3.1

## 1.1.0

### Minor Changes

- faa8815: Update wagmi to v0.12
- faa8815: Update Wallet Adapter API for WalletConnect

### Patch Changes

- Updated dependencies [faa8815]
  - @reef-knot/core-react@1.3.0

## 1.0.7

### Patch Changes

- Do not detect providerName if isDappBrowser;
- Fix switching between web3 providers;

## 1.0.6

### Patch Changes

- Fix setting a Web3Provider for web3-react
- If the chain is unsupported and connected via wagmi, handle it the same way as web3-react does

## 1.0.5

### Patch Changes

- Replace Tally legacy connector with Taho wallet adapter

## 1.0.4

### Patch Changes

- 1. Call wagmi disconnect into useForceDisconnect.
  2. Remove old Exodus code and other unused code.
  3. Use custom wagmi connectors to get providerName.
  4. Export isConnectedViaWagmi from useConnectorInfo.
  5. Check for isConnectedViaWagmi in useAutoConnect.

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
