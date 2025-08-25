import { toCurrency } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { Copy, Loader2, Trash2 } from "lucide-react"
import { ReactNode } from "react"
import MemoEdit from "../icons/Edit"
import { Skeleton } from "../ui/skeleton"

const PricingCard = ({
  icon,
  title,
  deleting,
  onDelete,
  onCopy,
  onEdit,
  price,
  list,
  heading,
  listHeading,
  ...props
}: {
  pillStyle?: React.CSSProperties
  headStyle?: React.CSSProperties
  headClassName?: string
  heading: string
  listHeading: string
  list: string[]
  icon?: ReactNode
  title: string
  onDelete?: () => void
  onCopy?: () => void
  onEdit?: () => void
  deleting?: boolean
  loading?: boolean
  price: number
  priceDesc?: string
}) => {
  return (
    <div className="rounded-lg flex flex-col overflow-hidden">
      <div
        style={props.headStyle}
        className={cn(
          "p-4 flex items-center gap-4 text-primary justify-between bg-primary/[.04] rounded-t-lg border border-primary",
          props.headClassName
        )}
      >
        <h3
          style={props.pillStyle}
          className={cn(
            "px-3 flex gap-1 items-center capitalize text-xs font-medium py-2 rounded-full bg-gray-100 text-neutral-800"
          )}
        >
          {icon && icon}
          {title}
        </h3>
        <div className="flex items-center gap-4">
          {onCopy && (
            <button
              title="Make Copy"
              disabled={deleting || props.loading}
              onClick={onCopy}
            >
              <Copy className="size-5 stroke-[1.5px]" />
            </button>
          )}
          {onDelete && (
            <button
              title="Delete"
              disabled={deleting || props.loading}
              onClick={onDelete}
              className="text-destructive/60"
            >
              {deleting ? (
                <Loader2 className="animate-spin size-5" />
              ) : (
                <Trash2 className="size-5" />
              )}
            </button>
          )}
          <button
            title="Edit"
            disabled={deleting || props.loading}
            onClick={onEdit}
          >
            <MemoEdit className="size-5" />
          </button>
        </div>
      </div>
      <div className="p-4 h-full border-b border-x rounded-b-lg border-[#E4E7EC] flex flex-col gap-3">
        <h1 className="font-semibold text-4xl text-neutral-800">
          {toCurrency(price)}{" "}
          {props.priceDesc && (
            <span className="font-normal text-sm">{props.priceDesc}</span>
          )}
        </h1>
        {/* <p>
                {category.category_pricing
                  .filter((_, i) => i)
                  .map((each, i) => (
                    <span className="mr-1 text-xs">
                      {toCurrency(each.price)} for {each.duration} month
                      {each.duration > 1 && "s"}{" "}
                      {i + 2 < category.category_pricing.length && "|"}
                    </span>
                  ))}
              </p> */}
        <h2 className="font-semibold text-lg text-neutral-800">{heading}</h2>
        <h3 className="font-semibold text-sm text-neutral-800">
          {listHeading}:
        </h3>
        <ul className="text-neutral-600 text-sm font-medium list-disc flex flex-col gap-3 pl-7">
          {list.map((each, j) => (
            <li key={"feat" + j} className="capitalize">
              {each}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PricingCard

export const PricingCardSkeleton = () => {
  return (
    <div className="rounded-lg flex flex-col overflow-hidden">
      <div
        className={cn(
          "p-4 flex items-center gap-4 justify-between bg-primary/[.04] rounded-t-lg border "
        )}
      >
        <Skeleton className="rounded-full w-20 h-9 delay-500" />
        <div className="flex items-center gap-4">
          <Skeleton className="size-5" />
        </div>
      </div>
      <div className="p-4 h-full border-b border-x rounded-b-lg border-[#E4E7EC] flex flex-col gap-3">
        <Skeleton className="w-32 h-12" />
        <Skeleton className="h-5 w-40 delay-500 " />
        <Skeleton className="h-3 w-32 " />
        <ul className="mt-2 list-disc flex flex-col gap-3 pl-5">
          {/* {new Array(4).fill(0).map((_each, j) => ( */}
          <Skeleton className="w-32 h-2.5" />
          <Skeleton className="w-44 h-2.5 delay-500" />
          <Skeleton className="w-28 h-2.5" />
          {/* ))} */}
        </ul>
      </div>
    </div>
  )
}
