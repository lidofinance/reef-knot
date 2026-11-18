// EIP-6963 providers are browser extensions that the user has explicitly
// installed and trusted. The browser's extension sandbox already grants them
// far broader access than icon injection could ever provide, so there is no
// meaningful attack surface to defend against here.
//
// SVG delivered via <img src="data:image/svg+xml..."> is additionally
// sandboxed by the browser: scripts inside the SVG do not execute and external
// resources are blocked. The dangerous case — inline <svg> in HTML — does not
// apply here.
//
// We therefore allow all data:image/* MIME types (including svg+xml) and
// plain HTTPS URLs (valid per the EIP-6963 spec). We still block non-image
// data: schemes (javascript:, data:text/html, …) as a minimal safety net
// in case a malformed or spoofed provider announcement slips through.
const SAFE_DATA_IMAGE = /^data:image\/[a-z+]+(;base64)?,/;
const SAFE_HTTPS_URL = /^https:\/\//;

export const validateIcon = (src: string): string | undefined => {
  // Some extensions include leading/trailing whitespace in the icon string.
  const iconSrc = src.trim();
  return SAFE_DATA_IMAGE.test(iconSrc) || SAFE_HTTPS_URL.test(iconSrc)
    ? iconSrc
    : undefined;
};

// Generic grey circle shown when a wallet icon is missing or fails to load.
export const FALLBACK_WALLET_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='12' fill='%23C7C9CE'/%3E%3C/svg%3E";
