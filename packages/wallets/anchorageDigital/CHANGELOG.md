# @reef-knot/wallet-adapter-anchorage-digital

## 1.3.0

- Replace the `@reef-knot/types` peer dependency with `@reef-knot/wallets-helpers` for shared wallet adapter types.
- Keep connections tied to Anchorage Digital when its EIP-6963 provider is missing, instead of falling back to another browser wallet.
- Generate type declarations through the shared build and add a separate TypeScript check.
