import { useCallback, useLayoutEffect } from 'react';

const getScrollbarSize = (): number => {
  const tempDiv = document.createElement('div');

  Object.assign(tempDiv.style, {
    position: 'absolute',
    left: '-9000px',
    width: '100px',
    height: '100px',
    overflow: 'scroll',
  });

  document.body.appendChild(tempDiv);
  const scrollbarSize = tempDiv.offsetWidth - tempDiv.clientWidth;
  document.body.removeChild(tempDiv);

  return scrollbarSize;
};

const isVerticalScroll = (element: HTMLElement): boolean => {
  const isBody = document.body === element;

  return isBody
    ? document.documentElement.scrollHeight > window.innerHeight
    : element.scrollHeight > element.clientHeight;
};

const getPaddingRight = (element: HTMLElement): number => {
  return parseInt(window.getComputedStyle(element).paddingRight, 10) || 0;
};

const setStyleProperty = (
  element: HTMLElement,
  property: string,
  value?: string,
): void => {
  if (value) {
    element.style.setProperty(property, value);
  } else {
    element.style.removeProperty(property);
  }
};

// Save the old inline values, so the unlock step can return them.
const setStyles = (
  element: HTMLElement,
  styles: Record<string, string>,
): (() => void) => {
  const previous = Object.keys(styles).map(
    (property) => [property, element.style.getPropertyValue(property)] as const,
  );
  Object.entries(styles).forEach(([property, value]) =>
    setStyleProperty(element, property, value),
  );
  return () =>
    previous.forEach(([property, value]) =>
      setStyleProperty(element, property, value),
    );
};

const isTouchDevice = (): boolean =>
  typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;

// iOS Safari ignores `overflow: hidden` on body.
// The page scrolls on touch and when the keyboard opens.
// A fixed body cannot scroll. Keep the scroll position in `top` and restore it on unlock.
const pinBody = (): (() => void) => {
  const { scrollX, scrollY } = window;
  const unlockHtml = setStyles(document.documentElement, {
    overflow: 'hidden',
  });
  const unlockBody = setStyles(document.body, {
    position: 'fixed',
    top: `-${scrollY}px`,
    left: '0',
    right: '0',
  });

  return () => {
    unlockBody();
    unlockHtml();
    window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
  };
};

export const useLockScroll = (element?: HTMLElement): void => {
  const lockScroll = useCallback(() => {
    const target =
      element ?? (typeof document === 'undefined' ? undefined : document.body);
    if (!target || !isVerticalScroll(target)) return;

    const unlockTarget = setStyles(target, {
      'padding-right': `${getPaddingRight(target) + getScrollbarSize()}px`,
      overflow: 'hidden',
    });
    if (target !== document.body || !isTouchDevice()) return unlockTarget;

    const unpinBody = pinBody();
    return () => {
      unlockTarget();
      unpinBody();
    };
  }, [element]);

  useLayoutEffect(() => {
    const unlockScroll = lockScroll();
    return unlockScroll;
  }, [lockScroll]);
};
