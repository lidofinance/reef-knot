import React from 'react';

const Check = React.forwardRef(function Check(
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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.434 8.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0L7.293 12.98a1 1 0 111.414-1.414l2.02 2.02 5.293-5.293a1 1 0 011.414 0z"
      />
    </svg>
  );
});

export default Check;
