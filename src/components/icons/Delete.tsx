import * as React from "react";

function Delete(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={16} height={16} fill="none" {...props}>
      <path
        d="M13 3.668l-.667 11H3.667L3 3.668M1.336 3.665h4m0 0l1-2.333h3.333l1 2.333m-5.333 0h5.333m4 0h-4M6.336 11V7M9.664 11V7"
        stroke="#C41111"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoDelete = React.memo(Delete);
export default MemoDelete;
