# @reef-knot/connect-wallet-modal

## 1.11.1

### Patch Changes

- Add custom connectors for injected wallets, which fixes an issue with autoconnection after page reload.

## 1.11.0

### Minor Changes

- Remove MathWallet related code

## 1.10.0

### Minor Changes

- Handle connection errors in AcceptTermsModal

## 1.9.0

### Minor Changes

- Remove Brave, Coin98, Opera, Gamestop wallets unneeded legacy code

## 1.8.3

### Patch Changes

- Remove 'themeOverride' deprecated prop from Select

## 1.8.2

### Patch Changes

- Remove lido-ui peer dependency

## 1.8.1

### Patch Changes

- Depend on @lidofinance/lido-ui v3.14.1 strictly. 3.14.1 has required "type: module" field, in 3.14.2 the field is removed.

## 1.8.0

### Minor Changes

- Rework direct Ledger hardware connection UI

## 1.7.0

### Minor Changes

- e2074ed: Make Coin98 wallet to use Wallet Adapter API

## 1.6.2

### Patch Changes

- fix: connection rejection logic during mobile browser autoconnect

## 1.6.1

### Patch Changes

- Move TERMS_ACCEPTANCE_LS_K const into core-react package

## 1.6.0

### Minor Changes

- e654dc5: Remove deprecated "icons" field from Wallet Adapater API
- 217c144: Show "Accept Terms" Modal for Ledger Live, Safe, dapp browsers

### Patch Changes

- 48d8c4b: Update wagmi to 0.12.19

## 1.5.1

### Patch Changes

- e6e579e: wagmi 0.12.18
- e6e579e: Rework and fix WalletConnect connection via pairing URI

## 1.5.0

### Patch Changes

- Updated dependencies
  - @reef-knot/web3-react@1.3.0

## 1.4.3

### Patch Changes

- Add a notification about WC v2 issues
- Updated dependencies
  - @reef-knot/core-react@1.4.2
  - @reef-knot/ui-react@1.0.4

## 1.4.2

### Patch Changes

- Fix: rework getWalletConnectConnector and its usage (reduce the amount of WC connectors), remove WC v1 imports and usage

## 1.4.1

### Patch Changes

- Update wagmi to v0.12.17
- Updated dependencies
  - @reef-knot/core-react@1.4.1
  - @reef-knot/types@1.2.1
  - @reef-knot/web3-react@1.2.1

## 1.4.0

### Minor Changes

- Explicitly pass chains to wagmi connectors, update wagmi to v0.12.16

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- Remove walletConnectProjectId prop from WalletsModal; Add display_uri handler for WalletConnect v2 (connection without qr modal)
- Remove circular deps
- Updated dependencies
  - @reef-knot/types@1.1.1
  - @reef-knot/core-react@1.3.1
  - @reef-knot/web3-react@1.1.1

## 1.3.0

### Minor Changes

- faa8815: Update wagmi to v0.12
- faa8815: Update Wallet Adapter API for WalletConnect

### Patch Changes

- Updated dependencies [faa8815]

## 1.2.0

### Patch Changes

- @reef-knot/core-react@1.2.0

## 1.1.1

### Patch Changes

- Improve the selection of the OKX wallet position

## 1.1.0

### Patch Changes

- Improve ConnectButtonIconStyle: height, radius
- Move OKX wallet to the second place in the wallet connection buttons list
- Updated dependencies
  - @reef-knot/core-react@1.1.0

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
