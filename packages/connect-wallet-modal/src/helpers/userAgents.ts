import { UAParser } from 'ua-parser-js';

const parser = new UAParser();

export const os = parser.getOS();
export const device = parser.getDevice();
export const isIOS = os.name === 'iOS';
export const isIPad = device.model === 'iPad';
export const isAndroid = os.name === 'Android';
