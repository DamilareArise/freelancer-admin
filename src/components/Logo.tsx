import * as React from "react"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Logo(_props: React.SVGProps<SVGSVGElement>) {
  return (
    // <svg width="1em" height="1em" viewBox="0 0 54 55" fill="none" {...props}>
    //   <path
    //     d="M26.797 54.547V.955M40.195 50.953L13.4 4.541M50 41.148L3.588 14.352M53.594 27.75H0M50 14.352L3.588 41.148M40.195 4.547L13.4 50.959"
    //     stroke="currentColor"
    //     strokeWidth={4.019}
    //   />
    // </svg>

    <></>
  )
}

const MemoLogo = React.memo(Logo)
export default MemoLogo
