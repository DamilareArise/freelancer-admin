import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"

const TabStyle1 = ({
  items,
}: {
  items: {
    link?: string
    value?: string
    label: string
    active?: boolean
  }[]
}) => {
  return (
    <div className="flex items-center overflow-auto gap-1">
      {items.map((item) => {
        return item.link ? (
          <NavLink
            to={item.link}
            key={item.label}
            className={({ isActive }) =>
              cn(
                "py-2 capitalize whitespace-nowrap text-neutral-300 transition duration-300 hover:bg-gray-50 font-medium border-primary px-3",
                isActive &&
                  "text-primary bg-gray-50 rounded-t-md border-b font-semibold"
              )
            }
          >
            {item.label}
          </NavLink>
        ) : (
          <button
            type="button"
            key={item.label}
            className={cn(
              "py-2 capitalize whitespace-nowrap text-neutral-300 transition duration-300 hover:bg-gray-50 font-medium border-primary px-3",
              item.active &&
                "text-primary bg-gray-50 rounded-t-md border-b font-semibold"
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default TabStyle1
