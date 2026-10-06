// Utility to wrap a function and call a callback after the function call
export function withCallback<
  T extends (...args: any[]) => any,
  C extends ((...args: any[]) => void) | undefined,
>(
  fn: T,
  callback: C,
): (...args: Parameters<T>) => ReturnType<T> | Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    const result = await fn(...args);
    if (callback) callback();
    return result;
  };
}
