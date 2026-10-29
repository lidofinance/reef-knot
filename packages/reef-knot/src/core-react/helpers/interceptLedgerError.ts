import { UserFacingError } from './userFacingError';

export const LedgerErrorsDict: Record<string, string | undefined> = {
  TransportOpenUserCancelled: 'The connection attempt has been rejected.',
  TransportStatusError:
    'Make sure the device is connected and the Ethereum app is open on the device.',
  InvalidStateError:
    'Make sure the device is connected and the Ethereum app is open on the device.',
  LockedDeviceError: 'The device is locked. Please, unlock it and try again.',
  TransportError: undefined,
};

// Keep the original error if there is no message for it. The UI then shows a generic message.
export const interceptLedgerError = (error: Error) => {
  const message = Object.hasOwn(LedgerErrorsDict, error.name)
    ? LedgerErrorsDict[error.name]
    : undefined;
  return message ? new UserFacingError(message, { cause: error }) : error;
};
