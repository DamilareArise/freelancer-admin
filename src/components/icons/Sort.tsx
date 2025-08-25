import * as React from "react"

function Sort(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <path
        d="M2.25 5.25h13.5M4.5 9h9M7.5 12.75h3"
        stroke="#79828D"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  )
}

const MemoSort = React.memo(Sort)
export default MemoSort
