import { LS_KEY_DERIVATION_PATH } from '@reef-knot/ledger-connector';
import { LedgerContextValue } from './LedgerContext';
import { DERIVATION_PATHS } from './constants';

export async function getTransport() {
  return await (await import('@ledgerhq/hw-transport-webhid')).default.create();
}

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
  // _appAPIlock indicates if a Ledger device is busy and returns the currently processed request's name
  return transport.current?._appAPIlock;
};

export const getFirstIndexOnPage = (page: number, accountsPerPage: number) =>
  accountsPerPage * (page - 1);

export const interceptLedgerError = (error: Error) => {
  const errorDict: { [k: string]: string | undefined } = {
    TransportOpenUserCancelled: 'The connection attempt has been rejected.',
    TransportStatusError:
      'Make sure the device is connected and the Ethereum app is open on the device.',
    InvalidStateError:
      'Make sure the device is connected and the Ethereum app is open on the device.',
    LockedDeviceError: 'The device is locked. Please, unlock it and try again.',
    TransportError: undefined,
  };

  if (error.name in errorDict) {
    return new Error(errorDict[error.name]);
  }

  return error;
};
