import { toCurrency } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { TrendingDown, TrendingUp } from "lucide-react"
import React from "react"
import { Skeleton } from "../ui/skeleton"

export interface InfoCardProps {
  rate: number
  value: number
  title: string
  isAmount?: boolean
  rateDesc?: string
}

const InfoCard: React.FC<InfoCardProps> = ({
  rate,
  value,
  title,
  isAmount,
  rateDesc = "from last month",
}) => {
  const Icon = rate < 0 ? TrendingDown : TrendingUp
  return (
    <div className="p-[12px] flex flex-col gap-[18px] bg-white rounded-[12px] border-[1px] border-[#E3E3E3]">
      <p className="text-[#2B2928] text-xs">{title}</p>
      <p className="text-2xl font-semibold text-base-black">
        {isAmount ? toCurrency(value) : value.toLocaleString()}
      </p>

      {
        <div
          className={cn(
            "flex min-w-full whitespace-nowrap text-gray-500 items-center text-xs"
          )}
        >
          <span
            className={cn(
              "font-semibold flex mr-1 gap-1",
              rate < 0
                ? "text-destructive "
                : rate > 0
                ? "text-primary"
                : "text-current"
            )}
          >
            <Icon className="size-4 stroke-[1.3px]" />
            {rate}%
          </span>
          {rateDesc}
        </div>
      }
    </div>
  )
}
export default InfoCard

export const InfoCardSkeleton = () => {
  return (
    <div className="p-[12px] flex flex-col gap-[18px] bg-white rounded-[12px] border-[1px] border-[#E3E3E3]">
      <div className="h-3 w-20 mt-1">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="h-8 w-32">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="h-4 w-40 flex items-center gap-1">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  )
}
