export const validateIcon = (src: string): string | undefined =>
  src.startsWith('data:') ? src : undefined;
