import React from 'react';

const Close = React.forwardRef(function Close(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>,
) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={svgRef}
      {...props}
    >
      <path d="M17.707 7.707a1 1 0 00-1.414-1.414L12 10.586 7.707 6.293a1 1 0 00-1.414 1.414L10.586 12l-4.293 4.293a1 1 0 101.414 1.414L12 13.414l4.293 4.293a1 1 0 001.414-1.414L13.414 12l4.293-4.293z" />
    </svg>
  );
});

export default Close;
