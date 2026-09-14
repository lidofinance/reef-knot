import type Eth from '@ledgerhq/hw-app-eth';
import { toAccount } from 'viem/accounts';
import {
  bytesToHex,
  getTypesForEIP712Domain,
  hashStruct,
  serializeSignature,
  serializeTransaction,
  stringToHex,
  type Address,
  type Hex,
  type LocalAccount,
  type TypedDataDefinition,
  type TypedDataDomain,
} from 'viem';

type EIP712Message = Parameters<Eth['signEIP712Message']>[1];

export type WithEthApp = <T>(
  callback: (eth: Eth) => T | Promise<T>,
) => Promise<T>;

export type LedgerAccountOptions = {
  // Refuse to sign a contract call the device cannot clear sign.
  forceClearSign?: boolean;
};

type TransactionResolution = Awaited<
  ReturnType<Eth['ledgerService']['resolveTransaction']>
>;

export class ClearSignUnavailableError extends Error {
  override name = 'ClearSignUnavailableError';

  constructor() {
    super('The transaction cannot be clear signed on the device.');
  }
}

const hasCalldata = (data?: Hex) => !!data && data !== '0x';

const isEmptyResolution = (resolution: TransactionResolution | null) =>
  !resolution ||
  [
    resolution.erc20Tokens,
    resolution.nfts,
    resolution.externalPlugin,
    resolution.plugin,
  ].every((descriptors) => descriptors.length === 0);

// What the Ledger service should try to resolve for clear signing.
const RESOLUTION_CONFIG = {
  erc20: true,
  externalPlugins: true,
  nft: true,
};

// Devices without full EIP-712 support (e.g. Nano S) reject the structured
// message and can only sign its domain and message hashes.
const shouldFallbackToHashedSigning = (error: unknown) =>
  (error as { statusText?: string } | null)?.statusText === 'INS_NOT_SUPPORTED';

const toSignatureHex = ({ r, s, v }: { r: string; s: string; v: number }) =>
  serializeSignature({ r: `0x${r}`, s: `0x${s}`, v: BigInt(v) });

export const createLedgerAccount = (
  address: Address,
  path: string,
  withEthApp: WithEthApp,
  { forceClearSign = false }: LedgerAccountOptions = {},
): LocalAccount =>
  toAccount({
    address,

    async signTransaction(
      transaction,
      { serializer = serializeTransaction } = {},
    ) {
      const unsignedRawTx = (await serializer(transaction)).slice(2);
      const { r, s, v } = await withEthApp(async (eth) => {
        // Metadata fetch failures are swallowed by the Ledger service and
        // surface as an empty resolution, which the device blind signs.
        const resolution = await eth.ledgerService
          .resolveTransaction(unsignedRawTx, eth.loadConfig, RESOLUTION_CONFIG)
          .catch((error: unknown) => {
            if (forceClearSign) throw error;
            return null;
          });
        if (
          forceClearSign &&
          hasCalldata(transaction.data) &&
          isEmptyResolution(resolution)
        )
          throw new ClearSignUnavailableError();
        return eth.signTransaction(path, unsignedRawTx, resolution);
      });

      // For typed transactions the device returns the yParity (0/1),
      // for legacy ones — the full EIP-155 `v`; viem accepts both.
      return serializer(transaction, {
        r: `0x${r}`,
        s: `0x${s}`,
        v: BigInt(`0x${v}`),
      });
    },

    async signMessage({ message }) {
      const messageHex =
        typeof message === 'string'
          ? stringToHex(message)
          : typeof message.raw === 'string'
            ? message.raw
            : bytesToHex(message.raw);

      const signature = await withEthApp((eth) =>
        eth.signPersonalMessage(path, messageHex.slice(2)),
      );
      return toSignatureHex(signature);
    },

    async signTypedData(parameters) {
      const {
        domain = {},
        types,
        primaryType,
        message,
      } = parameters as TypedDataDefinition;

      const signature = await withEthApp(async (eth) => {
        try {
          return await eth.signEIP712Message(
            path,
            parameters as unknown as EIP712Message,
          );
        } catch (error) {
          if (!shouldFallbackToHashedSigning(error)) throw error;

          const typedDataDomain = domain as TypedDataDomain;
          const domainSeparator = hashStruct({
            data: typedDataDomain,
            primaryType: 'EIP712Domain',
            types: {
              EIP712Domain: getTypesForEIP712Domain({
                domain: typedDataDomain,
              }),
            },
          });
          const messageHash = hashStruct({
            data: message,
            primaryType,
            types,
          });

          return eth.signEIP712HashedMessage(
            path,
            domainSeparator.slice(2),
            messageHash.slice(2),
          );
        }
      });
      return toSignatureHex(signature);
    },
  });
