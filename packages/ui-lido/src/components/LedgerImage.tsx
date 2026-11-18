import React, { useId } from 'react';

// Vector device illustration shared by the connection and error screens.
export function LedgerImage({ error = false }: { error?: boolean }) {
  const id = useId();
  const fillId = `${id}-fill`;
  const strokeId = `${id}-stroke`;

  return (
    <div className="rk-lido-ledger-image" aria-hidden="true">
      <svg
        width="260"
        height="48"
        viewBox="0 0 260 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="49"
          y="6"
          width="208"
          height="36"
          rx="5"
          fill="var(--lido-app-ui-color-background-default)"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M74 24C74 20.134 70.866 17 67 17C63.134 17 60 20.134 60 24C60 27.866 63.134 31 67 31C70.866 31 74 27.866 74 24Z"
          fill="var(--lido-app-ui-color-background-default)"
          stroke="currentColor"
        />
        <rect
          x="87.5967"
          y="10.5967"
          width="50.8067"
          height="26.8067"
          rx="3.40333"
          fill="var(--lido-app-ui-color-background-surface)"
          stroke="currentColor"
          strokeWidth="1.19333"
        />
        <path
          d="M149 24C149 14.0589 157.059 6 167 6L252.962 6C255.192 6 257 7.80795 257 10.0382L257 37.9618C257 40.192 255.192 42 252.962 42L167 42C157.059 42 149 33.9411 149 24Z"
          fill="var(--lido-app-ui-color-background-surface)"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M174 24C174 20.134 170.866 17 167 17C163.134 17 160 20.134 160 24C160 27.866 163.134 31 167 31C170.866 31 174 27.866 174 24Z"
          fill="var(--lido-app-ui-color-background-default)"
          stroke="currentColor"
        />
        <path
          d="M38 18L47.6133 18C48.3792 18 49 18.6208 49 19.3867V28.6133C49 29.3792 48.3792 30 47.6133 30H38C36.3431 30 35 28.6569 35 27V21C35 19.3431 36.3431 18 38 18Z"
          fill="var(--lido-app-ui-color-background-surface)"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M27.3867 20.5H33.8067C34.1896 20.5 34.5 20.8104 34.5 21.1933V26.8067C34.5 27.1896 34.1896 27.5 33.8067 27.5H27.3867C26.3447 27.5 25.5 26.6553 25.5 25.6133V22.3867C25.5 21.3447 26.3447 20.5 27.3867 20.5Z"
          fill="var(--lido-app-ui-color-background-surface)"
          stroke="currentColor"
        />
        <path
          d="M0.5 22.5L25.5 22.5V25.5L0.5 25.5L0.5 22.5Z"
          fill={`url(#${fillId})`}
          stroke={`url(#${strokeId})`}
        />
        {error && (
          <path
            d="M117 20L109 28M109 20L117 28"
            stroke="var(--lido-app-ui-color-text-error)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        <defs>
          <linearGradient
            id={fillId}
            x1="26.3514"
            y1="24"
            x2="-1.65255e-07"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--lido-app-ui-color-background-surface)" />
            <stop
              offset="1"
              stopColor="var(--lido-app-ui-color-background-surface)"
              stopOpacity="0"
            />
          </linearGradient>
          <linearGradient
            id={strokeId}
            x1="26"
            y1="26"
            x2="2.10811"
            y2="26"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
