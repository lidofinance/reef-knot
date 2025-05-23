# @reef-knot/connect-wallet-modal

## 7.3.0

### Minor Changes

- Adds ability to pass onAutoConnect and onReconnect callbacks to the reef-knot config
- Minor fixes and tech updates

## 7.2.0

### Minor Changes

- Update viem to v2.23 and wagmi to v2.14, so the @coinbase/wallet-sdk would be updated too, which fixes a dependabot issue

### Patch Changes

- @reef-knot/wallets-list@4.1.2

## 7.1.0

### Minor Changes

- Add Ctrl wallet, rm XDEFI wallet (rebranded into Ctrl)

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-list@4.1.0

## 7.0.1

### Patch Changes

- Ledger HID connection on slow network fixed

## 7.0.0

### Major Changes

- Metrics config refactored, replaced with certain actions callbacks

### Patch Changes

- Updated dependencies
  - @reef-knot/core-react@6.0.0
  - @reef-knot/types@4.0.0
  - @reef-knot/web3-react@6.0.0
  - @reef-knot/wallets-list@4.0.0

## 6.0.2

### Patch Changes

- Ledger HID metrics fixed

## 6.0.1

### Patch Changes

- Coinbase Smart Wallet displayed by default

## 6.0.0

### Major Changes

- reef-knot setup rework

### Patch Changes

- Updated dependencies
  - @reef-knot/core-react@5.0.0
  - @reef-knot/types@3.0.0
  - @reef-knot/web3-react@5.0.0
  - @reef-knot/wallets-list@3.0.0

## 5.5.4

### Patch Changes

- accbcde: viem and wagmi versions updated with flexible declarations
  - @reef-knot/wallets-list@2.3.1

## 5.5.3

### Patch Changes

- Hotfix: wallets metrics in WalletsModal

## 5.5.2

### Patch Changes

- 3bfcb7c: Fix modals props passing

## 5.5.1

### Patch Changes

- Fix the issue with paused loading animation for ConnectButtonLoader

## 5.5.0

### Minor Changes

- Add the "loading" state for WC and Binance wallet connection buttons;
- Fix the "retry" button for some cases in the Ledger HID connection modal;
- Show a loading spinner in the Ledger modal during ledger packages loading;
- Fix the issue with passing onClickWalletsLess, onClickWalletsMore props;

## 5.4.0

### Minor Changes

- Coinbase smart wallet connector

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-list@2.3.0

## 5.3.3

### Patch Changes

- Fix the issue with multiple clicks on ConnectBinance button

## 5.3.2

### Patch Changes

- Binance Wallet: actually use explicitly passed deeplink on mobiles
- Reorder wallets
  - @reef-knot/wallets-list@2.2.2

## 5.3.1

### Patch Changes

- Binance wallet: move up in the wallets display order, add deeplink, add detector fn
  - @reef-knot/wallets-list@2.2.1

## 5.3.0

### Minor Changes

- Add Binance Web3 Wallet

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-list@2.2.0

## 5.2.2

### Patch Changes

- Wallets modal: metrics props pass fixed

## 5.2.1

### Patch Changes

- Wallet modal show more/less wallets metrics added

## 5.2.0

### Minor Changes

- ad07297: Minor update of ledger libs

## 5.1.1

### Patch Changes

- Wagmi version updated
  - @reef-knot/wallets-list@2.0.1

## 5.1.0

### Minor Changes

- Remove WC warning banner

## 5.0.2

### Patch Changes

- Wallets modal metrics fixed

## 5.0.1

### Patch Changes

- Connect buttons type attribute fixed

## 5.0.0

### Major Changes

- Wagmi version updated and corresponding changes applied

### Patch Changes

- Updated dependencies
  - @reef-knot/ledger-connector@4.0.0
  - @reef-knot/wallets-helpers@2.0.0
  - @reef-knot/wallets-list@2.0.0
  - @reef-knot/core-react@4.0.0
  - @reef-knot/web3-react@4.0.0
  - @reef-knot/ui-react@2.0.0
  - @reef-knot/types@2.0.0

## 4.2.0

### Minor Changes

- a6ca608: Add deeplinks support

### Patch Changes

- @reef-knot/wallets-list@1.13.3

## 4.1.2

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- connect wallet modal safari styles fixed

## 4.1.0

### Minor Changes

- Make it possible for wallet detectors to be async;
- Improve Safe wallet detection;

### Patch Changes

- @reef-knot/wallets-list@1.13.1

## 4.0.0

### Major Changes

- connect-wallet-modal ui and config updated

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-list@1.13.0

## 3.0.2

### Patch Changes

- 8873ffb: fixed leger modal not closing main modal

## 3.0.1

### Patch Changes

- fix Connect wallet button in EagerConnectModal

## 3.0.0

### Major Changes

- Rework modals interface, add useConnect hook for connection

### Patch Changes

- Updated dependencies
  - @reef-knot/core-react@3.0.0
  - @reef-knot/web3-react@3.0.0

## 2.1.0

### Minor Changes

- 85b3f79:
  - rework getUnsupportedChainError, hide mumbai network in the error
  - (web3-react) fix logic of useConnectorError
  - (web3-react) deprecate useConnectorInfo, useDisconnect
  - (core-react) rework and add hooks: useConnectorInfo, useDisconnect, useEagerConnect
  - (reef-knot) add connectors export as "Connectors"

## 2.0.0

### Minor Changes

- 1046886: Support autoConnectOnly wallet adapters

### Patch Changes

- Updated dependencies [1046886]
  - @reef-knot/ledger-connector@3.0.0
  - @reef-knot/core-react@2.0.0
  - @reef-knot/web3-react@2.0.0

## 1.17.1

### Patch Changes

- Update ledgerhq packages

## 1.17.0

### Minor Changes

- 253796d: Use MetaMask and generic browser extension wallet adapters. Do some refactoring.

## 1.16.0

### Minor Changes

- Use Ledger hid wallet adapter, based on wagmi

## 1.15.0

### Minor Changes

- lido-ui version as peer dependency

## 1.14.0

### Minor Changes

- lido-ui and react versions updated

## 1.13.0

### Minor Changes

- Rework Coinbase to use Wallet Adapter

## 1.12.0

### Minor Changes

- Rework XDEFI, Trust, imToken to use Wallet Adapters and wagmi

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
