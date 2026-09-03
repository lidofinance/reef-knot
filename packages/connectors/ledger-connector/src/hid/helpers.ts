import { LS_KEY_DERIVATION_PATH } from './constants';

export const checkError = (error: any): never => {
  if (error.statusText === 'INS_NOT_SUPPORTED') {
    // eslint-disable-next-line no-param-reassign
    error.message =
      'Device is not supported. Make sure the Ethereum app is open on the device.';
  }

  if (error.statusText === 'UNKNOWN_ERROR') {
    // eslint-disable-next-line no-param-reassign
    error.message =
      'Unknown error. Make sure the device is connected and the Ethereum app is open on the device.';
  }

  if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
    // eslint-disable-next-line no-param-reassign
    error.message = 'User rejected the request';
  }

  throw error;
};

export const clearLedgerDerivationPath = () => {
  window?.localStorage.removeItem(LS_KEY_DERIVATION_PATH);
};
