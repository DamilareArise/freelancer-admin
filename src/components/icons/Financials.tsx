import * as React from "react"

function Financials(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M14.5 12a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M19 11.138a13.675 13.675 0 00-1-.107m-12 1.93c-.341-.023-.675-.059-1-.106"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4.5c-5 2.25-10 0-10 0v15s5 2.25 10 0c0 0 5-2.25 10 0v-15c-5-2.25-10 0-10 0z"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MemoFinancials = React.memo(Financials)
export default MemoFinancials
