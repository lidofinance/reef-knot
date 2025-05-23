# reef-knot

## 7.3.0

### Minor Changes

- Adds ability to pass onAutoConnect and onReconnect callbacks to the reef-knot config
- Minor fixes and tech updates

## 7.2.0

### Minor Changes

- Update viem to v2.23 and wagmi to v2.14, so the @coinbase/wallet-sdk would be updated too, which fixes a dependabot issue

### Patch Changes

- Updated dependencies
  - @reef-knot/ledger-connector@4.3.0
  - @reef-knot/connect-wallet-modal@7.2.0
  - @reef-knot/wallets-helpers@2.2.0
  - @reef-knot/core-react@6.1.0
  - @reef-knot/web3-react@6.1.0
  - @reef-knot/ui-react@2.2.0
  - @reef-knot/types@4.1.0
  - @reef-knot/wallets-list@4.1.2

## 7.1.1

### Patch Changes

- @reef-knot/wallets-list@4.1.1

## 7.1.0

### Minor Changes

- Add Ctrl wallet, rm XDEFI wallet (rebranded into Ctrl)

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@7.1.0
  - @reef-knot/wallets-list@4.1.0

## 7.0.1

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@7.0.1

## 7.0.0

### Major Changes

- Metrics config refactored, replaced with certain actions callbacks

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@7.0.0
  - @reef-knot/core-react@6.0.0
  - @reef-knot/types@4.0.0
  - @reef-knot/web3-react@6.0.0
  - @reef-knot/wallets-list@4.0.0

## 6.0.4

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@6.0.2

## 6.0.3

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@6.0.1

## 6.0.2

### Patch Changes

- Updated dependencies
  - @reef-knot/ledger-connector@4.2.0

## 6.0.1

### Patch Changes

- Updated dependencies
  - @reef-knot/core-react@5.1.0

## 6.0.0

### Major Changes

- reef-knot setup reworked

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@6.0.0
  - @reef-knot/core-react@5.0.0
  - @reef-knot/types@3.0.0
  - @reef-knot/web3-react@5.0.0
  - @reef-knot/wallets-list@3.0.0

## 5.7.6

### Patch Changes

- accbcde: viem and wagmi versions updated with flexible declarations
- Updated dependencies [accbcde]
  - @reef-knot/ledger-connector@4.1.4
  - @reef-knot/connect-wallet-modal@5.5.4
  - @reef-knot/wallets-helpers@2.1.1
  - @reef-knot/core-react@4.3.1
  - @reef-knot/web3-react@4.0.2
  - @reef-knot/ui-react@2.1.5
  - @reef-knot/types@2.1.1
  - @reef-knot/wallets-list@2.3.1

## 5.7.5

### Patch Changes

- Hotfix: wallets metrics in WalletsModal
- Updated dependencies
  - @reef-knot/connect-wallet-modal@5.5.3

## 5.7.4

### Patch Changes

- Updated dependencies [3bfcb7c]
  - @reef-knot/connect-wallet-modal@5.5.2
  - @reef-knot/ledger-connector@4.1.3

## 5.7.3

### Patch Changes

- Fix the issue with paused loading animation for ConnectButtonLoader
- Updated dependencies
  - @reef-knot/connect-wallet-modal@5.5.1

## 5.7.2

### Patch Changes

- Fix: onAccountsChanged, onChainChanged methods for ledgerLiveConnector
- Updated dependencies
  - @reef-knot/ledger-connector@4.1.2

## 5.7.1

### Patch Changes

- Fix: wrap IFrameEthereumProvider in LedgerIFrameProvider with the "request" method, which is required for useWalletClient wagmi hook
- Updated dependencies
  - @reef-knot/ledger-connector@4.1.1

## 5.7.0

### Minor Changes

- Add the "loading" state for WC and Binance wallet connection buttons;
- Fix the "retry" button for some cases in the Ledger HID connection modal;
- Show a loading spinner in the Ledger modal during ledger packages loading;
- Fix the issue with passing onClickWalletsLess, onClickWalletsMore props;

### Patch Changes

