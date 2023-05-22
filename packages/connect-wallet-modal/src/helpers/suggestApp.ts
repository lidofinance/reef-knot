import { openWindow } from './openWindow';
import { isAndroid, isIOS } from './user-agents';

export const suggestApp = (urls: {
  default: string;
  android?: string;
  ios?: string;
}) => {
  if (urls.ios && isIOS) {
    openWindow(urls.ios);
    return;
  }

  if (urls.android && isAndroid) {
    openWindow(urls.android);
    return;
  }

  openWindow(urls.default);
};
