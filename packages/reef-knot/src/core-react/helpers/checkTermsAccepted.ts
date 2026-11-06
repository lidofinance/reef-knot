import { LS_KEY_TERMS_ACCEPTANCE } from '../constants/localStorage';

export const checkTermsAccepted = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage?.getItem(LS_KEY_TERMS_ACCEPTANCE) === 'true';
  }
  return false;
};
