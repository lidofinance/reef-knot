import { ReactNode } from 'react';

const MainContainer = (props: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '50px 20px 20px',
    }}
  >
    {props.children}
  </div>
);

export default MainContainer;
