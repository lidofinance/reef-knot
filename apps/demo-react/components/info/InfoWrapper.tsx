import { ReactNode } from 'react';

export const InfoWrapper = (props: { children: ReactNode }) => (
  <div
    style={{
      overflow: 'auto',
      alignSelf: 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '300px',
      marginTop: '80px',
      marginRight: '20px',
      padding: '10px',
      background: 'antiquewhite',
      borderRadius: '10px',
    }}
  >
    {props.children}
  </div>
);
