# Ledger Wallet Provider spike

Spike date: 2026-10-18. Goal: see how Ledger Wallet Provider (LWP) fits into
reef-knot and the demo app before we decide how to replace LedgerJS.

## What was added

- `packages/wallets/ledger-wallet-provider`: a new wallet adapter (private, not published).
  - `initLedgerWalletProvider()` lazily loads LWP and its EVM family and mounts Ledger's UI.
  - The `LedgerWalletProvider` adapter finds LWP through EIP-6963
    (`rdns: com.ledger.wallet.provider`, name "Ledger Wallet") and connects with
    wagmi's `injected` connector.
- `@reef-knot/wallets-list`: the adapter is in `WalletsListEthereum`, and
  `initLedgerWalletProvider` is re-exported (`reef-knot/wallets`).
- `apps/demo-react`:
  - `providers/ledger-wallet-provider.tsx` calls the init on mount.
  - Three env vars (see `.env.example`).
  - Webpack aliases in `next.config.js` (see "Packaging bug" below).
  - `walletsShown` adds `ledgerWalletProvider` right after `ledgerHID`, so
    "Ledger Wallet" shows next to "Ledger" in the modal. The library defaults
    are unchanged.
- The existing Ledger HID and Ledger Live adapters are untouched, so both flows
  can be compared side by side.

Dependencies, both runtime and pinned exactly:
`@ledgerhq/ledger-wallet-provider@2.0.2` and `@ledgerhq/ledger-wallet-provider-evm@1.0.1`.
Install scripts stay disabled (`enableScripts: false`).

## How to run

1. Get a trial API key at https://dashboard.ledger.com (it's for companies;
   individuals must contact Ledger). The dApp identifier must be registered
   by Ledger; see "dApp identifier" below. For a local test, `ledger` works
   with a trial key.
2. Put them in `apps/demo-react/.env.local`:
   ```
   LEDGER_WALLET_PROVIDER_API_KEY=...
   LEDGER_WALLET_PROVIDER_DAPP_ID=...
   LEDGER_WALLET_PROVIDER_ENVIRONMENT=trial
   ```
3. Run `yarn build-packages`, then `yarn workspace demo-react dev -p 3010`.
4. Use a desktop Chrome or Edge with a Ledger plugged in. LWP has no mobile support.

Without the key and the dApp identifier, the init is skipped on purpose (see
"No key" below). The demo still works with the other wallets.

## Findings

### Packaging bug in LWP

- All three packages list the `default` export condition before `import`.
- Webpack 5 (Next 12) fails with "Default condition should be last one".
- The demo works around it with `resolve.alias` entries that point at the
  `dist` files. Every app that uses webpack would need the same workaround
  until Ledger fixes it. Report it to Ledger.

### No key

- If `apiKey` is empty, LWP falls back to an origin token hard-coded in
  `@ledgerhq/ledger-wallet-provider-core` (`Kn` in `dist/index.js`).
- Ledger's legal notice forbids using their backend without a written
  agreement. So our init refuses to run without our own key, instead of
  silently using theirs.

### dApp identifier

- On start, LWP calls `GET https://ledgerb.api.ledger.com/v2/config?dAppIdentifier=<id>`.
  If that fails, it mounts nothing: no button, no EIP-6963 announce.
- With a trial key and our own name (`reef-knot-demo`), Ledger answered
  `400 Not found`. So the identifier must be registered on Ledger's side; the
  trial key doesn't create one.
- Ledger's own test dapp (`ledger-button-public/apps/test-dapp`) uses `ledger`
  as the identifier, including in trial mode.
- With the trial key and `ledger` (local spike only), the config loads, the UI
  mounts and the provider is announced via EIP-6963. Lido needs its own
  registered identifier for anything beyond this local test.

### One instance per page

- `initializeLedgerProvider` refuses to mount a second `<ledger-button-app>`.
- React strict mode runs effects twice, and the first cleanup then removed
  the only instance. The result was no UI, while the EIP-6963 announce stayed.
- `initLedgerWalletProvider` now shares one instance between callers and
  removes it only when the last caller releases it.

### What happens on page load (trial key, `ledger` id)

- Requests before any user action: `ledgerb.api.ledger.com/v2/config`,
  `countervalues.live.ledger.com/v3/supported/fiat/detailed`, and Google Fonts.
