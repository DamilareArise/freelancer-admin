import { statusColors, statusMap } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { JSX, ReactNode } from "react"

// type ComponentProps = (typeof statusMap)[""]

const StatusPill = ({
  status: _status,
  color: _color,
  icon,
  className,
  noIcon,
  label,
}: {
  status?: string
  noIcon?: boolean
  className?: string
  icon?: JSX.Element
  label?: ReactNode
  color?: string
}) => {
  const status = _status as keyof typeof statusMap
  const Icon = statusMap[status]?.icon
  const color = _color || statusMap[status]?.color

  return (
    <div
      className={cn(
        "px-2 flex w-fit items-center capitalize whitespace-nowrap gap-2 text-sm top-2.5 right-2.5 py-1.5 rounded-3xl [&_svg]:size-4",
        statusColors[status],
        className
      )}
      style={{
        // backgroundColor: status.bg,
        backgroundColor: `color-mix(in oklab, ${color} 10%, transparent)`,
        color,
      }}
    >
      {!noIcon && <> {icon ? icon : Icon ? <Icon /> : ""}</>}
      {label || statusMap[status]?.label}
    </div>
  )
}

export default StatusPill
