# @reef-knot/ui-lido-legacy

## 1.0.0

- Move the legacy wallet modal and UI components from `@reef-knot/connect-wallet-modal` and `@reef-knot/ui-react` into this package for Reef Knot 9.
- Keep support for `darkThemeEnabled`, `buttonsFullWidth` and legacy modal props. Require Lido UI v3 and styled-components 5.
- Use the shared connection hooks from `reef-knot` and allow component overrides through `components`.
- Show connection errors with a Back action that preserves the picker state.
- Keep wallet icon components stable across renders to avoid flicker.
- Unmount closed transition overlays so they no longer block clicks, keyboard focus or scrolling. Remove the `mountOnEnter` and `unmountOnExit` options.
- Replace the old wallet-button registry with `components.WalletButton`. The `linkDontHaveWallet` option and wallet-specific `Connect*` components are removed.
