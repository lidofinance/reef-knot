import { ConsoleLogger } from '@nestjs/common';

/**
 * Function to trim digits after decimal point
 *
 * Example:
 * ```ts
 * 0.12345 => toСutDecimalsDigit('0.12345', 3) => '0.123'
 * 0.101 => toСutDecimalsDigit('0.101', 2, true) => '0.1'
 * ```
 */
export function toCutDecimalsDigit(
  amount: any,
  decimalPlaces: number,
  removeZero = false,
) {
  const parts = String(amount).split(/\./);
  let respLength: number;
  if (parts.length === 2) {
    respLength = parts[0].length + 1 + decimalPlaces;
  }
  const response = String(amount).slice(0, respLength);
  return removeZero ? String(parseFloat(response)) : response;
}

/**
 * Repeatedly calls an asynchronous callback function with the specified arguments until it returns a truthy value
 * or the timeout is reached.
 *
 * @param callback - An asynchronous function that takes arguments of type T and returns a promise.
 * @param args - The arguments to pass to the callback function.
 * @param timeout - The maximum amount of time (in milliseconds) to wait for the callback to return a truthy value.
 * @returns A promise that resolves with the callback's result if it returns a truthy value within the timeout.
 * @throws An error if the timeout is reached before the callback returns a truthy value.
 *
 * @template T - The type of the arguments to be passed to the callback function.
 */
export async function waitForCallback<T>(
  callback: (args: T) => Promise<any>,
  args: T,
  timeout: number,
): Promise<any> {
  let shouldTerminate = false;
  setTimeout(() => {
    shouldTerminate = true;
  }, timeout);

  let result;
  while (!shouldTerminate) {
    result = await callback(args).catch(() => {
      new ConsoleLogger('waitForCallback').log('Callback failed');
    });
    if (result) return result;
  }

  throw new Error(
    `callback still not done after ${
      timeout / 1000
    } sec.\nCallback result: ${result}`,
  );
}
