import * as React from "react"

function Expand(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 25" fill="none" {...props}>
      <g clipPath="url(#prefix__clip0_3_112758)">
        <path
          d="M24 8.586v-6a2 2 0 00-2-2h-6v2h4.586L12 11.172 3.414 2.586H8v-2H2a2 2 0 00-2 2v6h2V4l8.586 8.586L2 21.172v-4.586H0v6a2 2 0 002 2h6v-2H3.414L12 14l8.586 8.586H16v2h6a2 2 0 002-2v-6h-2v4.586l-8.586-8.586L22 4v4.586h2z"
          fill="#0A0B0A"
        />
      </g>
      <defs>
        <clipPath id="prefix__clip0_3_112758">
          <path fill="#fff" transform="translate(0 .586)" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

const MemoExpand = React.memo(Expand)
export default MemoExpand
