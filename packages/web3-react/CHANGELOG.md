# @reef-knot/web3-react

## 6.0.0

### Patch Changes

- Updated dependencies
  - @reef-knot/core-react@6.0.0

## 5.0.0

### Patch Changes

- Updated dependencies
  - @reef-knot/core-react@5.0.0

## 4.0.2

### Patch Changes

- accbcde: viem and wagmi versions updated with flexible declarations

## 4.0.1

### Patch Changes

- Wagmi version updated

## 4.0.0

### Major Changes

- Wagmi version updated and corresponding changes applied

### Patch Changes

- Updated dependencies
  - @reef-knot/ledger-connector@4.0.0
  - @reef-knot/wallets-helpers@2.0.0
  - @reef-knot/core-react@4.0.0

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies
  - @reef-knot/core-react@3.0.0

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

- 1046886: Remove legacy code, based on lido-sdk and web3-react

### Patch Changes

- Updated dependencies [1046886]
  - @reef-knot/ledger-connector@3.0.0
  - @reef-knot/core-react@2.0.0

## 1.13.1

### Patch Changes

- fix: return isLedger to useConnectorInfo

## 1.13.0

### Minor Changes

- 253796d: Remove unused MetaMask-related code

## 1.12.0

### Minor Changes

- Use Ledger hid wallet adapter, based on wagmi

### Patch Changes

- Updated dependencies
  - @reef-knot/ledger-connector@2.0.0

## 1.11.0

### Minor Changes

- Remove Coinbase related code

## 1.10.0

### Minor Changes

- Remove XDEFI, Trust, imToken related code

## 1.9.1

### Patch Changes

- Fix an issue with the terms modal not closing until page restart.

## 1.9.0

### Minor Changes

- Remove MathWallet related code

## 1.8.0

### Minor Changes

- Add holesky to wagmiChainsArray, handle connection errors in AcceptTermsModal

## 1.7.0

### Minor Changes

- Remove Brave, Coin98, Opera, Gamestop wallets unneeded legacy code

## 1.6.1

### Patch Changes

- Add workaround: await timeout before ledger connector "activate"

## 1.6.0

### Minor Changes

- Rework direct Ledger hardware connection UI

## 1.5.0

### Minor Changes

- Update lido-js-sdk deps and move them to peer deps

## 1.4.2

### Patch Changes

- fix: connection rejection logic during mobile browser autoconnect

## 1.4.1

### Patch Changes

- Open Terms modal only if terms were not accepted earlier

## 1.4.0

### Minor Changes

- 217c144: Show "Accept Terms" Modal for Ledger Live, Safe, dapp browsers

### Patch Changes

- 48d8c4b: Update wagmi to 0.12.19

## 1.3.1

### Patch Changes

- e6e579e: wagmi 0.12.18
- e6e579e: Update lido-sdk packages

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
