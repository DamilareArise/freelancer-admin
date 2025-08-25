import * as React from "react"

function Mail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 14 15" fill="none" {...props}>
      <path
        d="M9.914 12.896H4.081c-2.13 0-3.354-1.225-3.354-3.354V5.459c0-2.13 1.225-3.355 3.354-3.355h5.833c2.13 0 3.354 1.225 3.354 3.355v4.083c0 2.13-1.225 3.354-3.354 3.354zM4.081 2.98c-1.669 0-2.48.811-2.48 2.48v4.083c0 1.668.811 2.48 2.48 2.48h5.833c1.668 0 2.48-.812 2.48-2.48V5.459c0-1.669-.812-2.48-2.48-2.48H4.081z"
        className="fill-current"
      />
      <path
        d="M6.996 8.007c-.49 0-.985-.152-1.365-.46l-1.825-1.46a.436.436 0 01.542-.682l1.826 1.459c.443.356 1.196.356 1.639 0l1.826-1.459a.43.43 0 01.612.07.43.43 0 01-.07.613L8.356 7.546c-.374.31-.87.461-1.36.461z"
        className="fill-current"
      />
    </svg>
  )
}

const MemoMail = React.memo(Mail)
export default MemoMail
