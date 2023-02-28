import { ForwardedRef, forwardRef } from 'react';
import styled from '../../utils/styledWrapper.js';
import { CheckboxProps } from './types';
import {
  CheckboxWrapperStyle,
  CheckboxInputStyle,
  CheckboxIconStyle,
} from './CheckboxStyles';

const Box = styled.div`
  margin-left: 8px;
`;

const Text = styled.p`
  line-height: 1.5em;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-decoration: none;
  color: ${(props) => (props.color === 'secondary' ? '#7a8aa0' : '#273852')};
`;

function Checkbox(
  props: CheckboxProps,
  inputRef?: ForwardedRef<HTMLInputElement>,
) {
  const { className, style, wrapperRef, children, label, ...inputProps } =
    props;
  const { disabled } = inputProps;
  const wrapperProps = { className, style };

  return (
    <CheckboxWrapperStyle {...wrapperProps} ref={wrapperRef}>
      <CheckboxInputStyle type="checkbox" {...inputProps} ref={inputRef} />
      <CheckboxIconStyle />
      {label && (
        <Box>
          <Text color={disabled ? 'secondary' : 'default'}>{label}</Text>
        </Box>
      )}
    </CheckboxWrapperStyle>
  );
}

export default forwardRef(Checkbox);
