import * as React from "react"

function Notifications(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 22" fill="none" {...props}>
      <path
        d="M19.28 13.72l-2.03-2.03V9a7.51 7.51 0 00-6.75-7.463V0H9v1.538A7.51 7.51 0 002.25 9v2.69L.22 13.72a.75.75 0 00-.22.53v2.25a.75.75 0 00.75.75H6v.583a3.862 3.862 0 003.375 3.899A3.754 3.754 0 0013.5 18v-.75h5.25a.75.75 0 00.75-.75v-2.25a.75.75 0 00-.22-.53zM12 18a2.25 2.25 0 01-4.5 0v-.75H12V18zm6-2.25H1.5v-1.19l2.03-2.03a.75.75 0 00.22-.53V9a6 6 0 1112 0v3c0 .199.08.39.22.53L18 14.56v1.19z"
        className="fill-current"
      />
    </svg>
  )
}

const MemoNotifications = React.memo(Notifications)
export default MemoNotifications
