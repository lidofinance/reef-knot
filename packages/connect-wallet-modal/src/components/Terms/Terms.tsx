import React, { ChangeEvent, FC } from 'react';
import { Checkbox, Link } from '@reef-knot/ui-react';
import { TermsStyle, TermsTextStyle } from './styles';
import type { MetricsProp } from '../WalletsModal';
import { useReefKnotModal } from '@reef-knot/core-react';

export type WalletModalConnectTermsProps = {
  metrics?: MetricsProp;
  termsLink: string;
  privacyNoticeLink: string;
};

export const Terms: FC<WalletModalConnectTermsProps> = ({
  metrics,
  termsLink,
  privacyNoticeLink,
}) => {
  const { setTermsChecked, termsChecked } = useReefKnotModal();
  const onClickTermsAccept =
    metrics?.events?.click?.handlers.onClickTermsAccept;

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTermsChecked(e.currentTarget.checked);
    if (e.target.checked) {
      onClickTermsAccept?.();
    }
  };

  return (
    <TermsStyle>
      <Checkbox onChange={handleCheckboxChange} checked={termsChecked} />
      <TermsTextStyle>
        I certify that I have read and accept the updated{' '}
        <Link href={termsLink}>Terms&nbsp;of&nbsp;Use</Link> and{' '}
        <Link href={privacyNoticeLink}>Privacy&nbsp;Notice</Link>.
      </TermsTextStyle>
    </TermsStyle>
  );
};
