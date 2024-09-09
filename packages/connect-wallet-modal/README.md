# Connect Wallet Modal

Provides a modal window with buttons for connection with various crypto wallets.

Import the basic ReefKnotWalletsModal component, default config getter, and the union type of connector identifiers:
```ts
import { ReefKnotWalletsModal, getDefaultWalletsModalConfig } from '@reef-knot/connect-wallet-modal'
import type { WalletIdsEthereum } from '@reef-knot/wallets-list';
```

Use it like this:
```tsx
const WALLETS_MODAL_DEFAULT_CONFIG = getDefaultWalletsModalConfig();

<ReefKnotWalletsModal<WalletIdsEthereum>
  {...WALLETS_MODAL_DEFAULT_CONFIG}
  darkThemeEnabled={false}
  walletsShown={[
    'metaMask',
    'walletconnect',
    'brave',
    'dappBrowserInjected',
  ]}
  walletsPinned={['dappBrowserInjected']}
/>
```

> **Note:** The `WalletIdsEthereum` type being passed as a generic to the component will affect to type safity constrain of `walletsShown`, `walletsPinned` and `metrics` props.

#### Props configuration list

| Prop | Description |
|------|-------------|
| `buttonComponentsByConnectorId?` | A map of `ConnectButton`s associated with a certain connector id or type. |
| `darkThemeEnabled?` | Set to true for the dark color theme. <br /> ***Default**: `false`* |
| `buttonsFullWidth?` | Specify connector buttons to render one per row. It could be handy if you are planning to use only few wallets in your dapp. |
| `walletsShown` | Controls displayed wallet connection buttons from the list of wallets in the modal. Wallets will be displayed in the specified sequence. <br /> ***Default**: Get with `getDefaultWalletsModalConfig()`* |
| `walletsPinned` | Pins certain wallets to display it at the top of the list. <br /> ***Default**: Get with `getDefaultWalletsModalConfig()`* |
| `walletsDisplayInitialCount?` | Connection buttons count to render before the "More wallets" button. <br /> ***Default**: `6`* |
| `metrics?` | A map of the analytic events. |
| `termsLink?` <br /> `privacyNoticeLink?` <br /> `linkDontHaveWallet?` | UI links. |
| `onClickWalletsMore?` <br /> `onClickWalletsLess?` | Handlers for click events of the "More wallets" and "Less wallets" buttons. |
