import { FC } from 'react';
import { Checkbox, CheckboxProps, Link } from '@lidofinance/lido-ui';
import { TermsStyle, TermsTextStyle } from './styles';

type WalletModalConnectTermsProps = Pick<CheckboxProps, 'checked' | 'onChange'>;

export const Terms: FC<WalletModalConnectTermsProps> = (props) => (
  <TermsStyle>
    <Checkbox onChange={props.onChange} checked={props.checked} />
    <TermsTextStyle>
      I have read and accept{' '}
      <Link href="https://lido.fi/terms-of-use">
        Terms&nbsp;of&nbsp;Service
      </Link>{' '}
      and <Link href="https://lido.fi/privacy-notice">Privacy&nbsp;Notice</Link>
      .
    </TermsTextStyle>
  </TermsStyle>
);
