# Reef Knot

The main Reef Knot package contains the wallet connection core, React providers
and hooks, wallet picker UI, configuration types, and the default Ethereum
wallet catalog.

Application code should import all public APIs from `reef-knot`:

```ts
import {
  ReefKnotProvider,
  ReefKnotWalletsModal,
  WalletsListEthereum,
  getDefaultConfig,
} from 'reef-knot';
```

Wallet adapters and the Ledger connector remain separate packages so they can
be built, tested, and released independently. Shared adapter types and helpers
live in `@reef-knot/wallets-helpers`.
