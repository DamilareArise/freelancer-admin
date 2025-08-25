import * as React from "react";

function DarkLocation(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={16} height={16} fill="none" {...props}>
      <g clipPath="url(#prefix__clip0_3_88088)" fill="#CCCBCB">
        <path d="M7.973 16.007l-.465-.398c-.64-.537-6.235-5.368-6.235-8.902a6.7 6.7 0 0113.4 0c0 3.534-5.595 8.365-6.233 8.904l-.467.396zm0-14.55a5.257 5.257 0 00-5.25 5.25c0 2.22 3.44 5.767 5.25 7.39 1.809-1.624 5.25-5.172 5.25-7.39a5.257 5.257 0 00-5.25-5.25z" />
        <path d="M7.976 9.362a2.656 2.656 0 110-5.311 2.656 2.656 0 010 5.31zm0-3.983a1.328 1.328 0 100 2.655 1.328 1.328 0 000-2.655z" />
      </g>
      <defs>
        <clipPath id="prefix__clip0_3_88088">
          <path fill="#fff" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

const MemoDarkLocation = React.memo(DarkLocation);
export default MemoDarkLocation;
