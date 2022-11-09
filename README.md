# ReefKnot
Web3 Wallets Connection Library

## Developing

### Project structure
- The project is organized as monorepo using [turborepo](https://turbo.build/repo) tools.
- [Changesets](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md) are used for publishing new versions.
- The `packages` dir contains packages, most of them are published to npm, but some are not.
- The `apps` dir contains an example application, which uses the packages to demonstrate wallets connection. 

### Commands
- `yarn dev` runs the `dev` script for all apps and packages.
Usually apps are launched using `next dev` and packages are built using rollup with `--watch` flag, which rebuilds the bundle when its source files change on disk.
- `yarn build` - Build all apps and packages.
- `yarn build-apps` - Build apps only.
- `yarn build-packages` - Build packages only.

### Initial setup
Install the dependencies, build everything:
```
yarn install & yarn build 
```
