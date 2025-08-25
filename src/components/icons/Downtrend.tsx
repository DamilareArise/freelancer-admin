import * as React from "react";

function Downtrend(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 12" fill="none" {...props}>
      <path
        d="M17.75 6v5a.625.625 0 01-.625.625h-5a.625.625 0 110-1.25h3.492L9.625 4.384 6.943 7.068a.625.625 0 01-.885 0L.433 1.443a.625.625 0 01.885-.885L6.5 5.742l2.683-2.684a.625.625 0 01.885 0L16.5 9.492V6a.625.625 0 011.25 0z"
        fill="#EF4444"
      />
    </svg>
  );
}

const MemoDowntrend = React.memo(Downtrend);
export default MemoDowntrend;

