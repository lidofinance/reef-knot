import React, { ChangeEvent, FC } from 'react';
import { Checkbox, CheckboxProps, Link } from '@reef-knot/ui-react';
import { TermsStyle, TermsTextStyle } from './styles';
import { Metrics } from '../WalletsModal';

type WalletModalConnectTermsProps = Pick<
  CheckboxProps,
  'checked' | 'onChange'
> & { metrics?: Metrics; termsLink: string; privacyNoticeLink: string };

export const Terms: FC<WalletModalConnectTermsProps> = ({
  onChange,
  metrics,
  checked,
  termsLink,
  privacyNoticeLink,
}) => {
  const onClickTermsAccept =
    metrics?.events?.click?.handlers.onClickTermsAccept;

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    if (e.target.checked) {
      onClickTermsAccept?.();
    }
  };

  return (
    <TermsStyle>
      <Checkbox onChange={handleCheckboxChange} checked={checked} />
      <TermsTextStyle>
        I certify that I have read and accept the updated{' '}
        <Link href={termsLink}>Terms&nbsp;of&nbsp;Use</Link> and{' '}
        <Link href={privacyNoticeLink}>Privacy&nbsp;Notice</Link>.
      </TermsTextStyle>
    </TermsStyle>
  );
};
