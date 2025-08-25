import * as React from "react"

function Bed(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 25" fill="none" {...props}>
      <g clipPath="url(#prefix__clip0_3_112751)">
        <path
          d="M19 6.586h-6A4.987 4.987 0 008.584 9.29 3.464 3.464 0 006.5 8.586a3.5 3.5 0 00-3.5 3.5c.003.52.123 1.033.351 1.5H2v-10a1 1 0 00-2 0v18a1 1 0 102 0v-2h20v2a1 1 0 102 0v-10a5.006 5.006 0 00-5-5zm-9 5a3 3 0 013-3h6a3 3 0 013 3v2H10v-2zm-5 .5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm-3 5.5v-2h20v2H2z"
          fill="#0A0B0A"
        />
      </g>
      <defs>
        <clipPath id="prefix__clip0_3_112751">
          <path fill="#fff" transform="translate(0 .586)" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

const MemoBed = React.memo(Bed)
export default MemoBed
