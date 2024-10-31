# @reef-knot/ledger-connector

## 4.1.4

### Patch Changes

- accbcde: viem and wagmi versions updated with flexible declarations

## 4.1.3

### Patch Changes

- 3bfcb7c: Fix Ledger reconnection: after explicit disconnect and after page reloading

## 4.1.2

### Patch Changes

- Fix: onAccountsChanged, onChainChanged methods for ledgerLiveConnector

## 4.1.1

### Patch Changes

- Fix: wrap IFrameEthereumProvider in LedgerIFrameProvider with the "request" method, which is required for useWalletClient wagmi hook

## 4.1.0

### Minor Changes

- ad07297: Minor update of ledger libs

## 4.0.1

### Patch Changes

- Wagmi version updated

## 4.0.0

### Major Changes

- Wagmi version updated and corresponding changes applied

## 3.0.0

### Major Changes

- 1046886: Rework: use wagmi for Ledger Live connector instead of web3-react

## 2.0.1

### Patch Changes

- Fix getProvider in LedgerHIDConnector; update ledgerhq packages;

## 2.0.0

### Major Changes

- Rework: use wagmi for hid connector instead of web3-react

## 1.1.1

### Patch Changes

- Update ledgerhq/hw-app-eth. Needed to bump `crypto-js` to 4.2.0 to fix dependabot security alert.

## 1.1.0

### Minor Changes

- Rework direct Ledger hardware connection UI

## 1.0.1

### Patch Changes

- Fix ledgerService import

## 1.0.0

### Major Changes

- Move ledger connectors to reef-knot
