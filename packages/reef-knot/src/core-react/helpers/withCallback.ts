// Utility to wrap a function and call a callback after the function call
export function withCallback<
  T extends (...args: never[]) => unknown,
  C extends ((...args: never[]) => void) | undefined,
>(
  fn: T,
  callback: C,
): (...args: Parameters<T>) => ReturnType<T> | Promise<ReturnType<T>> {
  const call = fn as (
    ...args: Parameters<T>
  ) => ReturnType<T> | Promise<ReturnType<T>>;
  return async (...args: Parameters<T>) => {
    const result = await call(...args);
    if (callback) callback();
    return result;
  };
}
