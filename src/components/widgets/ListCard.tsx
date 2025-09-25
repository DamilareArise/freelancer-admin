import { statusMap } from "@/lib/constants"
import { toCurrency } from "@/lib/helpers"
import { Listing } from "@/types/listing.type"
import { CheckCircle2, Circle, Image } from "lucide-react"
import React, { ReactNode } from "react"
import MemoLocation from "../icons/Location"
import { Skeleton } from "../ui/skeleton"
import MemoCrownStar from "../icons/CrownStar"
import { superAdsCategoryMap } from "@/services/superAd.service"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const ListCard = ({
  selectionChange,
  selecting,
  listing,
  hideStatus = false,
  ...props
}: {
  selectionChange?: (selected: boolean) => void
  badge?: ReactNode
  selecting?: boolean
  selected?: boolean
  hideStatus?: boolean
  listing: Listing
}) => {
  const status = statusMap[listing.status as keyof typeof statusMap]
  const superAd = listing.super_ad?.super_ads_category
    ? superAdsCategoryMap[listing.super_ad?.super_ads_category?.tier]
    : null

  return (
    <div className="rounded-xl h-full transition duration-300 text-start group relative border border-neutral-100 flex flex-col gap-5 items-stretch overflow-hidden">
      <div className="h-[9.4rem] min-h-[9.4rem] group-hover:scale-110 group-focus-visible:scale-110 transition duration-300">
        <Avatar className="size-full rounded-none">
          <AvatarImage src={listing.images[0]?.resource} />
          <AvatarFallback className="rounded-none" />
        </Avatar>

        {/* {listing.images[0] ? (
          <img
            src={listing.images[0]?.resource}
            alt="List Image"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full bg-gray-100 w-full"></div>
        )} */}
      </div>

      {selecting && (
        <span
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation()
            if (selectionChange) {
              selectionChange(props.selected ? false : true)
            }
          }}
          className="flex gap-2 absolute top-2 left-2 text-neutral-700 items-center ml-auto text-sm"
        >
          {props.selected ? (
            <CheckCircle2 className="fill-primary stroke-white" />
          ) : (
            <Circle className=" fill-black/30 stroke-neutral-100" />
          )}
        </span>
      )}

      {props.badge && props.badge}

      {status.value != "approved" && !hideStatus && (
        <div
          className="absolute px-2 flex items-center gap-2 text-sm top-2.5 right-2.5 py-1.5 rounded-3xl"
          style={{
            backgroundColor: status.bg,
            color: status.color,
          }}
        >
          {status.icon && <status.icon />}
          {status.label}
        </div>
      )}

      <div className="px-2.5 h-full pb-3 flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-neutral-1000 truncate font-semibold">
              {listing.service.header}
            </h3>
            {listing.super_ad && superAd && (
              <MemoCrownStar style={{ color: superAd.color }} />
            )}
          </div>
          <p className="text-xs text-neutral-700 line-clamp-2">
            {listing.service.description_en}
          </p>
        </div>
        <p className="flex gap-1 mt-auto text-neutral-500 text-xs">
          <MemoLocation /> {listing.address}
        </p>
        <h3 className="mt-auto text-primary text-sm font-semibold">
          {toCurrency(Number(listing.price))}
        </h3>
      </div>
    </div>
  )
}

export const ListCardSkeleton = () => {
  return (
    <div className="rounded-xl transition duration-300 text-start group relative border border-neutral-100 flex flex-col gap-5 items-stretch overflow-hidden">
      <Skeleton className="h-[9.5rem] flex items-center justify-center bg-neutral-100/20 rounded-b-none w-full">
        <Image className="opacity-5 size-16 stroke-1" />
      </Skeleton>
      {/* 
        <div
          className="absolute px-2 flex items-center gap-2 text-sm top-2.5 right-2.5 py-1.5 rounded-3xl"
          style={{
            backgroundColor: status.bg,
            color: status.color,
          }}
        >
          {status.icon && <status.icon />}
          {status.label}
        </div> */}

      <div className="px-2.5 pb-3 flex flex-col gap-3">
        <div>
          <div className="flex items-center mb-3 justify-between gap-3">
            <Skeleton className="h-3 bg-neutral-100/20 w-10/12" />
          </div>
          <Skeleton className="h-2 bg-neutral-100/20 w-2/3"></Skeleton>
        </div>
        <div className="flex items-center gap-1 text-neutral-500 text-xs">
          {/* <MemoLocation className="animate-pulse" />{" "} */}
          <Skeleton className="w-full h-1.5" />
        </div>
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

export default React.memo(ListCard)
