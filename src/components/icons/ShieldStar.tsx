import * as React from "react"

function ShieldStar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M8 .668L2 3.335v4c0 3.7 2.56 7.16 6 8 3.44-.84 6-4.3 6-8v-4L8 .668zm2.053 10L8 9.435l-2.047 1.233.54-2.333-1.806-1.56 2.386-.207.927-2.2.927 2.193 2.386.207-1.806 1.567.546 2.333z"
        className="fill-current"
      />
    </svg>
  )
}

const MemoShieldStar = React.memo(ShieldStar)
export default MemoShieldStar
