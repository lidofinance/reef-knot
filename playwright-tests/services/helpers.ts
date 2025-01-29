/**
 * Function to trim digits after decimal point
 *
 * Example:
 * ```ts
 * 0.12345 => toCut('0.12345', 3) => '0.123'
 * ```
 */
export function toCut(amount: any, decimalPlaces: number) {
  const result = String(amount).split(/\./);
  let respLength: number;
  if (result.length === 2) {
    respLength = result[0].length + 1 + decimalPlaces;
  }
  return String(amount).slice(0, respLength);
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
      console.error('Callback failed');
    });
    if (result) return result;
  }

  throw new Error(
    `callback still not done after ${
      timeout / 1000
    } sec.\nCallback result: ${result}`,
  );
}
