# @reef-knot/ui-lido

## 1.0.0

- Add a wallet modal for Reef Knot 9 using Lido App UI, with wallet search, Terms, connection errors, EIP-6963 selection and Ledger screens.
- Allow applications to replace wallet buttons, the modal container and individual screens through `components`.
- Support light and dark themes through the required `theme` prop and the page's Lido App UI colors.
- Add keyboard focus handling, Escape support and scroll locking. Focus the search field when the wallet list expands.
- Require React 18 and `@lidofinance/lido-app-ui` `~1.4.0`. Load the UI kit stylesheet and `@reef-knot/ui-lido/styles.css`.
- Copy styles and assets during builds and update them in watch mode.
