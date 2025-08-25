import * as React from "react"

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 16" fill="none" {...props}>
      <g clipPath="url(#prefix__clip0_3_76644)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 8a7.5 7.5 0 1115 0A7.5 7.5 0 010 8zm7.072 3.21l4.318-5.398-.78-.624-3.682 4.601L4.32 7.616l-.64.768 3.392 2.826z"
          className="fill-current"
        />
      </g>
      <defs>
        <clipPath id="prefix__clip0_3_76644">
          <path fill="#fff" transform="translate(0 .5)" d="M0 0h15v15H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

const MemoCheckCircle = React.memo(CheckCircle)
export default MemoCheckCircle
