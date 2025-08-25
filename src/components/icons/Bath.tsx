import * as React from "react"

function Bath(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25 25" fill="none" {...props}>
      <g clipPath="url(#prefix__clip0_3_112754)">
        <path
          d="M23.995 16.459l.483-3.873H2.5V4.919a2.336 2.336 0 012.333-2.333c.73 0 1.429.349 1.867.933l.259.345-.574 3.29 1.071 1.67 5.777-4.333-1.071-1.67-3.607-.161-.256-.342A4.354 4.354 0 004.832.586 4.337 4.337 0 00.5 4.919v7.667l.519 3.873a8.116 8.116 0 002.726 5.117l-.744 3.01h2.061l.452-1.832a8.099 8.099 0 003.578.832h6.831a8.091 8.091 0 003.567-.826l.451 1.826h2.061l-.742-3.001a8.12 8.12 0 002.737-5.126h-.002zM9.091 21.586a6.145 6.145 0 01-6.088-5.375L2.8 14.586h19.413l-.202 1.625a6.147 6.147 0 01-6.089 5.375H9.091z"
          fill="#0A0B0A"
        />
      </g>
      <defs>
        <clipPath id="prefix__clip0_3_112754">
          <path fill="#fff" transform="translate(.5 .586)" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

const MemoBath = React.memo(Bath)
export default MemoBath
