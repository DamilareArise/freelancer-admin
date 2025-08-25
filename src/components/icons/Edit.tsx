import * as React from "react"

function Edit(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 21h16M5.666 13.187A2.28 2.28 0 005 14.797V18h3.223c.604 0 1.183-.24 1.61-.668l9.5-9.505a2.28 2.28 0 000-3.22l-.938-.94a2.276 2.276 0 00-3.222.001l-9.507 9.52z"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MemoEdit = React.memo(Edit)
export default MemoEdit
