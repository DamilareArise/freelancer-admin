import * as React from "react"

function PersonSupport(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 31" fill="none" {...props}>
      <path
        d="M12 23.213a3.429 3.429 0 01-3.418-3.154A10.29 10.29 0 0112 .07 10.286 10.286 0 0122.251 9.5a.804.804 0 01-.822.857.925.925 0 01-.9-.857 8.572 8.572 0 10-11.64 8.846A3.428 3.428 0 1112 23.213zm-8.556-4.286H3.6a12.003 12.003 0 003.485 2.38 5.143 5.143 0 009.988-2.38h3.498A3.429 3.429 0 0124 22.356c0 2.899-1.428 5.085-3.66 6.51-2.198 1.4-5.16 2.061-8.34 2.061-3.18 0-6.142-.661-8.34-2.062C1.428 27.442 0 25.253 0 22.356a3.43 3.43 0 013.444-3.429zm15.413-8.571a6.857 6.857 0 01-3.206 5.806 5.141 5.141 0 00-7.302 0 6.857 6.857 0 1110.508-5.806z"
        className="fill-current"
      />
    </svg>
  )
}

const MemoPersonSupport = React.memo(PersonSupport)
export default MemoPersonSupport
