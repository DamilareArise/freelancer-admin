import * as React from "react"

function ArmorUpgrade(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...props}>
      <g clipPath="url(#prefix__clip0_3_84909)">
        <path
          d="M9.997.86l-.211.157C7.32 2.87 4.896 4.084 1.19 4.7l-.293.047v.297c0 .742.329 1.902.864 3.324a36.227 36.227 0 002.149 4.656c.871 1.579 1.852 3.082 2.883 4.207 1.02 1.13 2.09 1.91 3.203 1.91s2.184-.78 3.21-1.91c1.024-1.125 2.005-2.628 2.88-4.207a36.87 36.87 0 002.148-4.656c.531-1.422.86-2.582.86-3.324v-.297l-.29-.047c-3.695-.617-6.128-1.831-8.597-3.684L9.997.859zm0 .867c2.387 1.759 4.86 2.974 8.375 3.607-.074.594-.352 1.617-.793 2.793-.16.422-.336.867-.535 1.328h-5.797v-1.91l2.5.625-3.75-4.374-3.75 4.374 2.5-.625v1.91H2.949c-.195-.46-.375-.906-.535-1.328-.437-1.176-.719-2.2-.793-2.793 3.517-.633 5.985-1.848 8.376-3.607z"
          className="fill-current"
        />
      </g>
      <defs>
        <clipPath id="prefix__clip0_3_84909">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

const MemoArmorUpgrade = React.memo(ArmorUpgrade)
export default MemoArmorUpgrade
