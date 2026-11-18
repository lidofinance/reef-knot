import { IFrameEthereumProvider } from '@ledgerhq/iframe-provider';

interface RequestArguments {
  readonly method: string;
  readonly params?: unknown[];
}

export class LedgerIFrameProvider extends IFrameEthereumProvider {
  request({ method, params }: RequestArguments) {
    return this.send(method, params);
  }
}
