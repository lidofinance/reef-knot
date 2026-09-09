import {
  openTransportReplayer,
  RecordStore,
} from '@ledgerhq/hw-transport-mocker';
import type TransportWebHID from '@ledgerhq/hw-transport-webhid';
import type { Address } from 'viem';
import type { LedgerHQProvider } from '../provider';

// The APDU exchanges below were recorded from @ledgerhq/hw-app-eth@7.8.12
// with @ledgerhq/hw-transport-mocker's createTransportRecorder, for the
// exact inputs the tests replay (default derivation path, the message
// 'reef-knot', the legacy transaction and the typed data defined here).

export const DERIVATION_PATH = "m/44'/60'/0'/0/0";
export const DERIVATION_PATH_B = "m/44'/60'/1'/0/0";

export const ADDRESS_A: Address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
export const ADDRESS_B: Address = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

export const SIGNATURE_R = `0x${'11'.repeat(32)}` as const;
export const SIGNATURE_S = `0x${'22'.repeat(32)}` as const;
// serializeSignature output for the fixture r/s with v = 27 (0x1b).
export const MESSAGE_SIGNATURE = `0x${'11'.repeat(32)}${'22'.repeat(32)}1b`;

// [v][r][s] + APDU status 9000.
const signatureResponse = (v: string) =>
  `${v}${'11'.repeat(32)}${'22'.repeat(32)}9000`;

const asciiHex = (value: string) =>
  [...value]
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');

export const APP_CONFIG = '=> e006000000\n<= 010109009000';

// getAppConfiguration answered with 0x5515 (LOCKED_DEVICE).
export const DEVICE_LOCKED = '=> e006000000\n<= 5515';

// getAddress: [pubkey_len][pubkey][address_len][ascii address] 9000.
export const getAddressExchange = (address: Address) =>
  '=> e002000015058000002c8000003c800000000000000000000000\n' +
  `<= 4104${'ab'.repeat(64)}28${asciiHex(address.slice(2))}9000`;

export const getAddressExchangeForPathB = (address: Address) =>
  '=> e002000015058000002c8000003c800000010000000000000000\n' +
  `<= 4104${'ab'.repeat(64)}28${asciiHex(address.slice(2))}9000`;

export const PERSONAL_SIGN_MESSAGE = 'reef-knot';
export const PERSONAL_SIGN =
  '=> e008000022058000002c8000003c80000000000000000000000000000009726565662d6b6e6f74\n' +
  `<= ${signatureResponse('1b')}`;

// Legacy transfer: chainId 1, nonce 0, gasPrice 1 gwei, gas 21000,
// to ADDRESS_A, value 1 wei. Signed with v = 0x25 (EIP-155 parity 0).
export const LEGACY_TX = {
  type: 'legacy',
  chainId: 1,
  nonce: 0,
  gasPrice: 1000000000n,
  gas: 21000n,
  to: ADDRESS_A,
  value: 1n,
} as const;
export const SIGN_TX =
  '=> e004000039058000002c8000003c800000000000000000000000e380843b9aca0082520894d8da6bf26964af9d7eed9e03e53415d37aa960450180018080\n' +
  `<= ${signatureResponse('25')}`;

// The fixture transaction after viem fills the missing fee fields itself:
// eth_gasPrice (1 gwei) times viem's 1.2 legacy fee multiplier.
export const FILLED_LEGACY_TX = {
  ...LEGACY_TX,
  gasPrice: 1200000000n,
} as const;
export const SIGN_TX_FILLED =
  '=> e004000039058000002c8000003c800000000000000000000000e3808447868c0082520894d8da6bf26964af9d7eed9e03e53415d37aa960450180018080\n' +
  `<= ${signatureResponse('25')}`;

// EIP-1559 transfer with the same to/value/nonce/gas; signed with yParity 0.
export const TX_1559 = {
  chainId: 1,
  nonce: 0,
  maxPriorityFeePerGas: 1000000000n,
  maxFeePerGas: 2000000000n,
  gas: 21000n,
  to: ADDRESS_A,
  value: 1n,
} as const;
export const SIGN_TX_1559 =
  '=> e00400003e058000002c8000003c80000000000000000000000002e70180843b9aca00847735940082520894d8da6bf26964af9d7eed9e03e53415d37aa960450180c0\n' +
  `<= ${signatureResponse('00')}`;

// EIP-2930 transfer with an empty access list; signed with yParity 0.
export const TX_2930 = {
  chainId: 1,
  type: 'eip2930',
  nonce: 0,
  gasPrice: 1000000000n,
  gas: 21000n,
  to: ADDRESS_A,
  value: 1n,
  accessList: [],
} as const;
export const SIGN_TX_2930 =
  '=> e004000039058000002c8000003c80000000000000000000000001e20180843b9aca0082520894d8da6bf26964af9d7eed9e03e53415d37aa960450180c0\n' +
  `<= ${signatureResponse('00')}`;

export const TYPED_DATA = {
  domain: { name: 'ReefKnot', version: '1', chainId: 1 },
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
    ],
    Mail: [{ name: 'contents', type: 'string' }],
  },
  primaryType: 'Mail',
  message: { contents: 'hi' },
};

// The device rejects the structured EIP-712 flow (a Nano S without full
// EIP-712 support): the version probe gets INS_NOT_SUPPORTED (0x6d00)…
export const EIP712_REJECT = '=> b001000000\n<= 6d00';
// …and the account falls back to signing the domain and message hashes.
export const EIP712_HASHED =
  '=> e00c000055058000002c8000003c800000000000000000000000239f83f0e5cffb0066b29194d820885963cf4631edc247a93465edf245fe2a743ae9302329ea4532e9dfd49237157e053215d5e0fa97711ed9ab4e607ae24b1c\n' +
  `<= ${signatureResponse('1b')}`;

// Points the provider's transport at a replayer over the given exchanges.
// Each withEthApp call opens a fresh transport; all of them consume the
// same store sequentially, exactly like consecutive real device sessions.
export const injectReplayer = (
  provider: LedgerHQProvider,
  ...exchanges: string[]
) => {
  const store = RecordStore.fromString(exchanges.join('\n'));
  provider.transport = {
    create: () => openTransportReplayer(store),
  } as unknown as typeof TransportWebHID;
  return store;
};

// As injectReplayer, but stamps a device onto each opened transport so the
// provider's HID disconnect matching has something to compare against.
export const injectReplayerWithDevice = (
  provider: LedgerHQProvider,
  device: HIDDevice,
  ...exchanges: string[]
) => {
  const store = RecordStore.fromString(exchanges.join('\n'));
  provider.transport = {
    create: async () =>
      Object.assign(await openTransportReplayer(store), { device }),
  } as unknown as typeof TransportWebHID;
  return store;
};

// enable() subscribes to HID disconnect events; happy-dom has no WebHID.
// The returned `unplug` simulates the browser firing such an event.
export const stubHid = () => {
  type HidListener = (event: HIDConnectionEvent) => void;
  const listeners = new Set<HidListener>();
  Object.defineProperty(window.navigator, 'hid', {
    value: {
      addEventListener: (_type: string, listener: HidListener) =>
        listeners.add(listener),
      removeEventListener: (_type: string, listener: HidListener) =>
        listeners.delete(listener),
    },
    configurable: true,
  });
  return {
    unplug: (device: HIDDevice) =>
      [...listeners].forEach((listener) =>
        listener({ device } as HIDConnectionEvent),
      ),
  };
};
