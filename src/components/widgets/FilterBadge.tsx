import { X } from "lucide-react"
import { ReactNode } from "react"

const FilterBadge = ({
  onClose,
  children,
}: {
  onClose?: () => void
  children: ReactNode
}) => {
  return (
    <div className="border text-sm rounded-md p-2 border-primary/60 text-neutral-600 relative">
      <button
        onClick={() => {
          if (onClose) {
            onClose()
          }
        }}
        className="rounded-full p-0.5 size-3.5 bg-neutral-600 text-white flex items-center absolute -top-1.5 -right-1.5"
      >
        <X />
      </button>
      {children}
    </div>
  )
}

export default FilterBadge
