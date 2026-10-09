import type Transport from '@ledgerhq/hw-transport';
import { LS_KEY_DERIVATION_PATH } from '@reef-knot/ledger-connector';

// The explicit annotation keeps the return type from being inferred through
// a potentially nested copy of @ledgerhq/hw-transport (TS2742).
export const getTransport = async (): Promise<Transport> => {
  try {
    return await (
      await import('@ledgerhq/hw-transport-webhid')
    ).default.create();
  } catch (e) {
    throw new Error('Connection error');
  }
};

export const saveLedgerDerivationPath = (path: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LS_KEY_DERIVATION_PATH, JSON.stringify(path));
};

export const getDerivationPathsForPage = (
  pathTemplate: string,
  page: number,
  perPage: number,
) => {
  const result: Record<string, string> = {};
  Array.from({ length: perPage }).forEach((_, i) => {
    const accountIndex = i + getFirstIndexOnPage(page, perPage);
    result[accountIndex] = pathTemplate.replace('x', accountIndex.toString());
  });
  return result;
};

export const getFirstIndexOnPage = (page: number, accountsPerPage: number) =>
  accountsPerPage * (page - 1);

export const isHIDSupported = () => {
  try {
    return 'hid' in window.navigator;
  } catch (error) {
    return false;
  }
};
