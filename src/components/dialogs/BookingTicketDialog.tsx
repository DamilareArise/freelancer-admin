import { statusMap } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Booking } from "@/types/booking.type"
import { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { format } from "date-fns"
import { toCurrency } from "@/lib/helpers"
import { Button } from "../ui/button"
import { Download } from "lucide-react"

const BookingTicketDialog = ({
  booking,
  open,
  setOpen,
}: {
  booking: Booking
  open: boolean
  setOpen: (open: boolean) => void
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[28.5rem] p-0" _style={2}>
        <DialogHeader className={cn("top-0 bg-white z-10", "sticky hidden")}>
          <DialogTitle className="bg-primary/10 py-5 px-6 border-primary border-b justify-between flex items-center gap-5">
            <div className="text-lg font-bold text-base-black">
              Booking Ticket
            </div>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="p-4 flex flex-col gap-5">
          <div className="flex flex-col bg-neutral-50 text-sm rounded-lg px-3">
            <TicketLine
              label="Status"
              value={
                <span style={{ color: statusMap[booking.status].color }}>
                  {statusMap[booking.status].label}
                </span>
              }
            />
            <TicketLine
              label="Booking ID"
              value={`BK${booking.id.toString().padStart(4, "0")}`}
            />
            <TicketLine
              label="Guest"
              value={
                <span className="flex items-center gap-2">
                  <Avatar className="size-[1.36rem]">
                    <AvatarImage
                      src={booking.requester.passport}
                      className="object-cover"
                      alt="Profile Image"
                    />
                    <AvatarFallback className="text-xs">
                      {booking.requester.initial}
                    </AvatarFallback>
                  </Avatar>
                  {booking.requester.fullname}
                </span>
              }
            />
            <TicketLine
              label="Host"
              value={
                <span className="flex items-center gap-2">
                  <Avatar className="size-[1.36rem]">
                    <AvatarImage
                      src={booking.listing.created_by.passport}
                      className="object-cover"
                      alt="Profile Image"
                    />
                    <AvatarFallback className="text-xs">
                      {booking.listing.created_by.initial}
                    </AvatarFallback>
                  </Avatar>
                  {booking.listing.created_by.fullname}
                </span>
              }
            />
            <TicketLine
              label="Property"
              value={booking.listing.service.header}
            />
            <TicketLine
              label="Booking Date"
              value={
                booking.created_at
                  ? format(booking.created_at, "d MMM yyyy, hh:mm aa")
                  : "--"
              }
            />
            <TicketLine label="Cancelled By" value={"--"} />
            <TicketLine label="Date Cancelled" value={"--"} />
            <TicketLine
              label="Check in Date"
              value={format(booking.date_time, "d MMM yyyy, hh:mm aa")}
            />
            <TicketLine label="Policy Type" value={"--"} />
            <TicketLine label="Refund Amount" value={toCurrency(0)} />
          </div>

          <div className="flex flex-col bg-neutral-50 text-sm rounded-lg px-3">
            <TicketLine label="Payment Method" value={"--"} />
            <TicketLine label="Transaction ID" value={"--"} />
          </div>

          <p className="text-warning text-sm">
            The guest cancelled 7 days before the booking start date. In line
            with the cancellation policy, the host will receive 20% of the
            booking amount as compensation.
          </p>

          <Button className="font-normal py-5">
            <Download /> Download as PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const TicketLine = ({ label, value }: { label: string; value: ReactNode }) => {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b last:border-0">
      <span className="text-neutral-600">{label}</span>
      <span className="font-medium text-neutral-800 text-right">{value}</span>
    </div>
  )
}

export default BookingTicketDialog
