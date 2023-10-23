export type AccountRecord = {
  index: string;
  path: string;
  pathTemplate: string;
  address: string;
  balance: number;
  token: string;
};

export type AccountsStorage = {
  [path: string]: { [accountIndex: string]: AccountRecord };
};
