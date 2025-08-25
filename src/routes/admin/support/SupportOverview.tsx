import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DateInput from "@/components/widgets/DateInput"
import FilterPopover from "@/components/widgets/FilterPopover"
import RouteHead from "@/components/widgets/RouteHead"
import SearchInput from "@/components/widgets/SearchInput"
import {
  useGetTicketsQuery,
  useTicketPrefetch,
} from "@/services/ticket.service"
import { Ticket } from "@/types/ticket.type"
import { format } from "date-fns"
import { ClockAlert } from "lucide-react"
import { lazy, useEffect, useMemo, useState } from "react"
import { TicketsCardSummary } from "./Index"

const TicketsTable = lazy(() => import("@/components/TicketsTable"))

const SupportOverview = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  // const [currentStatus, setCurrentStatus] = useState<
  //   Ticket["status"] | undefined
  // >()
  const [filters, setFilters] = useState<{
    start?: Date
    end?: Date
    searchText: string
    ad_type: number[]
    status?: string[]
    payment_status: string[]
  }>({ searchText: "", status: [], ad_type: [], payment_status: [] })

  const limit = 7
  const [page, setPage] = useState(1)
  const prefetchPage = useTicketPrefetch("getTickets")
  const requestOptions = useMemo(
    () => ({
      limit,
      page,
      search: filters.searchText,
      // status: currentStatus,
      ad_type: filters.ad_type,
      payment_status: filters.payment_status,
      // Optionally add date range if your API supports it
      // start_date: filters.start ? format(filters.start, "yyyy-MM-dd") : undefined,
      // end_date: filters.end ? format(filters.end, "yyyy-MM-dd") : undefined,
    }),
    [
      page,
      filters.searchText,
      filters.ad_type,
      filters.payment_status,
      // currentStatus,
      // filters.start,
      // filters.end,
    ]
  )

  const { data: ticketData, isFetching: isLoading } =
    useGetTicketsQuery(requestOptions)

  useEffect(() => {
    if (ticketData) {
      setTickets(ticketData.results)
      if (requestOptions.page - 1) {
        prefetchPage({ ...requestOptions, page: requestOptions.page - 1 })
      }
      if (ticketData?.results.length >= limit) {
        prefetchPage({ ...requestOptions, page: requestOptions.page + 1 })
      }
    }
  }, [ticketData, prefetchPage, requestOptions])

  useEffect(() => {
    setPage(1)
  }, [filters.searchText, filters])

  return (
    <div>
      <div className="flex fade flex-col gap-6 mb-6">
        <RouteHead title="Overview" />
        <TicketsCardSummary />

        <Tabs defaultValue="support">
          <div className="flex md:items-center justify-between gap-4 flex-col md:flex-row">
            <TabsList
              defaultValue={"support"}
              className="capitalize"
              _style={2}
            >
              {[
                { label: "Support Tickets", value: "support" },
                { label: "Ads Disputes", value: "dispute" },
              ].map(({ value, label }) => (
                <TabsTrigger
                  onClick={() => {
                    // You can set a filter here if needed for "dispute"
                  }}
                  key={label}
                  value={value}
                  _style={2}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex items-center w-full md:w-fit gap-3">
              <SearchInput
                onSearch={(searchText) =>
                  setFilters((filters) => ({ ...filters, searchText }))
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
                    title: "Expiry date range",
                    icon: <ClockAlert className="size-5" />,
                    content: (
                      <div className="flex items-center justify-between gap-3 text-xs font-medium">
                        <DateInput
                          date={filters.start}
                          setDate={(cdate) =>
                            setFilters((date) => ({ ...date, start: cdate }))
                          }
                        />
                        To
                        <DateInput
                          date={filters.end}
                          setDate={(cdate) =>
                            setFilters((date) => ({ ...date, end: cdate }))
                          }
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </Tabs>

        <TicketsTable tickets={tickets} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default SupportOverview
