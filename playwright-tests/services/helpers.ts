/*
 * Function to trim digits after decimal point
 *
 * Example:
 * ```ts
 * 0.12345 => toCut('0.12345', 3) => '0.123'
 * ```
 */
export function toCut(floatAmount: string, decimalPlaces: number) {
  const result = floatAmount.split(/\./);
  let respLength: number;
  if (result.length === 2) {
    respLength = result[0].length + 1 + decimalPlaces;
  }
  return floatAmount.slice(0, respLength);
}
