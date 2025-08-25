import React from "react"
import MemoStroke from "../icons/Stroke"
import MemoDarkLocation from "../icons/DarkLocation"
import { Booking } from "@/types/booking.type"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { statusMap } from "@/lib/constants"
import { format } from "date-fns"
import { Skeleton } from "../ui/skeleton"

interface BookingCardProps {
  booking: Booking
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  return (
    <div className="p-[10px] flex flex-col gap-[20px] border border-[#F6F6F6] rounded-[6px]">
      <div className="flex gap-[12px]">
        <Avatar className="w-[4.3rem] h-[3.8rem] rounded-none">
          <AvatarImage src={booking.listing.resources[0]?.resource} />
          <AvatarFallback className="rounded-none"></AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-[12px]">
          <p className="text-[14px] md:text-[18px] font-[600] text-[#151413]">
            {booking.listing.property.header}
          </p>
          <span className="flex items-center gap-[4px]">
            <MemoDarkLocation />
            <p className="font-[500] text-[10px] md:text-[12px] text-[#B5B3B3]">
              {booking.listing.address}
            </p>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[#B5B3B3] font-[500] text-[10px] md:text-[12px]">
            Customer
          </p>
          <span className="flex gap-2 items-center">
            <Avatar className="size-5">
              <AvatarImage src={booking.requester.passport} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <span className="text-sm">{booking.requester.fullname}</span>
          </span>
        </div>

        <MemoStroke />

        <div className="flex flex-col gap-[4px]">
          <p className="text-[#B5B3B3] font-[500] text-[10px] md:text-[12px]">
            Tour date and time
          </p>

          <p className="text-[#0A0B0A] font-[600] text-[10px] md:text-[12px]">
            {format(booking.date_time, "MMM dd yyyy, HH:mm")}
          </p>
        </div>

        <MemoStroke />

        <div
          className={`px-2 py-1 border-l text-[10px] md:text-xs font-semibold capitalize`}
          style={{
            color: statusMap[booking.status].color,
            borderColor: statusMap[booking.status].color,
            backgroundColor: statusMap[booking.status].bg,
          }}
        >
          {booking.status}
        </div>
      </div>
    </div>
  )
}

export default BookingCard

export const BookingCardSkeleton = () => {
  return (
    <div className="p-[10px] flex flex-col gap-5 border border-[#F6F6F6] rounded-[6px]">
      <div className="flex gap-3">
        <Skeleton className="w-[4.3rem] h-[3.8rem] animation-delay-200" />

        <div className="flex flex-col justify-center gap-3">
          <Skeleton className="h-4 w-[200px] animation-delay-500" />

          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 animation-delay-300" />
            <Skeleton className="h-4 w-[150px] animation-delay-400" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-[60px] animation-delay-100" />
          <div className="flex gap-2 items-center">
            <Skeleton className="h-5 w-5 rounded-full animation-delay-600" />
            <Skeleton className="h-4 w-[100px] animation-delay-700" />
          </div>
        </div>
        <Skeleton className="h-5 w-[1px] animation-delay-200" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-[100px] animation-delay-400" />
          <Skeleton className="h-4 w-[120px] animation-delay-300" />
        </div>
        <Skeleton className="h-5 w-[1px] animation-delay-500" />
        <Skeleton className="h-7 w-[80px] animation-delay-600" />
      </div>
    </div>
  )
}
