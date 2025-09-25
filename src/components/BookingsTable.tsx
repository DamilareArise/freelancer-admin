import { Booking } from "@/types/booking.type"
import { Ellipsis, Ticket, View } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import StatusPill from "./widgets/StatusPill"
import { Skeleton } from "./ui/skeleton"
import BookingTicketDialog from "./dialogs/BookingTicketDialog"
import { useState } from "react"
import { format } from "date-fns"

const BookingsTable = ({
  bookings,
  loading,
  hiddenColumns = [],
}: {
  bookings: Booking[]
  loading?: boolean
  hiddenColumns?: string[]
}) => {
  const [currentBooking, setCurrentBooking] = useState<Booking | undefined>()
  const [ticketDialogIsOpen, setTicketDialogIsOpen] = useState(false)

  return (
    <div className="overflow-auto border-t border-x rounded-2xl text-neutral-800 font-medium">
      <table className="w-full">
        <thead>
          <tr className="thead-row">
            <th>Property</th>
            <th>Requester</th>
            {!hiddenColumns.includes("provider") && <th>Service Provider</th>}
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && <BookingsSkeleton limit={10} />}
          {!loading &&
            bookings.map((each, i) => (
              <tr className="tbody-row" key={i + "booking"}>
                <td>
                  <span className="flex gap-2 items-center">
                    <Avatar className="size-6">
                      <AvatarImage
                        src={each.listing.resources[0]?.resource}
                        alt="Profile Image"
                      />
                      <AvatarFallback>
                        {each.listing.service.header.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{each.listing.service.header}</span>
                  </span>
                </td>
                <td className="flex gap-2 items-center">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={each.requester.passport}
                      alt="Profile Image"
                    />
                    <AvatarFallback>{each.requester.initial}</AvatarFallback>
                  </Avatar>
                  <span>{each.requester.fullname}</span>
                </td>
                {!hiddenColumns.includes("provider") && (
                  <td>
                    <span className="flex gap-2 items-center">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={each.listing.created_by.passport}
                          alt="Profile Image"
                        />
                        <AvatarFallback>
                          {each.listing.created_by.initial}
                        </AvatarFallback>
                      </Avatar>
                      <span>{each.listing.created_by.fullname}</span>
                    </span>
                  </td>
                )}
                <td className="whitespace-nowrap">
                  {new Date(each.date_time).toDateString()}
                </td>
                <td className="whitespace-nowrap">
                  {format(each.date_time, "hh:mm aa")}
                </td>
                <td>
                  <StatusPill status={each.status} />
                </td>

                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex size-8 items-center">
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/bookings/${each.id}`}>
                          <View /> View Booking
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setCurrentBooking(each)
                          setTicketDialogIsOpen(true)
                        }}
                      >
                        <Ticket /> View Ticket
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {currentBooking && (
        <BookingTicketDialog
          open={ticketDialogIsOpen}
          setOpen={setTicketDialogIsOpen}
          booking={currentBooking}
        />
      )}
    </div>
  )
}

const BookingsSkeleton = ({ limit }: { limit: number }) => {
  return new Array(limit).fill(null).map((_, i) => (
    <tr className="tbody-row" key={i + "skeleton"}>
      <td className="flex gap-2 items-center">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-3 w-40" />
      </td>
      <td>
        <Skeleton className="h-3 w-48" />
      </td>
      <td>
        <Skeleton className="h-3 w-40" />
      </td>
      <td>
        <Skeleton className="h-3 w-32" />
      </td>
      <td>
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td>
        <Skeleton className="h-2 w-9" />
      </td>
    </tr>
  ))
}

export default BookingsTable
