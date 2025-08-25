import * as React from "react"

function Notification(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M2.997 6.336v1.781c0 .354-.14.693-.39.943l-.943.943v.92c0 .253.142.486.373.588 1.061.468 3.14 1.158 5.96 1.158 2.821 0 4.9-.69 5.961-1.159a.635.635 0 00.373-.586v-.921l-.943-.943c-.25-.25-.39-.59-.39-.943V6.336a5 5 0 00-10 0z"
        stroke="#585C5F"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.33 12.664c0 1.105-1.06 2-2.351 2-1.293 0-2.315-.895-2.315-2"
        stroke="#585C5F"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MemoNotification = React.memo(Notification)
export default MemoNotification
