import {
  createContext,
  useMemo,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

import { DEFAULT_VALUE, ValueType } from 'components';

import invariant from 'tiny-invariant';

const context = createContext<{
  inputValue: ValueType;
  setInputValue: (value: ValueType) => void;
} | null>(null);

export const useInputValueSDK = () => {
  const value = useContext(context);
  invariant(value, 'useValueSDK was used outside ValueProvider');
  return value;
};

export const InputValueProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [inputValue, setInputValue] = useState<ValueType>(DEFAULT_VALUE);

  const value = useMemo(
    () => ({
      inputValue,
      setInputValue,
    }),
    [inputValue],
  );

  return <context.Provider value={value}>{children}</context.Provider>;
};
