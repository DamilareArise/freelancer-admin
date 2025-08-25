import * as React from "react"

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 15" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 7.5a6.25 6.25 0 1112.5 0 6.25 6.25 0 01-12.5 0zM7.75 5A.625.625 0 006.5 5v3.125a.625.625 0 00.625.625h3.125a.625.625 0 100-1.25h-2.5V5z"
        fill="#F59E0B"
      />
    </svg>
  )
}

const MemoClock = React.memo(Clock)
export default MemoClock
