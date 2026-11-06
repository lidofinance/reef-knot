import * as dynamics from '../env-dynamics.mjs';

declare global {
  interface Window {
    __env__?: Partial<typeof dynamics>;
  }
}

const runtime = typeof window !== 'undefined' ? window.__env__ : undefined;

// Runtime values override build-time defaults. Older or partially generated
// window-env.js files must not remove the RPC map required during hydration.
export default {
  ...dynamics,
  ...runtime,
  rpcProviderUrls: {
    ...dynamics.rpcProviderUrls,
    ...runtime?.rpcProviderUrls,
  },
};
