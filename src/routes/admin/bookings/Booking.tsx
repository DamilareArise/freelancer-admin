import MemoBooking from "@/components/icons/Booking"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import * as Bread from "@/components/ui/breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/widgets/Header"
import StatusPill from "@/components/widgets/StatusPill"
import { cn } from "@/lib/utils"
import { useGetBookingQuery } from "@/services/booking.service"
import { skipToken } from "@reduxjs/toolkit/query"
import { Flag, Home } from "lucide-react"
import { ReactNode, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import BookingsList from "./BookingsList"

const Booking = () => {
  const { booking_id } = useParams()
  const { data: booking, isFetching: isLoading } = useGetBookingQuery(
    booking_id ? Number(booking_id) : skipToken
  )

  useEffect(() => {
    setTimeout(() => {
      document
        .getElementById("outletContainer")
        ?.scrollTo({ top: -900, behavior: "smooth" })
    }, 100)
  }, [booking_id])

  return (
    <div className="pb-10">
      <Header />
      <div className="sticky top-20 bg-white py-2 z-10">
        <Breadcrumb page={booking?.listing.property.header} />
      </div>

      {isLoading && (
        <div className="flex flex-wrap gap-4 mt-3 fade">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={`skeletoncard${i}`} />
            ))}
        </div>
      )}

      {booking && !isLoading && (
        <div className="flex flex-wrap gap-4 mt-3 fade">
          <div className="flex-1 w-full sm:min-w-sm border rounded-lg">
            <div className="border-b py-3 px-6 flex gap-3 justify-between">
              <h3 className="font-semibold text-neutral-800">
                Service Provider
              </h3>
              <span className="flex gap-2 items-center">
                <Flag className="text-neutral-300" />
              </span>
            </div>

            <div className="px-6">
              <div className="flex border-b py-4 justify-between text-sm min-h-16 items-center gap-3">
                <span className="text-muted-foreground">Name</span>
                <span className="flex gap-2 items-center">
                  <Avatar className="size-5">
                    <AvatarImage
                      src={booking.listing.created_by.passport}
                      className="object-cover"
                      alt="Profile Image"
                    />
                    <AvatarFallback>
                      {booking.listing.created_by.initial}
                    </AvatarFallback>
                  </Avatar>
                  <span>{booking.listing.created_by.fullname}</span>
                </span>
              </div>
              <SummaryCardLine
                title="Email"
                value={booking.listing.created_by.email ?? "--"}
              />
              <SummaryCardLine
                title="Phone"
                value={booking.listing.created_by.phone ?? "--"}
              />
              <SummaryCardLine title="Completed Tours" value="--" />
              <SummaryCardLine
                noBorder
                title="Complaints"
                value={<span className=" text-destructive">--</span>}
              />
            </div>
          </div>

          <div className="flex-1 w-full sm:min-w-sm border rounded-lg">
            <div className="border-b py-3 px-6 flex gap-3 justify-between">
              <h3 className="font-semibold text-neutral-800">Requester</h3>
              <span className="flex gap-2 items-center">
                <Flag className="text-neutral-300" />
              </span>
            </div>

            <div className="px-6">
              <div className="flex border-b py-4 justify-between text-sm min-h-16 items-center gap-3">
                <span className="text-muted-foreground">Name</span>
                <span className="flex gap-2 items-center">
                  <Avatar className="size-5">
                    <AvatarImage
                      src={booking.requester.passport}
                      className="object-cover"
                      alt="Profile Image"
                    />
                    <AvatarFallback>{booking.requester.initial}</AvatarFallback>
                  </Avatar>
                  <span>{booking.requester.fullname}</span>
                </span>
              </div>
              <SummaryCardLine
                title="Email"
                value={booking.requester.email ?? "--"}
              />
              <SummaryCardLine
                title="Phone"
                value={booking.requester.phone ?? "--"}
              />
              <SummaryCardLine title="Completed Tours" value="--" />
              <SummaryCardLine
                noBorder
                title="Reviews"
                value={<span className="text-warning">--</span>}
              />
            </div>
          </div>

          <div className="flex-1 w-full sm:min-w-sm border rounded-lg">
            <div className="border-b py-3 px-6 flex gap-3 justify-between">
              <h3 className="font-semibold text-neutral-800">
                Tour Information
              </h3>
              <span className="flex gap-2 items-center">
                <Avatar className="size-5">
                  <AvatarImage
                    src={booking.listing.resources[0]?.resource}
                    className="object-cover"
                    alt="Property"
                  />
                  <AvatarFallback>
                    {booking.listing.property.header.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{booking.listing.property.header}</span>
              </span>
            </div>

            <div className="px-6">
              <div className="flex border-b py-4 justify-between text-sm min-h-16 items-center gap-3">
                <span className="text-muted-foreground">Property</span>
                <span className="flex gap-2 items-center">
                  <Avatar className="size-5">
                    <AvatarImage
                      src={booking.listing.resources[0]?.resource}
                      className="object-cover"
                      alt="Property"
                    />
                    <AvatarFallback>
                      {booking.listing.property.header.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{booking.listing.property.header}</span>
                </span>
              </div>
              <SummaryCardLine
                title="Location"
                value={booking.listing.address}
              />
              <div className="flex border-b py-4 justify-between text-sm min-h-16 items-center gap-3">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-sm">
                  {new Date(booking.date_time).toDateString()}
                </span>
              </div>
              <div className="flex border-b py-4 justify-between text-sm min-h-16 items-center gap-3">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-sm">
                  {new Date(booking.date_time).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex py-4 justify-between gap-3">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-sm">
                  <StatusPill status={booking.status} />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col mt-5 gap-3 fade">
        <h3 className="text-lg font-semibold">Service Provider History</h3>
        <BookingsList provider={booking?.listing.created_by.id} />
      </div>
    </div>
  )
}

export default Booking

const SummaryCardLine: React.FC<{
  title: string
  value: ReactNode
  noBorder?: boolean
}> = ({ title, value, noBorder }) => {
  return (
    <div
      className={cn(
        "flex  py-4 justify-between text-sm min-h-16 items-center gap-3",
        !noBorder && "border-b"
      )}
    >
      <span className="text-muted-foreground">{title}</span>
      <span className="font-medium text-right text-neutral-800 text-sm">
        {value}
      </span>
    </div>
  )
}

const Breadcrumb = ({ page }: { page?: string }) => {
  return (
    <Bread.Breadcrumb className="mb-4">
      <Bread.BreadcrumbList>
        <Bread.BreadcrumbItem>
          <Bread.BreadcrumbLink asChild>
            <Link to="/admin/overview" className="flex items-center gap-1">
              <Home className="size-4" /> Home
            </Link>
          </Bread.BreadcrumbLink>
        </Bread.BreadcrumbItem>
        <Bread.BreadcrumbSeparator />
        <Bread.BreadcrumbItem>
          <Bread.BreadcrumbLink asChild>
            <Link to="/admin/bookings/list" className="flex items-center gap-1">
              <MemoBooking className="size-4" /> Bookings & Physical Tours
            </Link>
          </Bread.BreadcrumbLink>
        </Bread.BreadcrumbItem>
        <Bread.BreadcrumbSeparator />
        <Bread.BreadcrumbItem>
          <Bread.BreadcrumbPage>{page}</Bread.BreadcrumbPage>
        </Bread.BreadcrumbItem>
      </Bread.BreadcrumbList>
    </Bread.Breadcrumb>
  )
}

export const SkeletonCard = () => {
  return (
    <div className="p-6 flex-1 border rounded-lg bg-white flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      {/* Content Rows */}
      <div className="space-y-5 mt-6 divide-y">
        <div className="flex justify-between gap-1 pb-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex justify-between gap-1 pb-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="flex justify-between gap-1 pb-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex justify-between gap-1 pb-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex justify-between gap-1 pb-5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </div>
  )
}
