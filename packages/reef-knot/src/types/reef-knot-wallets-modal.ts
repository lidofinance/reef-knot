export type ReefKnotWalletsModalConfig<I extends string = string> = {
  walletsShown: I[];
  walletsPinned: I[];
  walletsDisplayInitialCount?: number;
  linkTerms?: string;
  linkPrivacyNotice?: string;
  linkDontHaveWallet?: string;
  onConnectStart?(this: void, args: { walletId: I }): void;
  onConnectSuccess?(this: void, args: { walletId: I; rdns?: string }): void;
  onClickTermsAccept?: (args: { isAccepted: boolean }) => void;
  onClickWalletsMore?: () => void;
  onClickWalletsLess?: () => void;
};
