# <img src="logo.svg" alt='Reef Knot logo' height='45' align='top'/> Reef-Knot. Playwright test 

## ❖ Installation
1. Install dependencies from `/plyawright-tests` folder
```
yarn && yarn playwright install chromium
```
1. Fill the `.env` with `.env.example` in the `/playwright-tests` folder

## ❖ How to run tests from deployed stand?
1. Set up the `.env` variable: `STAND_TYPE=stand`
2. Run command from `/plyawright-tests` folder: `yarn test:reef-knot`

## ❖ How to run tests from localhost?
1. Run `reef-knot` stand on the localhost
2. Check the localhost link in the `/playwright-tests/config/env.config.ts` => `STAND_LINK.localhost` (_default value is http://localhost:3000_)
3. Set up the `.env` variable: `STAND_TYPE=localhost`
4. Run command from `/plyawright-tests` folder: `yarn test:reef-knot`