import { describe, expect, it } from 'vitest';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { SAFE_DEFAULT_ALLOWED_DOMAINS, getSafeAllowedDomains } from '../index';

const isAllowed = (origin: string, domains: readonly RegExp[]) =>
  domains.some((re) => re.test(origin));

const GENUINE_ORIGINS = [
  'https://app.safe.global',
  'https://app.safe.protofire.io',
];

// Must all be rejected.
const SPOOFED_ORIGINS = [
  // unescaped dot acting as a wildcard
  'https://app0safe.global',
  'https://app-safe.global',
  'https://appXsafeXglobal',
  'https://app0safe.protofire.io',
  'https://app.safe0protofire.io',
  // missing start anchor: suffix match on a foreign subdomain
  'https://evil-app.safe.global',
  'https://xapp.safe.global',
  'https://evilapp.safe.protofire.io',
  // missing scheme: downgraded / foreign schemes
  'http://app.safe.global',
  'http://app.safe.protofire.io',
  'null',
  // origin embedded elsewhere
  'https://app.safe.global.evil.com',
  'https://evil.com/?x=https://app.safe.global',
  'https://evil.com#https://app.safe.global',
  'https://app.safe.global:8443',
  'https://app.safe.global@evil.com',
];

describe('SAFE_DEFAULT_ALLOWED_DOMAINS', () => {
  it.each(GENUINE_ORIGINS)('accepts the genuine origin %s', (origin) => {
    expect(isAllowed(origin, SAFE_DEFAULT_ALLOWED_DOMAINS)).toBe(true);
  });

  it.each(SPOOFED_ORIGINS)('rejects the spoofed origin %s', (origin) => {
    expect(isAllowed(origin, SAFE_DEFAULT_ALLOWED_DOMAINS)).toBe(false);
  });

  it('every default pattern is anchored on both ends', () => {
    for (const re of SAFE_DEFAULT_ALLOWED_DOMAINS) {
      expect(re.source.startsWith('^https:\\/\\/')).toBe(true);
      expect(re.source.endsWith('$')).toBe(true);
      // no unescaped dots
      expect(re.source.replace(/\\./g, '')).not.toContain('.');
    }
  });
});

describe('getSafeAllowedDomains', () => {
  it('returns the defaults when nothing is passed', () => {
    expect(getSafeAllowedDomains()).toEqual([...SAFE_DEFAULT_ALLOWED_DOMAINS]);
    expect(getSafeAllowedDomains(undefined)).toEqual([
      ...SAFE_DEFAULT_ALLOWED_DOMAINS,
    ]);
  });

  it('keeps the defaults and appends custom domains', () => {
    const custom = /^https:\/\/safe\.example\.org$/;
    const domains = getSafeAllowedDomains([custom]);
    expect(domains).toEqual([...SAFE_DEFAULT_ALLOWED_DOMAINS, custom]);
    expect(isAllowed('https://safe.example.org', domains)).toBe(true);
    expect(isAllowed('https://app.safe.global', domains)).toBe(true);
    expect(isAllowed('https://app0safe.global', domains)).toBe(false);
  });

  it('returns a fresh array so callers cannot mutate the defaults', () => {
    const domains = getSafeAllowedDomains();
    domains.push(/.*/);
    expect(SAFE_DEFAULT_ALLOWED_DOMAINS).toHaveLength(2);
  });
});

describe('Safe Apps SDK message validation with the default domains', () => {
  // `communicator` is private in the SDK typings.
  const getValidator = () => {
    const sdk = new SafeAppsSDK({
      allowedDomains: getSafeAllowedDomains(),
    });
    const { communicator } = sdk as unknown as {
      communicator: {
        isValidMessage: (msg: {
          origin: string;
          data: unknown;
          source: unknown;
        }) => boolean;
      };
    };
    return (origin: string) =>
      communicator.isValidMessage({
        origin,
        data: { id: '1', version: '1.0.0', success: true, data: {} },
        source: window.parent,
      });
  };

  it.each(GENUINE_ORIGINS)('handles a message from %s', (origin) => {
    expect(getValidator()(origin)).toBe(true);
  });

  it.each(SPOOFED_ORIGINS)('ignores a message from %s', (origin) => {
    expect(getValidator()(origin)).toBe(false);
  });
});
