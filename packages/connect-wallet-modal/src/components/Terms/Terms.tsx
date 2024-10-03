import React, { ChangeEvent, FC } from 'react';
import { Checkbox, Link } from '@reef-knot/ui-react';
import { useReefKnotModal } from '@reef-knot/core-react';
import type { ReefKnotWalletsModalConfig } from '@reef-knot/types';
import { TermsStyle, TermsTextStyle } from './styles';

const TERMS_LINK_DEFAULT = 'https://lido.fi/terms-of-use';
const PRIVACY_NOTICE_LINK_DEFAULT = 'https://lido.fi/privacy-notice';

export type TermsProps = {
  config: ReefKnotWalletsModalConfig;
};

export const Terms: FC<TermsProps> = ({ config }) => {
  const {
    metrics,
    linkTerms = TERMS_LINK_DEFAULT,
    linkPrivacyNotice = PRIVACY_NOTICE_LINK_DEFAULT,
  } = config;

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
        <Link href={linkTerms}>Terms&nbsp;of&nbsp;Use</Link> and{' '}
        <Link href={linkPrivacyNotice}>Privacy&nbsp;Notice</Link>.
      </TermsTextStyle>
    </TermsStyle>
  );
};
