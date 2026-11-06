import { useEscape as useHeadlessEscape } from 'reef-knot';
export const useEscape = (callback?: () => void) =>
  useHeadlessEscape(() => {
    if (
      document
        .getElementById('lido-ui-modal-root')
        ?.contains(document.activeElement)
    )
      return;
    callback?.();
  });
