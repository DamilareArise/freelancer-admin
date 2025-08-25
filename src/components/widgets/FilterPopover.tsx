import React, { JSX, ReactNode, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { XCircle } from "lucide-react"
import MemoSort from "../icons/Sort"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

const FilterPopover: React.FC<{
  onApply?: () => void
  onClear?: () => void
  sections: { title: string; icon: JSX.Element; content: ReactNode }[]
  head?: ReactNode
  className?: string
}> = ({ onApply, onClear, sections, head, className }) => {
  const [filterDialogIsOpen, setFilterDialogIsOpen] = useState(false)

  return (
    <Popover open={filterDialogIsOpen} onOpenChange={setFilterDialogIsOpen}>
      <PopoverTrigger asChild>
        <button className="border h-10 flex items-center text-dark-2 px-4 py-2 text-sm rounded-lg gap-1">
          <MemoSort /> Filters
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn(
          "flex flex-col gap-5 max-h-[calc(100dvh_-_12rem)] w-[calc(100dvw_-_3rem)] overflow-auto max-w-sm px-0 pt-0 pb-4",
          className
        )}
      >
        <div className="flex bg-gray-50 px-6 py-5 items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-neutral-800">Filters</h3>
          <button onClick={() => setFilterDialogIsOpen(false)}>
            <XCircle className="size-6 stroke-neutral-800 stroke-[1.5]" />
          </button>
        </div>
        <div className="px-3 flex flex-col gap-4">
          {head}
          <div className="bg-gray-50 rounded-md">
            {sections.map((section, i) => (
              <FilterSection
                last={i + 1 == sections.length}
                key={i}
                {...section}
              />
            ))}
          </div>
          <div className="flex gap-3">
            {onClear && (
              <Button className="flex-1" variant="outline" onClick={onClear}>
                Clear
              </Button>
            )}
            <Button className="flex-1" onClick={onApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterPopover

// Extracted Subcomponent
const FilterSection: React.FC<{
  title: string
  last: boolean
  icon: JSX.Element
  content: ReactNode
}> = ({ title, icon, last, content }) => (
  <div className={cn("p-3.5", !last && "border-b")}>
    <div className="flex text-neutral-600 font-semibold text-sm items-center gap-3">
      {icon} <span>{title}</span>
    </div>
    <div className="flex flex-col gap-3 pl-4 pb-2 pt-4">{content}</div>
  </div>
)