- Updated dependencies [44073ff]
  - @reef-knot/connect-wallet-modal@5.5.0
  - @reef-knot/core-react@4.3.0

## 5.6.1

### Patch Changes

- 357e61f: Fix padding in ModalSubtitleStyle
- Updated dependencies [357e61f]
  - @reef-knot/ui-react@2.1.4

## 5.6.0

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@5.4.0
  - @reef-knot/wallets-list@2.3.0

## 5.5.4

### Patch Changes

- Fix the issue with multiple clicks on ConnectBinance button
- Updated dependencies
  - @reef-knot/connect-wallet-modal@5.3.3

## 5.5.3

### Patch Changes

- @reef-knot/wallets-list@2.2.3

## 5.5.2

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @reef-knot/connect-wallet-modal@5.3.2
  - @reef-knot/wallets-list@2.2.2

## 5.5.1

### Patch Changes

- Binance wallet: move up in the wallets display order, add deeplink, add detector fn
- Updated dependencies
  - @reef-knot/connect-wallet-modal@5.3.1
  - @reef-knot/wallets-list@2.2.1
  - @reef-knot/core-react@4.2.1

## 5.5.0

### Minor Changes

- Add Binance Web3 Wallet

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@5.3.0
  - @reef-knot/wallets-list@2.2.0

## 5.4.0

### Minor Changes

- Support EIP-6963

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-helpers@2.1.0
  - @reef-knot/core-react@4.2.0
  - @reef-knot/types@2.1.0
  - @reef-knot/wallets-list@2.0.2

## 5.3.1

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-helpers@2.0.2
  - @reef-knot/ui-react@2.1.3

## 5.3.0

### Minor Changes

- Add peer dependencies from subpackages to reef-knot root package

## 5.2.3

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@5.2.2

## 5.2.2

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@5.2.1

## 5.2.1

### Patch Changes

- Updated dependencies
  - @reef-knot/ui-react@2.1.2

## 5.2.0

### Minor Changes

- ad07297: Minor update of ledger libs

### Patch Changes

- Updated dependencies [ad07297]
  - @reef-knot/ledger-connector@4.1.0
  - @reef-knot/connect-wallet-modal@5.2.0

## 5.1.1

### Patch Changes

- Updated dependencies
  - @reef-knot/ledger-connector@4.0.1
  - @reef-knot/connect-wallet-modal@5.1.1
  - @reef-knot/wallets-helpers@2.0.1
  - @reef-knot/core-react@4.1.1
  - @reef-knot/web3-react@4.0.1
  - @reef-knot/ui-react@2.1.1
  - @reef-knot/types@2.0.1
  - @reef-knot/wallets-list@2.0.1

## 5.1.0

### Minor Changes

- Remove WC warning banner

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@5.1.0
  - @reef-knot/core-react@4.1.0
  - @reef-knot/ui-react@2.1.0

## 5.0.3

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@5.0.2

## 5.0.2

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@5.0.1

## 5.0.1

### Patch Changes

- Updated dependencies
  - @reef-knot/core-react@4.0.1

## 5.0.0

### Major Changes

- Updated dependencies
  - @reef-knot/ledger-connector@4.0.0
  - @reef-knot/connect-wallet-modal@5.0.0
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

- Updated dependencies [a6ca608]
  - @reef-knot/connect-wallet-modal@4.2.0
  - @reef-knot/core-react@3.2.0
  - @reef-knot/types@1.8.0
  - @reef-knot/wallets-list@1.13.3

## 4.1.3

### Patch Changes

- @reef-knot/wallets-list@1.13.2

## 4.1.2

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@4.1.2
  - @reef-knot/wallets-helpers@1.1.6
  - @reef-knot/core-react@3.1.2
  - @reef-knot/web3-react@3.0.1

## 4.1.1

### Patch Changes

- 92be1c7: Fix "checkIfDisconnectMakesSense"
- Updated dependencies
  - @reef-knot/core-react@3.1.1
  - @reef-knot/connect-wallet-modal@4.1.1

## 4.1.0

### Minor Changes

- Make it possible for wallet detectors to be async;
- Improve Safe wallet detection;

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@4.1.0
  - @reef-knot/core-react@3.1.0
  - @reef-knot/types@1.7.0
  - @reef-knot/wallets-list@1.13.1

