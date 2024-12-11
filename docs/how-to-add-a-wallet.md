# How to add a wallet to Reef Knot

## Wallet Adapters

Reef Knot has a "Wallet Adapter" abstraction.
Wallet Adapter describes how a specific wallet can be connected,
encompassing essential details such as the wallet's name, logo, connector, etc.  

Every Wallet Adapter is encapsulated within its own package in the `packages/wallets` directory.
Conventionally, these packages are made available on npm, following this naming template:
`@reef-knot/wallet-adapter-<name>`.

To integrate a wallet into Reef Knot, a corresponding Wallet Adapter must be created.

## Generate a Wallet Adapter

### 1. Setup
Check the Reef Knot [README](https://github.com/lidofinance/reef-knot/blob/main/README.md) and set up the project.
After that, you can run `yarn dev` to launch the `demo-react` app, which demonstrates the wallet connection modal and some debug information.

### 2. Run Wallet Adapter generator
Use `yarn run new-wallet` command to generate boilerplate files and code for a new wallet adapter.  
The CLI will ask you a few questions regarding the new adapter, including a unique ID and the wallet's name.
Answer the questions, and the adapter will be generated within the packages/wallets/<wallet-id> directory,
where <wallet-id> corresponds to the ID you've specified.

### 3. Add to wallets-list
Open `packages/wallets-list/src/ethereum.ts` and include the new adapter into the list. 

### 4. Configure the adapter
Check the fields of `WalletAdapterType` and assign values in your adapter accordingly.  
Set the function to detect the wallet, if this can be applied to your wallet.  
Consider wrapping the generic InjectedConnector in a more specific connector,
redefining the name and some other relevant properties as needed.  
Refer to other wallet adapters for guidance and examples.

#### Icon
Ensure to include an SVG icon of the wallet.  
It is recommended to put it in a dedicated `src/icons` directory.  
Only circle icons are currently used in Reef Knot.  
You may want to add 2 icons: for dark and light color themes, or use the same icon for both cases.

### 5. Check the adapter
Run `yarn dev` to launch the `demo-react` app on `http://localhost:3000`.
This is a demo app, where you can click "Connect Wallet" button and see
the new wallet connection button, how it looks and how it works.
