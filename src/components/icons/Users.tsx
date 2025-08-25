import * as React from "react"

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M15 8a3 3 0 11-6 0 3 3 0 016 0zM16 4a3 3 0 011.218 5.742M14 14h-4a4 4 0 00-4 4v2h12v-2a4 4 0 00-4-4zM18 13a4 4 0 014 4v2h-1.5M8 4a3 3 0 00-1.218 5.742M6 13a4 4 0 00-4 4v2h1.5"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MemoUsers = React.memo(Users)
export default MemoUsers
