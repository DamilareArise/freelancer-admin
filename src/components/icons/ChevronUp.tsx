import * as React from "react"

function ChevronUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M7.636 5.382l-5.31 5.573a.5.5 0 000 .69l.006.006a.46.46 0 00.667 0l5-5.248 4.998 5.248a.46.46 0 00.667 0l.006-.006a.5.5 0 000-.69L8.36 5.382a.5.5 0 00-.724 0z"
        fill="#FAFAFA"
      />
    </svg>
  )
}

const MemoChevronUp = React.memo(ChevronUp)
export default MemoChevronUp
