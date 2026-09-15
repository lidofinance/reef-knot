import type {
  MinimalEventSourceInterface,
  MinimalEventTargetInterface,
} from '@ledgerhq/iframe-provider';

type JsonRpcRequest = {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: unknown[];
};

export type HostHandlers = Record<string, (params: unknown[]) => unknown>;

// A handler throws this to make the host answer with a JSON-RPC error.
export class HostRpcError extends Error {
  constructor(
    public readonly code: number,
    message: string,
  ) {
    super(message);
  }
}

// Simulates the Ledger Live host on the other side of the iframe bridge:
// the provider posts JSON-RPC requests into `postMessage` and receives
// responses (and host-initiated events) through its message listeners.
export class FakeLedgerLive
  implements MinimalEventSourceInterface, MinimalEventTargetInterface
{
  readonly calls: { method: string; params: unknown[] }[] = [];

  private listeners = new Set<(event: MessageEvent) => void>();

  constructor(private readonly handlers: HostHandlers) {}

  addEventListener(_type: 'message', listener: (event: MessageEvent) => void) {
    this.listeners.add(listener);
  }

  postMessage(message: JsonRpcRequest) {
    this.calls.push({ method: message.method, params: message.params ?? [] });
    const handler = this.handlers[message.method];
    // Real replies arrive on a later tick, never synchronously.
    queueMicrotask(() => {
      try {
        if (!handler)
          throw new HostRpcError(-32601, `no handler for ${message.method}`);
        this.dispatch({
          jsonrpc: '2.0',
          id: message.id,
          result: handler(message.params ?? []),
        });
      } catch (error) {
        const { code = -32000, message: reason = 'host error' } =
          error as Partial<HostRpcError>;
        this.dispatch({
          jsonrpc: '2.0',
          id: message.id,
          error: { code, message: reason },
        });
      }
    });
  }

  // A host-initiated event (accountsChanged, chainChanged, …).
  emitEvent(method: string, params: unknown[]) {
    this.dispatch({ jsonrpc: '2.0', method, params });
  }

  private dispatch(data: unknown) {
    this.listeners.forEach((listener) =>
      listener({ data } as unknown as MessageEvent),
    );
  }
}
