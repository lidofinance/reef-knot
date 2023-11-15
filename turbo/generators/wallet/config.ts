import { PlopTypes } from "@turbo/gen";

export function walletGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("wallet", {
    description:
      "Generate a new Wallet Adapter",
    prompts: [
      {
        type: "input",
        name: "walletId",
        message: "Enter ID for the wallet (no spaces or hyphens, camelcase)",
        validate: (input: string) => {
          if (input.includes(" ")) {
            return "wallet id cannot include spaces";
          }
          if (input.includes("-")) {
            return "wallet id cannot include hyphens";
          }
          if (!input) {
            return "wallet id is required";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "walletName",
        message: "Enter name for the wallet",
        validate: (input: string) => {
          if (!input) {
            return "wallet name is required";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "{{ turbo.paths.root }}/packages/wallets/{{ walletId }}",
        templateFiles: "wallet/templates/**/*",
        globOptions: { dot: true },
        base: 'wallet/templates'
      },
    ],
  });
}
