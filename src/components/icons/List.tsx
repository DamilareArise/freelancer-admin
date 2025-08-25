import * as React from "react"

function List(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M8 5h12"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M4 5h.009M4 12h.009M4 19h.009"
        className="stroke-current"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12h12M8 19h12"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  )
}

const MemoList = React.memo(List)
export default MemoList
