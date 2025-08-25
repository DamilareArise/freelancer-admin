import * as React from "react";

function EllipsesVertical(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={4} height={18} fill="none" {...props}>
      <path
        d="M2 4a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z"
        fill="#000"
      />
    </svg>
  );
}

const MemoEllipsesVertical = React.memo(EllipsesVertical);
export default MemoEllipsesVertical;
