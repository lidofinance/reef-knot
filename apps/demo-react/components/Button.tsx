import * as React from "react";
import { ReactProps } from '../types'

export const Button = (props: ReactProps) => {
  return <button>{props.children}</button>;
};
