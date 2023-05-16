import { UAParser } from 'ua-parser-js';

const parser = new UAParser();

export const os = parser.getOS();
export const isIOS = os.name === 'iOS';
export const isAndroid = os.name === 'Android';

export const device = parser.getDevice();
export const isMobile = device.type === 'mobile';
export const isTablet = device.type === 'tablet';
export const isMobileOrTablet = isMobile || isTablet;
