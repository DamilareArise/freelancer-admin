import { cn } from "@/lib/utils"
import React from "react"

const KlikoLoader = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 80 80"
      fill="none"
      className={cn("animate-pulse delay-500", className)}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M76.4934 40C78.4301 40 80.016 38.427 79.8464 36.4978C79.2398 29.5953 76.8478 22.9469 72.8787 17.2186C68.2417 10.5265 61.6731 5.40865 54.0503 2.54885C46.4275 -0.310944 38.1136 -0.776547 30.2191 1.21425C22.3247 3.20504 15.2257 7.55743 9.87058 13.69C4.51545 19.8225 1.15917 27.4431 0.250119 35.5338C-0.65893 43.6245 0.922545 51.7999 4.78327 58.9679C8.64399 66.1359 14.6001 71.9551 21.8559 75.6482C28.0668 78.8094 34.9768 80.2838 41.8981 79.955C43.8325 79.8631 45.1776 78.0797 44.9167 76.1607C44.6557 74.2417 42.8868 72.9173 40.951 72.9732C35.4493 73.1319 29.9753 71.9114 25.0371 69.398C19.0534 66.3525 14.1416 61.5535 10.9578 55.6423C7.77395 49.731 6.46975 42.989 7.21942 36.3169C7.96908 29.6447 10.7369 23.3602 15.1531 18.3029C19.5694 13.2455 25.4237 9.65626 31.934 8.01451C38.4443 6.37276 45.3006 6.75673 51.5869 9.11512C57.8732 11.4735 63.2901 15.694 67.1141 21.2128C70.2699 25.7673 72.2167 31.0271 72.8007 36.4999C73.0061 38.4256 74.5568 40 76.4934 40Z"
        className="fill-current animate-spin origin-center duration-[1.5s]"
      />
      <path
        d="M40 60L40 20"
        className="stroke-current animate-pulse"
        stroke-width="3"
      />
      <path
        d="M50 57.3203L30 22.6793"
        className="stroke-current animate-pulse"
        stroke-width="3"
      />
      <path
        d="M57.3203 50L22.6793 30"
        className="stroke-current animate-pulse"
        stroke-width="3"
      />
      <path
        d="M60 40L20 40"
        className="stroke-current animate-pulse"
        stroke-width="3"
      />
      <path
        d="M57.3203 30L22.6793 50"
        className="stroke-current animate-pulse"
        stroke-width="3"
      />
      <path
        d="M50 22.6797L30 57.3207"
        className="stroke-current animate-pulse"
        stroke-width="3"
      />
    </svg>
  )
}

const MemoKlikoLoader = React.memo(KlikoLoader)
export default MemoKlikoLoader
