# <img src="logo.svg" alt='Reef Knot logo' height='45' align='top'/> Reef-Knot. Playwright test 

## ❖ Installation
1. Install dependencies from the `/playwright-tests` directory:
```
yarn && yarn playwright install chromium
```
1. Fill the `.env` file in the `/playwright-tests` folder using the `.env.example` file as a template.

## ❖ How to run tests on a Deployed Stand
1. Set up the `.env` variable: `STAND_TYPE=stand`
2. Navigate to the `/playwright-tests` folder and run: `yarn test:reef-knot`

## ❖ How to run tests on Localhost
1. Start the `reef-knot` demo app on your local machine: `yarn run dev`
2. Verify the localhost link in `/playwright-tests/config/env.config.ts`, see the `STAND_LINK.localhost` property (_default value is http://localhost:3000_)
3. Set the `.env` variable: `STAND_TYPE=localhost`
4. Navigate to the `/playwright-tests` directory and run: `yarn test:reef-knot`