import * as React from "react"

function Support(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5.52 10.26l.927.464A1 1 0 017 11.62v4.764a1 1 0 01-.553.894l-.928.464a.926.926 0 01-.987-.084C3.69 17.002 2 15.501 2 14.001S3.689 11 4.532 10.344a.926.926 0 01.987-.084z"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 10.5V10a8 8 0 1116 0v.5M20 17.5v.5a4 4 0 01-4 4h-4"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.468 10.344a.926.926 0 00-.987-.084l-.928.464a1 1 0 00-.553.895v4.764a1 1 0 00.553.894l.928.464c.32.16.704.137.987-.084.843-.655 2.532-2.156 2.532-3.656S20.311 11 19.468 10.344z"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MemoSupport = React.memo(Support)
export default MemoSupport
