import { ReactNode } from 'react';

const SettingsWrapper = (props: { children: ReactNode }) => (
  <div
    style={{
      alignSelf: 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '300px',
      marginTop: '80px',
      padding: '10px',
      background: 'antiquewhite',
      borderRadius: '10px',
    }}
  >
    {props.children}
  </div>
);

export default SettingsWrapper;
