import { BigNumberish } from '@ethersproject/bignumber';
import { TransactionRequest } from '@ethersproject/providers';
import { UnsignedTransaction } from '@ethersproject/transactions';

export type UnsignedTransactionStrict = Omit<UnsignedTransaction, 'type'> & {
  type?: number;
};

export type TransactionRequestExtended = TransactionRequest & {
  gas?: BigNumberish;
};
