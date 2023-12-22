import { LS_KEY_DERIVATION_PATH } from '@reef-knot/ledger-connector';
import { LedgerContextValue } from './LedgerContext';
import { DERIVATION_PATHS } from './constants';

export const getTransport = async () => {
  try {
    return (await import('@ledgerhq/hw-transport-webhid')).default.create();
  } catch (e) {
    throw new Error('Connection error');
  }
};

export const saveLedgerDerivationPath = (path: string) => {
  window?.localStorage.setItem(LS_KEY_DERIVATION_PATH, JSON.stringify(path));
};

export const loadLedgerDerivationPath = () => {
  if (typeof window === 'undefined') {
    return DERIVATION_PATHS[0].template;
  }
  return window.localStorage.getItem(LS_KEY_DERIVATION_PATH);
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

export const isDeviceBusy = (transport: LedgerContextValue['transport']) => {
  // _appAPIlock is a flag, used in the @ledgerhq/hw-transport library for indication if a Ledger device is busy
  // returns the name of the request, which was being processed, or null or undefined
  return transport.current?._appAPIlock;
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
