import * as React from "react"

function Overview(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9 2H3a1 1 0 00-1 1v8a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1zM9 16H3a1 1 0 00-1 1v4a1 1 0 001 1h6a1 1 0 001-1v-4a1 1 0 00-1-1zM21 12h-6a1 1 0 00-1 1v8a1 1 0 001 1h6a1 1 0 001-1v-8a1 1 0 00-1-1zM21 2h-6a1 1 0 00-1 1v4a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MemoOverview = React.memo(Overview)
export default MemoOverview
