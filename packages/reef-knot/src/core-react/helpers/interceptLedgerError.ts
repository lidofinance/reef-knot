export const LedgerErrorsDict: Record<string, string | undefined> = {
  TransportOpenUserCancelled: 'The connection attempt has been rejected.',
  TransportStatusError:
    'Make sure the device is connected and the Ethereum app is open on the device.',
  InvalidStateError:
    'Make sure the device is connected and the Ethereum app is open on the device.',
  LockedDeviceError: 'The device is locked. Please, unlock it and try again.',
  TransportError: undefined,
};

export const interceptLedgerError = (error: Error) => {
  if (Object.hasOwn(LedgerErrorsDict, error.name)) {
    return new Error(LedgerErrorsDict[error.name]);
  }

  return error;
};