## 4.0.0

### Major Changes

- connect-wallet-modal ui and config updated

### Minor Changes

- wallet connectors id exports and typings updated

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @reef-knot/wallets-list@1.13.0
  - @reef-knot/types@1.6.0
  - @reef-knot/connect-wallet-modal@4.0.0
  - @reef-knot/ui-react@1.1.0

## 3.0.2

### Patch Changes

- Updated dependencies [8873ffb]
  - @reef-knot/connect-wallet-modal@3.0.2

## 3.0.1

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@3.0.1

## 3.0.0

### Major Changes

- Rework modals interface, add useConnect hook for connection

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@3.0.0
  - @reef-knot/core-react@3.0.0
  - @reef-knot/web3-react@3.0.0

## 2.1.1

### Patch Changes

- Updated dependencies
  - @reef-knot/core-react@2.1.1

## 2.1.0

### Minor Changes

- 85b3f79:
  - rework getUnsupportedChainError, hide mumbai network in the error
  - (web3-react) fix logic of useConnectorError
  - (web3-react) deprecate useConnectorInfo, useDisconnect
  - (core-react) rework and add hooks: useConnectorInfo, useDisconnect, useEagerConnect
  - (reef-knot) add connectors export as "Connectors"

### Patch Changes

- Updated dependencies [85b3f79]
  - @reef-knot/connect-wallet-modal@2.1.0
  - @reef-knot/core-react@2.1.0
  - @reef-knot/web3-react@2.1.0

## 2.0.0

### Patch Changes

- Updated dependencies [1046886]
  - @reef-knot/ledger-connector@3.0.0
  - @reef-knot/core-react@2.0.0
  - @reef-knot/web3-react@2.0.0
  - @reef-knot/connect-wallet-modal@2.0.0
  - @reef-knot/wallets-list@1.12.0
  - @reef-knot/types@1.5.0

## 1.15.3

### Patch Changes

- Updated dependencies
  - @reef-knot/ledger-connector@2.0.1
  - @reef-knot/connect-wallet-modal@1.17.1

## 1.15.2

### Patch Changes

- Updated dependencies
  - @reef-knot/web3-react@1.13.1

## 1.15.1

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-list@1.11.1

## 1.14.1

### Patch Changes

- Updated dependencies [253796d]
  - @reef-knot/wallets-list@1.11.0
  - @reef-knot/web3-react@1.13.0
  - @reef-knot/core-react@1.8.1
  - @reef-knot/ui-react@1.0.8
  - @reef-knot/connect-wallet-modal@1.17.0

## 1.14.0

### Patch Changes

- Updated dependencies
  - @reef-knot/ledger-connector@2.0.0
  - @reef-knot/connect-wallet-modal@1.16.0
  - @reef-knot/wallets-list@1.10.0
  - @reef-knot/core-react@1.8.0
  - @reef-knot/web3-react@1.12.0
  - @reef-knot/types@1.4.0

## 1.13.2

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.15.0

## 1.13.1

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.14.0

## 1.13.0

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.13.0
  - @reef-knot/wallets-list@1.9.0
  - @reef-knot/wallets-icons@1.5.0
  - @reef-knot/web3-react@1.11.0

## 1.12.0

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.12.0
  - @reef-knot/wallets-list@1.8.0
  - @reef-knot/web3-react@1.10.0
  - @reef-knot/wallets-icons@1.4.0

## 1.11.2

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.11.1
  - @reef-knot/wallets-list@1.7.1

## 1.11.1

### Patch Changes

- Updated dependencies
  - @reef-knot/web3-react@1.9.1

## 1.10.7

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @reef-knot/wallets-list@1.7.0
  - @reef-knot/connect-wallet-modal@1.11.0
  - @reef-knot/wallets-icons@1.3.0
  - @reef-knot/web3-react@1.9.0

## 1.10.6

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.10.0
  - @reef-knot/core-react@1.7.0
  - @reef-knot/web3-react@1.8.0

