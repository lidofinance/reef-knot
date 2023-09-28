import styled from '../../utils/styledWrapper.js';
import Check from '../../icons/Check';

export const CheckboxWrapperStyle = styled.label`
  flex-shrink: 0;
  display: inline-flex;
  position: relative;
  overflow: hidden;
  line-height: 0;
  align-items: center;
`;

export const CheckboxIconStyle = styled(Check)`
  height: 24px;
  width: 24px;
  border-radius: 4px;
  transition:
    box-shadow 0.1s ease,
    background-color 0.1s ease;
  fill: ${({ theme }) => theme.colors.primaryContrast};
`;

export const CheckboxInputStyle = styled.input`
  width: 1px;
  height: 1px;
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);

  &:not(:disabled) ~ * {
    cursor: pointer;
  }

  label:hover &:not(:disabled):not(:checked) + ${CheckboxIconStyle} {
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.borderHover};
  }

  & + ${CheckboxIconStyle} {
    background-color: ${({ theme }) => theme.colors.controlBg};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border};

    path {
      opacity: 0;
    }
  }

  &:checked + ${CheckboxIconStyle} {
    background-color: ${({ theme }) => theme.colors.primary};
    box-shadow: none;

    path {
      opacity: 1;
    }
  }

  &:disabled + ${CheckboxIconStyle} {
    opacity: 0.5;
    cursor: default;
  }

  &:focus-visible + ${CheckboxIconStyle} {
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible:checked + ${CheckboxIconStyle} {
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.borderHover};
  }
`;
