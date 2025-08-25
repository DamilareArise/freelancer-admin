import * as React from "react"

function Security(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" {...props}>
      <path
        d="M6.003 11.38c-.545 0-1.085-.16-1.51-.475L2.343 9.3c-.57-.425-1.015-1.31-1.015-2.02V3.56c0-.77.565-1.59 1.29-1.86L5.113.765c.495-.185 1.275-.185 1.77 0l2.5.935c.725.27 1.29 1.09 1.29 1.86v3.715c0 .71-.445 1.595-1.015 2.02L7.508 10.9c-.42.32-.96.48-1.505.48zm-.625-9.91l-2.495.935c-.43.16-.805.7-.805 1.16V7.28c0 .475.335 1.14.71 1.42l2.15 1.605c.575.43 1.55.43 2.125 0L9.213 8.7c.38-.285.71-.95.71-1.42V3.56c0-.455-.375-.995-.805-1.16l-2.495-.935c-.33-.12-.91-.12-1.245.005z"
        className="fill-current"
      />
      <path
        d="M6 6.625a1.374 1.374 0 11-.002-2.748A1.374 1.374 0 016 6.625zm0-2a.625.625 0 100 1.25.625.625 0 000-1.25z"
        className="fill-current"
      />
      <path
        d="M6 8.125a.378.378 0 01-.375-.375v-1.5c0-.205.17-.375.375-.375s.375.17.375.375v1.5c0 .205-.17.375-.375.375z"
        className="fill-current"
      />
    </svg>
  )
}

const MemoSecurity = React.memo(Security)
export default MemoSecurity