## 1.10.5

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.9.0
  - @reef-knot/wallets-icons@1.2.0
  - @reef-knot/web3-react@1.7.0
  - @reef-knot/wallets-list@1.6.0

## 1.10.4

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.8.3
  - @reef-knot/web3-react@1.6.1

## 1.10.3

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.8.2

## 1.10.2

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.8.1
  - @reef-knot/wallets-icons@1.1.0

## 1.10.1

### Patch Changes

- Updated dependencies
  - @reef-knot/ledger-connector@1.1.1

## 1.10.0

### Patch Changes

- Updated dependencies
  - @reef-knot/ledger-connector@1.1.0
  - @reef-knot/connect-wallet-modal@1.8.0
  - @reef-knot/web3-react@1.6.0

## 1.9.0

### Patch Changes

- Updated dependencies [e2074ed]
  - @reef-knot/connect-wallet-modal@1.7.0
  - @reef-knot/wallets-list@1.5.0

## 1.8.0

### Patch Changes

- Updated dependencies
  - @reef-knot/web3-react@1.5.0

## 1.7.4

### Patch Changes

- @reef-knot/wallets-list@1.4.5

## 1.7.3

### Patch Changes

- Updated dependencies
  - @reef-knot/core-react@1.6.0

## 1.7.2

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.6.2
  - @reef-knot/web3-react@1.4.2

## 1.7.1

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @reef-knot/web3-react@1.4.1
  - @reef-knot/connect-wallet-modal@1.6.1
  - @reef-knot/core-react@1.5.1

## 1.6.2

### Patch Changes

- Updated dependencies [e654dc5]
- Updated dependencies [48d8c4b]
- Updated dependencies [217c144]
  - @reef-knot/connect-wallet-modal@1.6.0
  - @reef-knot/types@1.3.0
  - @reef-knot/wallets-helpers@1.1.5
  - @reef-knot/core-react@1.5.0
  - @reef-knot/web3-react@1.4.0
  - @reef-knot/ui-react@1.0.7
  - @reef-knot/wallets-list@1.4.4

## 1.6.1

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-helpers@1.1.4

## 1.6.0

### Patch Changes

- Updated dependencies [e6e579e]
  - @reef-knot/connect-wallet-modal@1.5.1
  - @reef-knot/wallets-helpers@1.1.3
  - @reef-knot/core-react@1.4.3
  - @reef-knot/web3-react@1.3.1
  - @reef-knot/ui-react@1.0.6
  - @reef-knot/types@1.2.2
  - @reef-knot/wallets-list@1.4.3

## 1.5.2

### Patch Changes

- Updated dependencies
  - @reef-knot/ledger-connector@1.0.1

## 1.5.1

### Patch Changes

- Add `reef-knot/connectors` path

## 1.5.0

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @reef-knot/web3-react@1.3.0
  - @reef-knot/ledger-connector@1.0.0
  - @reef-knot/connect-wallet-modal@1.5.0

## 1.4.5

### Patch Changes

- Updated dependencies
  - @reef-knot/ui-react@1.0.5

## 1.4.4

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.4.3
  - @reef-knot/core-react@1.4.2
  - @reef-knot/ui-react@1.0.4

## 1.4.3

### Patch Changes

- Updated dependencies
  - @reef-knot/web3-react@1.2.2

## 1.4.2

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.4.2
  - @reef-knot/wallets-helpers@1.1.2
  - @reef-knot/wallets-list@1.4.2

## 1.4.1

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.4.1
  - @reef-knot/core-react@1.4.1
  - @reef-knot/types@1.2.1
  - @reef-knot/wallets-helpers@1.1.1
  - @reef-knot/web3-react@1.2.1
  - @reef-knot/wallets-list@1.4.1

## 1.4.0

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.4.0
  - @reef-knot/core-react@1.4.0
  - @reef-knot/types@1.2.0
  - @reef-knot/wallets-helpers@1.1.0
  - @reef-knot/web3-react@1.2.0
  - @reef-knot/wallets-list@1.4.0

## 1.3.3

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-helpers@1.0.2

## 1.3.2

### Patch Changes

- Fix: add @reef-knot/wallets-helpers dependency

## 1.3.1

### Patch Changes

