# Reef Knot

The main Reef Knot package contains the wallet connection core, React providers
and headless hooks, configuration types, and the default Ethereum
wallet catalog.

Import the public core APIs from `reef-knot` and the ready-made wallet modal
from your chosen UI skin:

```ts
import {
  ReefKnotProvider,
  WalletsListEthereum,
  getDefaultConfig,
} from 'reef-knot';
import { ReefKnotWalletsModal } from '@reef-knot/ui-lido';
```

Use `@reef-knot/ui-lido-legacy` instead for the legacy appearance, or build
your own UI with the headless hooks. See [the headless UI guide](../../docs/headless-ui.md)
for setup and customization.

Wallet adapters and the Ledger connector remain separate packages so they can
be built, tested, and released independently. Shared adapter types and helpers
live in `@reef-knot/wallets-helpers`.
