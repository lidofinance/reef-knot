declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare interface Window {
  okxwallet: {
    isOkxWallet: boolean;
  };
}
