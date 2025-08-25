import * as React from "react"

function PlusCircleFilled(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M8 1a7.086 7.086 0 00-7 7 7.086 7.086 0 007 7 7.086 7.086 0 007-7 7.086 7.086 0 00-7-7zm4 7.5H8.5V12h-1V8.5H4v-1h3.5V4h1v3.5H12v1z"
        fill="#fff"
      />
    </svg>
  )
}

const MemoPlusCircleFilled = React.memo(PlusCircleFilled)
export default MemoPlusCircleFilled
