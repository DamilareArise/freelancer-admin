import { debounce } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { SearchIcon } from "lucide-react"
import { ReactNode } from "react"

const SearchInput = ({
  onChange,
  delay,
  onSearch,
  suffix,
  placeholder = "Search",
  containerClass,
  value,
}: React.InputHTMLAttributes<HTMLInputElement> & {
  containerClass?: string
  suffix?: ReactNode
  delay?: number
  onSearch?: (term: string) => void
}) => {
  const handleSearchChange = debounce((term: string) => {
    if (onSearch) onSearch(term)
  }, delay || 300)

  return (
    <div
      className={cn(
        "rounded-full h-12 flex max-w-[30rem] items-center relative bg-[#f9f9f9] w-full focus-within:bg-white border border-[#e3e3e3] transition px-3",
        containerClass
      )}
    >
      <span className="flex items-center justify-center">
        {<SearchIcon className="stroke-1 stroke-neutral-500" />}
      </span>
      <input
        value={value ? value : undefined}
        onChange={(e) => {
          if (onChange) onChange(e)
          handleSearchChange(e.target.value)
        }}
        placeholder={placeholder}
        className="text-sm bg-transparent outline-none px-2 h-full w-full"
      />
      {suffix}
    </div>
  )
}

export default SearchInput
