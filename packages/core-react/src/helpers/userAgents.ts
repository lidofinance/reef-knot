import { UAParser } from 'ua-parser-js';

const parser = new UAParser();

export const device = parser.getDevice();
export const browser = parser.getBrowser();
export const os = parser.getOS();

export const isMobile = device.type === 'mobile';
export const isTablet = device.type === 'tablet';
export const isMobileOrTablet = isMobile || isTablet;