- Updated dependencies
  - @reef-knot/types@1.1.1
  - @reef-knot/core-react@1.3.1
  - @reef-knot/web3-react@1.1.1
  - @reef-knot/connect-wallet-modal@1.3.1
  - @reef-knot/wallets-list@1.3.1

## 1.3.0

### Patch Changes

- Updated dependencies [faa8815]

## 1.2.0

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-list@1.2.0
  - @reef-knot/core-react@1.2.0
  - @reef-knot/connect-wallet-modal@1.2.0

## 1.1.3

### Patch Changes

- Updated dependencies
  - @reef-knot/core-react@1.1.1

## 1.1.2

### Patch Changes

- Updated dependencies [9da75b6]
  - @reef-knot/web3-react@1.0.7

## 1.1.1

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.1.1

## 1.1.0

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.1.0
  - @reef-knot/wallets-list@1.1.0
  - @reef-knot/core-react@1.1.0

## 1.0.9

### Patch Changes

- Updated dependencies
  - @reef-knot/web3-react@1.0.6
  - @reef-knot/connect-wallet-modal@1.0.8

## 1.0.8

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.0.7
  - @reef-knot/ui-react@1.0.3

## 1.0.7

### Patch Changes

- Updated dependencies
  - @reef-knot/wallets-list@1.0.2
  - @reef-knot/connect-wallet-modal@1.0.6
  - @reef-knot/web3-react@1.0.5

## 1.0.6

### Patch Changes

- Updated dependencies
  - @reef-knot/core-react@1.0.1
  - @reef-knot/wallets-list@1.0.1
  - @reef-knot/web3-react@1.0.4
  - @reef-knot/ui-react@1.0.2
  - @reef-knot/connect-wallet-modal@1.0.5

## 1.0.5

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.0.4
  - @reef-knot/web3-react@1.0.3

## 1.0.4

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.0.3

## 1.0.3

### Patch Changes

- Set typescript compilerOptions.jsx = "react"
- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.0.2
  - @reef-knot/ui-react@1.0.1
  - @reef-knot/web3-react@1.0.2

## 1.0.2

### Patch Changes

- Updated dependencies
  - @reef-knot/web3-react@1.0.1

## 1.0.1

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@1.0.1

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
  - @reef-knot/connect-wallet-modal@1.0.0
  - @reef-knot/web3-react@1.0.0
  - @reef-knot/core-react@1.0.0
  - @reef-knot/ui-react@1.0.0
  - @reef-knot/wallets-icons@1.0.0
  - @reef-knot/wallets-list@1.0.0

## 0.5.2

### Patch Changes

- Fix scrollbar padding and margin
- Support dark color theme
- Updated dependencies
  - @reef-knot/connect-wallet-modal@0.5.2
  - ua-parser-js@1.0.33

## 0.5.1

### Patch Changes

- Improve the modal's scrollbar
- Updated dependencies
  - @reef-knot/connect-wallet-modal@0.5.1

## 0.5.0

### Minor Changes

- Improve the modal's styles, rework scroll behavior

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@0.5.0
  - @reef-knot/ui-react@0.2.0

## 0.4.1

### Patch Changes

- Add Zerion wallet detection
- Updated dependencies
  - @reef-knot/web3-react@0.3.0

## 0.4.0

### Minor Changes

- Add Zerion wallet

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@0.4.0
  - @reef-knot/wallets-icons@0.2.0

## 0.3.0

### Minor Changes

- Add Metrics Events for clicks on wallets connection buttons

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@0.3.0

## 0.2.0

### Minor Changes

- Add Metrics Events support

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@0.2.0
  - @reef-knot/web3-react@0.2.0

## 0.1.2

### Patch Changes

- Fix subpackages versions in dependencies

## 0.1.1

### Patch Changes

- Add explanation for Ledger direct connection error
- Updated dependencies
  - @reef-knot/connect-wallet-modal@0.1.1

## 0.1.0

### Minor Changes

- Support Trust Wallet browser extension

### Patch Changes

- Updated dependencies
  - @reef-knot/connect-wallet-modal@0.1.0
  - @reef-knot/web3-react@0.1.0
