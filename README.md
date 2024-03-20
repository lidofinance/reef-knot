<img src="logo.svg" alt='Reef Knot logo' width='20%' align="right">

# Reef Knot &middot; ![NPM Version](https://img.shields.io/npm/v/reef-knot)  
Web3 Wallets Connection Library

## Documentation

- [How to add a wallet](docs/how-to-add-a-wallet.md)

## Development

### Project structure
- The project is organized as monorepo using [turborepo](https://turbo.build/repo) tools.
- The `packages` dir contains packages, most of them are published to npm, but some are not.
- The `apps` dir contains an example application, which uses the packages to demonstrate wallets connection. 

### Initial setup
Install the dependencies, build everything:
```
yarn install & yarn build 
```

### Commands
- `yarn dev` runs the `dev` script for all apps and packages.
Usually apps are launched using `next dev` and packages are built using rollup with `--watch` flag, which rebuilds the bundle when its source files change on disk.
- `yarn build` - Build all apps and packages.
- `yarn build-apps` - Build apps only.
- `yarn build-packages` - Build packages only.

### How to release a new version
The [Changesets](https://github.com/changesets/changesets) tool is used for publishing new versions.  
To release a new version, see [the instruction in the docs](docs/how-to-release.md).
