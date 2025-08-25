import * as React from "react"

function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" {...props}>
      <path
        d="M6 6.375A2.879 2.879 0 013.125 3.5 2.879 2.879 0 016 .625 2.879 2.879 0 018.875 3.5 2.879 2.879 0 016 6.375zm0-5A2.13 2.13 0 003.875 3.5 2.13 2.13 0 006 5.625 2.13 2.13 0 008.125 3.5 2.13 2.13 0 006 1.375zM10.293 11.375A.378.378 0 019.918 11c0-1.725-1.76-3.125-3.92-3.125s-3.92 1.4-3.92 3.125c0 .205-.17.375-.375.375A.378.378 0 011.328 11c0-2.135 2.095-3.875 4.67-3.875 2.575 0 4.67 1.74 4.67 3.875 0 .205-.17.375-.375.375z"
        className="fill-current"
      />
    </svg>
  )
}

const MemoUser = React.memo(User)
export default MemoUser