- The floating button renders nothing until an account is connected.
- `eth_requestAccounts` opens Ledger's "Welcome to Ledger Wallet" screen. Its
  "Continue" button means consent to Ledger's Terms and Privacy Policy. That's
  a second consent step on top of reef-knot's own terms checkbox.

### All RPC traffic goes through Ledger

- Reads such as `eth_call`, `eth_estimateGas`, `eth_getBalance` and
  `eth_blockNumber` are forwarded to Ledger, and so are broadcasts:
  `POST https://ledgerb.api.ledger.com/broadcast`.
- The reef-knot `rpc` config is not used for anything LWP does itself.
- There's no documented option to use our own node.

### Other Ledger servers LWP calls

- `ledgerb.api.ledger.com` (`/v2/config`, `/broadcast`, `/event` for tracking)
- `connect.api.prd.ledger.com` (CAL and Transaction Checks in trial mode)
- `crypto-assets-service.api.ledger.com`
- `coin-service.api.ledger.com`
- `explorers.api.live.ledger.com`
- `countervalues.live.ledger.com`
- `mapping-service.api.ledger.com`
- `cloud-sync-backend.api.aws.prd.ldg-tech.com` (Ledger Sync / Keyring Protocol)
- Google Fonts: it injects a `<link>` to `fonts.googleapis.com` (Inter).
  This matters for CSP and privacy.

### Chains

- Built-in EVM list: Ethereum, Arbitrum, Avalanche C, Base, BSC, Linea,
  Optimism, Polygon, Sonic, zkSync, Gnosis, Arc.
- No testnets (no Hoodi, Holesky or Sepolia), so the demo's test chains can't
  be used with LWP.
- What's actually enabled also depends on the partner config tied to the
  `dAppIdentifier`.

### UI

- It mounts a `<ledger-button-app>` custom element plus a floating Ledger
  button (can be hidden), and has its own connect modal and side panel.
- Its CSS is scoped to `.ledger-wallet-provider`, so it doesn't reset the
  host page's styles.
- reef-knot's modal only shows a button that hands off to Ledger's UI.
  Account selection and derivation paths are Ledger's.

### Bundle size

Minified ESM measured with esbuild; gzip is approximate.

|                                                         | min      | gzip     |
| ------------------------------------------------------- | -------- | -------- |
| LWP (`ledger-wallet-provider` + `-evm`)                 | ~4.7 MB  | ~1.5 MB  |
| Current LedgerJS (`hw-app-eth` + `hw-transport-webhid`) | ~0.37 MB | ~0.12 MB |

Largest parts of the LWP bundle:

- the UI package: ~2 MB
- ethers v6: ~0.5 MB
- zod: ~0.4 MB
- lottie-web: ~0.3 MB
- the DMK packages

It's only loaded through a dynamic `import()`, so the main bundle is not affected.

### Dependency footprint

- `yarn.lock` grows by about 1,100 lines.
- New transitive deps include `@ledgerhq/coin-framework`, `@reduxjs/toolkit`,
  Ledger Live config/env packages, `@sentry/minimal`, `lit`, `motion` and `lottie-web`.
- There are two nested copies of ethers 6.17.0 and of inversify.
- Exact peer requirement: `rxjs@7.8.2`.
- `-evm@1.0.1` expects `-core@2.0.1`, but `2.0.2` gets installed.

## Manual check (needs a device)

Not done in this spike. Use desktop Chrome with DevTools → Network open, and
set the demo to Ethereum mainnet (LWP has no testnets).

1. Connect through the reef-knot modal ("Ledger Wallet"), not by calling the
   provider directly. Does reef-knot pick up the account and chain?
2. Account choice: which derivation paths are offered? Can you pick the same
   account you use with the "Ledger" (HID) button?
3. Signing: `personal_sign`, EIP-712 (Permit request), and a Stake or Wrap
   transaction with a small amount.
   - Does the device clear sign Lido calls, or warn about blind signing?
   - Do Transaction Checks show up?
4. Network: note every request to `*.ledger.com` and `*.ldg-tech.com`.
   - What do `/event` and `/broadcast` send?
   - Do reads hit Ledger or our RPC?
5. Reload the page: does reef-knot auto-connect without a prompt?
6. Switch chains from the demo, unplug the device, and press Disconnect in
   reef-knot. Does the state stay in sync between reef-knot and Ledger's UI?
7. UI: how the floating button and side panel look next to the Lido UI, in
   light and dark theme.
