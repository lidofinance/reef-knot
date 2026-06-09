const SAFE_DATA_ICON =
  /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/]+=*$/;
export const validateIcon = (src: string): string | undefined =>
  SAFE_DATA_ICON.test(src) ? src : undefined;
