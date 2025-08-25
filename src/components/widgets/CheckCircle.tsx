import { cn } from "@/lib/utils"
import { CheckCircle2, Circle } from "lucide-react"
import React, { ButtonHTMLAttributes } from "react"

const CheckCircle: React.FC<
  { checked?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ onClick, checked = false, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex gap-2 text-neutral-700 justify-center items-center text-sm",
        className
      )}
    >
      {checked ? (
        <CheckCircle2 className="fill-primary stroke-gray-100" />
      ) : (
        <Circle className="stroke-1 stroke-neutral-100" />
      )}
      {children}
    </button>
  )
}

export default CheckCircle
