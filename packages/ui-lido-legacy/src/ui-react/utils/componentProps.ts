export type CommonComponentProps<
  T extends keyof JSX.IntrinsicElements,
  Props extends object = NonNullable<unknown>,
> = Props &
  Omit<
    JSX.IntrinsicElements[T] & {
      as?: keyof JSX.IntrinsicElements;
      forwardedAs?: keyof JSX.IntrinsicElements;
    },
    'ref' | keyof Props
  >;
