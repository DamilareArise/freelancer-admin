import * as React from "react"

function SupportMessage(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 16" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.002 1.053a50.6 50.6 0 018.099.04l1.624.138a2.666 2.666 0 012.408 2.252l.102.67a20.7 20.7 0 01-.096 6.834 2.34 2.34 0 01-2.305 1.923H5.858c-.207 0-.41.051-.592.15L1.355 15.16a.75.75 0 01-1.105-.66V5.982a4.93 4.93 0 014.559-4.915l.193-.015zM5 6a1.25 1.25 0 100 2.5A1.25 1.25 0 005 6zm4 0a1.25 1.25 0 100 2.5A1.25 1.25 0 009 6zm2.75 1.25a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z"
        fill="currentColor"
      />
    </svg>
  )
}

const MemoSupportMessage = React.memo(SupportMessage)
export default MemoSupportMessage
