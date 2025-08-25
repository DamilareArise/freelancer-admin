import * as React from "react";

function Uptrend(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 19 12" fill="none" {...props}>
      <path
        d="M18.25 1.375v5a.625.625 0 11-1.25 0V2.884l-6.432 6.433a.624.624 0 01-.885 0L7 6.634l-5.182 5.183a.625.625 0 01-.885-.884l5.625-5.625a.625.625 0 01.885 0l2.682 2.683L16.117 2h-3.492a.625.625 0 010-1.25h5a.625.625 0 01.625.625z"
        fill="#13DD9A"
      />
    </svg>
  );
}

const MemoUptrend = React.memo(Uptrend);
export default MemoUptrend;
