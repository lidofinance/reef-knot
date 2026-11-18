import React, { ForwardedRef, forwardRef } from 'react';
import { Transition } from 'react-transition-group';
import { useMergeRefs } from '../../hooks';
import { DEFAULT_DURATION } from './constants';
import { TransitionWrapperProps, TransitionInnerProps } from './types';

type WrappedProps<T> = Omit<T, keyof TransitionInnerProps> &
  TransitionWrapperProps;
type RemovedTransitionProps = {
  mountOnEnter?: unknown;
  unmountOnExit?: unknown;
};

export default function withTransition<
  P extends TransitionInnerProps,
  E extends HTMLElement,
>(
  Component: React.ComponentType<P>,
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<WrappedProps<P>> & React.RefAttributes<E>
> {
  function Wrapped(props: WrappedProps<P>, externalRef: ForwardedRef<E>) {
    const {
      in: state = false,
      timeout = DEFAULT_DURATION,
      // Drop these if an untyped caller still passes them.
      mountOnEnter: _mountOnEnter,
      unmountOnExit: _unmountOnExit,
      appear = true,
      enter = true,
      exit = true,
      addEndListener,
      onEnter,
      onEntering,
      onEntered,
      onExit,
      onExiting,
      onExited,
      ...rest
    } = props as WrappedProps<P> & RemovedTransitionProps;

    const transitionProps = {
      in: state,
      timeout,
      // Always unmount on exit. An exited child stays mounted as an
      // invisible layer that still blocks clicks, focus, and scroll.
      mountOnEnter: true,
      unmountOnExit: true,
      appear,
      enter,
      exit,
      addEndListener,
      onEnter,
      onEntering,
      onEntered,
      onExit,
      onExiting,
      onExited,
    };

    const ref = useMergeRefs([externalRef]);

    return (
      <Transition {...transitionProps} nodeRef={ref}>
        {(status) => (
          <Component
            {...(rest as P)}
            duration={timeout}
            transitionStatus={status}
            ref={ref}
          />
        )}
      </Transition>
    );
  }

  return forwardRef(Wrapped);
}
