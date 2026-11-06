interface Window {
  ethereum?: Record<string, unknown>;
  lido_sdk?: import('@lidofinance/lido-ethereum-sdk').LidoSDK;
}

declare module '*.svg' {
  const content: string;
  export const ReactComponent: React.FunctionComponent<
    React.ComponentProps<'svg'>
  >;
  export default content;
}
