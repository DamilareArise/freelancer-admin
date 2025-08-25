import * as React from "react"

function PaymentClock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...props}>
      <g clipPath="url(#prefix__clip0_3_84969)">
        <path
          d="M14.58 14.015l2.034 1.175-.625 1.084-2.658-1.534v-3.075h1.25v2.35zm5.417.15A5.829 5.829 0 0114.164 20a5.83 5.83 0 01-5.833-5.834c0-.283.025-.558.066-.833H1.664v-10h15v5.567c1.967.941 3.333 2.941 3.333 5.266zm-11.1-2.5c.15-.3.309-.583.5-.858-.075.025-.15.025-.233.025a2.497 2.497 0 01-2.5-2.5c0-1.383 1.117-2.5 2.5-2.5s2.5 1.117 2.5 2.5c0 .208-.033.417-.083.608a5.864 5.864 0 012.583-.608c.283 0 .558.025.833.067V6.665A1.667 1.667 0 0113.331 5H4.997a1.66 1.66 0 01-1.666 1.666V10a1.667 1.667 0 011.666 1.666h3.9zm9.434 2.5c0-2.3-1.867-4.166-4.167-4.166a4.168 4.168 0 00-4.167 4.166c0 2.3 1.867 4.167 4.167 4.167s4.167-1.867 4.167-4.167z"
          className="fill-current"
        />
      </g>
      <defs>
        <clipPath id="prefix__clip0_3_84969">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

const MemoPaymentClock = React.memo(PaymentClock)
export default MemoPaymentClock
