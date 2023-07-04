# Ledger connectors

## Ledger webhid connector

Connector for [web3-react](https://github.com/NoahZinsmeister/web3-react) based on `@ledgerhq/hw-transport-webhid`

## Arguments

```ts
new LedgerHQConnector({
  chainId: number;
  url: string;
});
```

## Example

```ts
import { LedgerHQConnector } from '@reef-knot/ledger-connector';

const LedgerHQFrame = new LedgerHQConnector({
  chainId: 1,
  url: 'https://your.rpc/endpoint',
});
```

## Ledger iframe connector

Connector for [web3-react](https://github.com/NoahZinsmeister/web3-react) based on `@ledgerhq/iframe-provider`

## Arguments

Connector has the same arguments as [IFrameEthereumProvider](https://github.com/LedgerHQ/iframe-provider#usage) as well an optional
`supportedChainIds` to support testnets, defaults to Ethereum Mainnet only.

```ts
new LedgerHQFrameConnector({
  targetOrigin?: string;
  timeoutMilliseconds?: number;
  supportedChainIds?: number[];
});
```

## Example

```ts
import { LedgerHQFrameConnector } from '@reef-knot/ledger-connector';

const LedgerHQFrame = new LedgerHQFrameConnector();
```

