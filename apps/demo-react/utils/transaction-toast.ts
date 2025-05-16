import {
  type TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-ethereum-sdk/core';
import { toast } from '@lidofinance/lido-ui';

export const transactionToast: TransactionCallback = ({ stage }) => {
  switch (stage) {
    case TransactionCallbackStage.PERMIT:
      toast('Permit', { type: 'info', closeButton: false });
      break;
    case TransactionCallbackStage.GAS_LIMIT:
      toast('Gas limit', { type: 'info', closeButton: false });
      break;
    case TransactionCallbackStage.SIGN:
      toast('Signing', { type: 'info', closeButton: false });
      break;
    case TransactionCallbackStage.RECEIPT:
      toast('Receipt', { type: 'info', closeButton: false });
      break;
    case TransactionCallbackStage.CONFIRMATION:
      toast('Confirmation', { type: 'success', closeButton: false });
      break;
    case TransactionCallbackStage.ERROR:
      toast('Error', { type: 'error', closeButton: false });
      break;
    case TransactionCallbackStage.DONE:
      toast('Success', { type: 'success', closeButton: false });
      break;
    case TransactionCallbackStage.MULTISIG_DONE:
      toast('Multisig Success', { type: 'success', closeButton: false });
      break;
  }
  return undefined;
};
