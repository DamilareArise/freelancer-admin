import * as React from "react"

function Booking(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 21.999a2 2 0 01-2-2V4a2 2 0 012.001-2l14 .01a2 2 0 011.999 2V20a2 2 0 01-2 2H5zM15 9.5H7m3.556 5H7"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MemoBooking = React.memo(Booking)
export default MemoBooking
