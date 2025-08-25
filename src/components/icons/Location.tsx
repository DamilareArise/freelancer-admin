import * as React from "react"

function Location(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 10 13" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.146 4.453a1.022 1.022 0 000 2.042 1.021 1.021 0 000-2.042zm0 2.917A1.898 1.898 0 013.25 5.475c0-1.046.85-1.897 1.896-1.897 1.045 0 1.896.85 1.896 1.897 0 1.045-.85 1.895-1.896 1.895z"
        fill="#10B981"
      />
      <mask
        id="prefix__a"
        style={{
          maskType: "luminance",
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={10}
        height={13}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M.336.664H9.96V12.04H.336V.664z"
          fill="#fff"
        />
      </mask>
      <g mask="url(#prefix__a)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.148 1.54c-2.17 0-3.937 1.782-3.937 3.973 0 2.788 3.28 5.504 3.937 5.649.657-.146 3.938-2.862 3.938-5.649 0-2.19-1.766-3.974-3.938-3.974zm0 10.5C4.102 12.04.336 8.8.336 5.512.336 2.84 2.495.664 5.148.664c2.654 0 4.813 2.175 4.813 4.85 0 3.286-3.766 6.525-4.813 6.525z"
          fill="#10B981"
        />
      </g>
    </svg>
  )
}

const MemoLocation = React.memo(Location)
export default MemoLocation
