export const openWindow = (url: string): void => {
  globalThis.window?.open(url, '_blank', 'noopener,noreferrer');
};
