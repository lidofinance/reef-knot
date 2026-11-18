import { useModalFocus as useHeadlessModalFocus } from 'reef-knot';
const getAdditionalContainers = () => {
  const selectRoot = document.getElementById('lido-ui-modal-root');
  return selectRoot ? [selectRoot] : [];
};
export const useModalFocus = () =>
  useHeadlessModalFocus({ getAdditionalContainers });
