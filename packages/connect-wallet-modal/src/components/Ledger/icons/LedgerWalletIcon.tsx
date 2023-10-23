import React, { ReactElement } from 'react';

export const LedgerWalletIcon = (): ReactElement => {
  return (
    <div style={{ width: '24px', height: '24px' }}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_71_13201"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <path
            d="M0 12C0 5.37258 5.37258 0 12 0V0C18.6274 0 24 5.37258 24 12V12C24 18.6274 18.6274 24 12 24V24C5.37258 24 0 18.6274 0 12V12Z"
            fill="#C4C4C4"
          />
        </mask>
        <g mask="url(#mask0_71_13201)">
          <rect x="3" y="7" width="18" height="13" rx="3" fill="#7A8AA0" />
          <rect
            x="3.5"
            y="4.5"
            width="14"
            height="14"
            rx="3.5"
            stroke="#7A8AA0"
          />
          <circle cx="17.5" cy="13.5" r="1.5" fill="#EFF2F6" />
        </g>
      </svg>
    </div>
  );
};
