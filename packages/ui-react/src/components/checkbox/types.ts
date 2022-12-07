import { CommonComponentProps } from '../../utils';

export type CheckboxProps = CommonComponentProps<
  'input',
  {
    wrapperRef?: React.RefObject<HTMLLabelElement>;
    children?: never;
    label?: string;
  }
>;
