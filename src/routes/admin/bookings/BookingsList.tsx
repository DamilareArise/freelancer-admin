import BookingsTable from "@/components/BookingsTable"
import Pagination from "@/components/Pagination"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DateInput from "@/components/widgets/DateInput"
import FilterPopover from "@/components/widgets/FilterPopover"
import SearchInput from "@/components/widgets/SearchInput"
import {
  useBookingPrefetch,
  useGetBookingsQuery,
} from "@/services/booking.service"
import { UserData } from "@/types/auth"
import { Booking } from "@/types/booking.type"
import { format } from "date-fns"
import { ClockAlert } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const BookingsList: React.FC<{ provider?: UserData["id"] }> = ({
  provider,
}) => {
  const [currentStatus, setCurrentStatus] = useState<
    Booking["status"] | undefined
  >()
  const [filters, setFilters] = useState<{
    start?: Date
    end?: Date
    searchText: string
    status?: string[]
  }>({ searchText: "", status: [] })

  const limit = 10
  const [page, setPage] = useState(1)
  const prefetchPage = useBookingPrefetch("getBookings")
  const requestOptions = useMemo(() => {
    return {
      limit,
      provider,
      page,
      search: filters.searchText,
      status: currentStatus,
    }
  }, [provider, page, filters.searchText, currentStatus])

  const { data: bookingData, isFetching: isLoading } =
    useGetBookingsQuery(requestOptions)

  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (bookingData) {
      setBookings(bookingData.results)

      if (requestOptions.page - 1) {
        prefetchPage({ ...requestOptions, page: requestOptions.page - 1 })
      }
      if (bookingData?.results.length >= limit) {
        prefetchPage({ ...requestOptions, page: requestOptions.page + 1 })
      }
    }
  }, [bookingData, prefetchPage, requestOptions])

  useEffect(() => {
    setPage(1)
  }, [filters.searchText, currentStatus, filters])

  return (
    <div className="pb-10 fade flex flex-col gap-5">
      <Tabs defaultValue="all">
        <div className="flex md:items-center justify-between gap-4 flex-col md:flex-row">
          <TabsList defaultValue={"all"} className="capitalize" _style={2}>
            {[
              { label: "All", value: undefined },
              {
                label: "Pending",
                value: "pending",
              },
              {
                label: "Upcoming",
                value: "confirmed",
              },
              {
                label: "Completed",
                value: "completed",
              },
              {
                label: "Cancelled",
                value: "canceled",
              },
              {
                label: "Rejected",
                value: "rejected",
              },
            ].map(({ value, label }) => (
              <TabsTrigger
                onClick={() => {
                  setCurrentStatus(value as Booking["status"])
                }}
                key={label}
                value={value ?? "all"}
                _style={2}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center w-full md:w-fit gap-3">
            <SearchInput
              onSearch={(searchText) =>
                setFilters((filter) => ({ ...filter, searchText }))
              }
              placeholder="Search by user or property name"
              containerClass="h-10 rounded-lg lg:min-w-84"
            />

            <FilterPopover
              head={
                <>
                  {filters.start && filters.end && (
                    <div className="flex items-center flex-wrap gap-3">
                      <span className="bg-base-black px-2 py-1 flex items-center rounded-full gap-1 text-xs text-white">
                        <ClockAlert className="size-4" />
                        {format(filters.start, "dd MMM yyyy")} to{" "}
                        {format(filters.end, "dd MMM yyyy")}
                      </span>
                    </div>
                  )}
                </>
              }
              sections={[
                {
                  title: "Tour Date Range",
                  icon: <ClockAlert className="size-5" />,
                  content: (
                    <>
                      <div className="flex items-center justify-between gap-3 text-xs font-medium">
                        <DateInput
                          date={filters.start}
                          setDate={(cdate) =>
                            setFilters((_filters) => ({
                              ..._filters,
                              start: cdate,
                            }))
                          }
                        />
                        To
                        <DateInput
                          date={filters.end}
                          setDate={(cdate) =>
                            setFilters((_filters) => ({
                              ..._filters,
                              end: cdate,
                            }))
                          }
                        />
                      </div>
                    </>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </Tabs>

      <BookingsTable
        hiddenColumns={["provider"]}
        loading={isLoading}
        bookings={bookings}
      />
      <Pagination
        count={bookingData?.count ?? 0}
        pageChange={(page) => setPage(page + 1)}
        limit={limit}
      />
    </div>
  )
}

export default BookingsList
