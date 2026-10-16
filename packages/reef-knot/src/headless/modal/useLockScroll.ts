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

export const useLockScroll = (element?: HTMLElement): void => {
  const lockScroll = useCallback(() => {
    const target =
      element ?? (typeof document === 'undefined' ? undefined : document.body);
    if (!target || !isVerticalScroll(target)) return;

    const previousValues = {
      paddingRight: target.style.paddingRight,
      overflow: target.style.overflow,
    };

    const newPaddingRight = getPaddingRight(target) + getScrollbarSize();
    setStyleProperty(target, 'padding-right', `${newPaddingRight}px`);
    setStyleProperty(target, 'overflow', 'hidden');

    const unlockScroll = () => {
      const { paddingRight, overflow } = previousValues;

      setStyleProperty(target, 'padding-right', paddingRight);
      setStyleProperty(target, 'overflow', overflow);
    };

    return unlockScroll;
  }, [element]);

  useLayoutEffect(() => {
    const unlockScroll = lockScroll();
    return unlockScroll;
  }, [lockScroll]);
};
