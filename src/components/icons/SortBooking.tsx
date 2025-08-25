import * as React from "react";

function SortBooking(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} fill="none" {...props}>
      <path d="M8 16H4l6 6V2H8v14zm6-11v17h2V8h4l-6-6v3z" fill="#2B2928" />
    </svg>
  );
}

const MemoSortBooking = React.memo(SortBooking);
export default MemoSortBooking;
