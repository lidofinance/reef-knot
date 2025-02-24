import React, { ChangeEvent, FC, useCallback } from 'react';
import { Checkbox, Link } from '@reef-knot/ui-react';
import { useReefKnotModal } from '@reef-knot/core-react';
import type { ReefKnotWalletsModalConfig } from '@reef-knot/types';
import { TermsStyle, TermsTextStyle } from './styles';

export type TermsProps = {
  config: ReefKnotWalletsModalConfig;
};

export const Terms: FC<TermsProps> = ({ config }) => {
  const { linkTerms, linkPrivacyNotice, onClickTermsAccept } = config;
  const { setTermsChecked, termsChecked } = useReefKnotModal();

  const handleCheckboxChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const isAccepted = e.currentTarget.checked;
      setTermsChecked(isAccepted);
      if (isAccepted) {
        onClickTermsAccept?.({ isAccepted });
      }
    },
    [setTermsChecked, onClickTermsAccept],
  );

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
