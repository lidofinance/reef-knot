import React, { ReactElement } from 'react';

const LidoModalLogo = (): ReactElement => {
  return (
    <div style={{ width: '96px', height: '78px' }}>
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2_9993)">
          <rect x="16" y="12" width="64" height="64" rx="32" fill="white" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M48.0085 28L55.9264 40.3963L48.0081 45.0118L40.0907 40.3962L48.0085 28ZM42.5145 39.81L48.0085 31.2086L53.5025 39.8101L48.0081 43.0126L42.5145 39.81Z"
            fill="#00A3FF"
          />
          <path
            d="M47.9968 47.7365L38.8118 42.3819L38.561 42.7746C35.7321 47.2037 36.3639 53.0041 40.08 56.7203C44.453 61.0932 51.543 61.0932 55.916 56.7203C59.6321 53.0041 60.2639 47.2037 57.4349 42.7746L57.1841 42.3818L47.9972 47.7368L47.9968 47.7365Z"
            fill="#00A3FF"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2_9993"
            x="0"
            y="0"
            width="96"
            height="96"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="8" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0.0392157 0 0 0 0 0.239216 0 0 0 0.16 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_2_9993"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2_9993"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default LidoModalLogo;
