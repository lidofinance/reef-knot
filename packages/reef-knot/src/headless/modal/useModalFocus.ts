import React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { useInterceptFocus } from './useInterceptFocus';
import { FOCUSABLE_ELEMENTS } from './constants';

export const useModalFocus = (options?: {
  getAdditionalContainers?: () => HTMLElement[];
}): React.RefObject<HTMLDivElement> => {
  const getAdditionalContainers = options?.getAdditionalContainers;
  const modalRef = useRef<HTMLDivElement>(null);

  const getFocusableNodes = useCallback(() => {
    const containers = [
      modalRef.current,
      ...(getAdditionalContainers?.() ?? []),
    ];
    const nodes = containers.flatMap((container) =>
      Array.from(
        container?.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')) ?? [],
      ),
    );

    return Array.from(nodes).filter(
      (node): node is HTMLElement =>
        node &&
        node instanceof HTMLElement &&
        node.offsetParent !== null &&
        !node.matches(':disabled') &&
        !node.closest('[aria-hidden="true"], [inert]'),
    );
  }, [getAdditionalContainers]);

  const handleRetainFocus = useCallback(
    (event: KeyboardEvent) => {
      const focusableNodes = getFocusableNodes();

      if (focusableNodes.length === 0) return;

      const currentElement = document.activeElement;
      const focusedItemIndex =
        currentElement instanceof HTMLElement &&
        focusableNodes.indexOf(currentElement);

      if (
        event.shiftKey &&
        (focusedItemIndex === 0 || focusedItemIndex === -1)
      ) {
        focusableNodes[focusableNodes.length - 1].focus();
        event.preventDefault();
      }

      if (
        !event.shiftKey &&
        focusableNodes.length > 0 &&
        (focusedItemIndex === focusableNodes.length - 1 ||
          focusedItemIndex === -1)
      ) {
        focusableNodes[0].focus();
        event.preventDefault();
      }
    },
    [getFocusableNodes],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.code === 'Tab' || event.key === 'Tab') &&
        !event.defaultPrevented
      )
        handleRetainFocus(event);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleRetainFocus]);

  const [interceptFocus, restoreFocus] = useInterceptFocus();

  useEffect(() => {
    if (!modalRef.current) return;

    interceptFocus(modalRef.current);
    return restoreFocus;
  }, [interceptFocus, restoreFocus]);

  return modalRef;
};
