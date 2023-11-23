# Connect Wallet Modal

Provides a modal window with buttons for connection with various crypto wallets.

### Custom

You can configure the list of wallets displayed in the modal.
The package provides wallet connection buttons that are meant to be used inside the modal.
You can use them, or you can make your own.

Import the basic WalletsModal component with required wallet connection buttons:
```ts
import { WalletsModal, ConnectMetamask, ConnectWalletConnect } from '@reef-knot/connect-wallet-modal'
```

Use it like this:
```tsx
<WalletsModal
  open={isOpen}
  onClose={handleClose}
  shouldInvertWalletIcon={false} // set to true for the dark color theme
>
  {(commonProps) => (
    <>
      <ConnectMetamask key='Metamask' {...commonProps} />
      <ConnectWalletConnect key='WalletConnect' {...commonProps} />
    </>
  )}
</WalletsModal>
```

### For Ethereum

The package provides the modal variant with the predefined list of wallets, which work with the Ethereum network. 

Import the component:
```ts
import { WalletsModalForEth } from '@reef-knot/connect-wallet-modal'
```

Use it like this:
```tsx
<WalletsModalForEth {...props} />
```

#### How to hide a wallet
You can hide one or several wallet connection buttons from the list of wallets in the modal.  
Use the `hiddenWallets` property like this:
```tsx
<WalletsModalForEth
  hiddenWallets={['Metamask']}
/>
```
