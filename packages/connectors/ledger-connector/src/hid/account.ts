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
  type LocalAccount,
  type TypedDataDefinition,
  type TypedDataDomain,
} from 'viem';

type EIP712Message = Parameters<Eth['signEIP712Message']>[1];

export type WithEthApp = <T>(
  callback: (eth: Eth) => T | Promise<T>,
) => Promise<T>;

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
): LocalAccount =>
  toAccount({
    address,

    async signTransaction(
      transaction,
      { serializer = serializeTransaction } = {},
    ) {
      const unsignedRawTx = (await serializer(transaction)).slice(2);
      const { r, s, v } = await withEthApp((eth) =>
        eth.clearSignTransaction(path, unsignedRawTx, RESOLUTION_CONFIG),
      );

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
