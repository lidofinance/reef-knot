import React, { forwardRef } from 'react';

import {
  WalletInput,
  SearchIconWrap,
  InputClearButton,
  IconSearch,
  IconInputClear,
} from './styles';

type WalletModalInputProps = {
  value?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
};

export const WalletModalInput = forwardRef<
  HTMLInputElement,
  WalletModalInputProps
>(function WalletModalInput({ value, onChange, onClear }, inputRef) {
  return (
    <WalletInput
      ref={inputRef}
      value={value}
      onChange={onChange}
      placeholder="Wallet name"
      maxLength={20}
      leftDecorator={
        <SearchIconWrap>
          <IconSearch />
        </SearchIconWrap>
      }
      rightDecorator={
        value && (
          <InputClearButton onClick={onClear}>
            <IconInputClear />
          </InputClearButton>
        )
      }
    />
  );
});
