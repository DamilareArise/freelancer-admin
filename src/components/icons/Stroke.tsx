import * as React from "react";

function Stroke(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={2} height={38} fill="none" {...props}>
      <path d="M1 .5v37" stroke="#F2F2F2" />
    </svg>
  );
}

const MemoStroke = React.memo(Stroke);
export default MemoStroke;
