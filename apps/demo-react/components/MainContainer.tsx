import { ReactNode } from 'react';

const MainContainer = (props: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      padding: '50px 20px 20px',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    {props.children}
  </div>
);

export default MainContainer;
