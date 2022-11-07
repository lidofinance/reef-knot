import * as React from 'react';
import { ReactProps } from '../types';

export const Button = (props: ReactProps) => {
  return <button type="button">{props.children}</button>;
};
