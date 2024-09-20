import {
  type TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-ethereum-sdk/core';
import { toast } from '@lidofinance/lido-ui';

export const transactionToast: TransactionCallback = ({ stage }) => {
  switch (stage) {
    case TransactionCallbackStage.PERMIT:
      return toast('Permit', { type: 'info', closeButton: false });
    case TransactionCallbackStage.GAS_LIMIT:
      return toast('Gas limit', { type: 'info', closeButton: false });
    case TransactionCallbackStage.SIGN:
      return toast('Signing', { type: 'info', closeButton: false });
    case TransactionCallbackStage.RECEIPT:
      return toast('Receipt', { type: 'info', closeButton: false });
    case TransactionCallbackStage.CONFIRMATION:
      return toast('Confirmation', { type: 'success', closeButton: false });
    case TransactionCallbackStage.ERROR:
      return toast('Error', { type: 'error', closeButton: false });
    case TransactionCallbackStage.DONE:
      return toast('Success', { type: 'success', closeButton: false });
    case TransactionCallbackStage.MULTISIG_DONE:
      return toast('Multisig Success', { type: 'success', closeButton: false });
  }
};
