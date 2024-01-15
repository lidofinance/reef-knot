import { UAParser } from 'ua-parser-js';

const parser = new UAParser();

export const os = parser.getOS();
export const isIOS = os.name === 'iOS';
export const isAndroid = os.name === 'Android';
