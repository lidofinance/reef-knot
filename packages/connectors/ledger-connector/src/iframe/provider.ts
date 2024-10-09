import {
  IFrameEthereumProvider,
  IFrameEthereumProviderOptions,
} from '@ledgerhq/iframe-provider';

interface RequestArguments {
  readonly method: string;
  readonly params?: any[];
}

export class LedgerIFrameProvider extends IFrameEthereumProvider {
  constructor(options?: IFrameEthereumProviderOptions) {
    super(options);
  }

  request({ method, params }: RequestArguments) {
    return this.sendAsync({ method, params }, (error) => {
      if (error) console.error(error);
    });
  }
}
