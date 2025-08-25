import * as React from "react";

function Ellipses(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={18} height={4} fill="none" {...props}>
      <path
        d="M4 2a2 2 0 11-4 0 2 2 0 014 0zm7 0a2 2 0 11-4 0 2 2 0 014 0zm7 0a2 2 0 11-4 0 2 2 0 014 0z"
        fill="#000"
      />
    </svg>
  );
}

const MemoEllipses = React.memo(Ellipses);
export default MemoEllipses;
