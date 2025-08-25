import * as React from "react"

function Ads(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10z"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M11.48 7.303c.216-.404.824-.404 1.04 0l1.28 2.382a.583.583 0 00.428.296l2.779.42c.47.072.659.62.322.94l-1.99 1.895a.537.537 0 00-.163.478l.438 2.644c.075.447-.417.786-.842.58l-2.507-1.212a.612.612 0 00-.53 0l-2.507 1.212c-.425.206-.917-.133-.842-.58l.438-2.644a.538.538 0 00-.163-.478L6.67 11.34c-.337-.32-.149-.868.322-.94l2.779-.42a.583.583 0 00.429-.296l1.278-2.382z"
        className="stroke-current"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MemoAds = React.memo(Ads)
export default MemoAds
