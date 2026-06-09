const SAFE_DATA_ICON =
  /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/]+=*$/;
const SAFE_HTTPS_URL = /^https:\/\//;

export const validateIcon = (src: string): string | undefined =>
  SAFE_DATA_ICON.test(src) || SAFE_HTTPS_URL.test(src) ? src : undefined;

// Generic grey circle shown when a wallet icon is missing or fails to load.
export const FALLBACK_WALLET_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='12' fill='%23C7C9CE'/%3E%3C/svg%3E";
