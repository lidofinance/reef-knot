export const isIframe = () =>
  globalThis.window && globalThis.window.parent !== globalThis.window;

export const isLedgerLive = () => {
  if (typeof window === 'undefined') return false;

  try {
    const params = new URLSearchParams(window.self.location.search);
    const isEmbed = !!params.get('embed');

    return isIframe() && isEmbed;
  } catch (error) {
    return false;
  }
};
