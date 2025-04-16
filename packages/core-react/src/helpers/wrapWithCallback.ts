// Utility to wrap a function and call a callback after the function call
export function wrapWithCallback<
  T extends (...args: any[]) => any,
  C extends (...args: any[]) => void,
>(
  fn: T,
  callback: C,
): (...args: Parameters<T>) => ReturnType<T> | Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    const result = await fn(...args);
    callback();
    return result;
  };
}
