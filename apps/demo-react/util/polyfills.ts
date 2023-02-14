import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  window.global = window.global ?? window;
  window.Buffer = window.Buffer ?? Buffer;
  window.process = window.process ?? { env: {} }; // Minimal process polyfill
}

export {};
