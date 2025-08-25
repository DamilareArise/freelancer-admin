import * as React from "react";

function Filter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} fill="none" {...props}>
      <path
        d="M17.706 9.998H7.41m-3.634 0H2.289m1.487 0a1.817 1.817 0 113.633 0 1.817 1.817 0 01-3.633 0zm13.93 5.506h-4.79m0 0a1.818 1.818 0 01-3.102 1.285 1.817 1.817 0 01-.532-1.285m3.634 0a1.816 1.816 0 00-3.634 0m0 0H2.289M17.706 4.492h-2.588m-3.634 0H2.29m9.195 0a1.817 1.817 0 113.633 0 1.817 1.817 0 01-3.633 0z"
        stroke="#2B2928"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
    </svg>
  );
}

const MemoFilter = React.memo(Filter);
export default MemoFilter;
