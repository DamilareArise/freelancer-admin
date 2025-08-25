import { ListingFilters } from "@/components/dialogs/ListFilterDialog"
import ListingDialog from "@/components/dialogs/ListingDialog"
import MemoArmorUpgrade from "@/components/icons/ArmorUpgrade"
import MemoPaymentClock from "@/components/icons/PaymentClock"
import MemoShieldStar from "@/components/icons/ShieldStar"
import MemoSort from "@/components/icons/Sort"
import Pagination from "@/components/Pagination"
import SuperAdListingsTable from "@/components/SuperAdListingsTable"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DateInput from "@/components/widgets/DateInput"
import ListCard, { ListCardSkeleton } from "@/components/widgets/ListCard"
import SearchInput from "@/components/widgets/SearchInput"
import StatusPill from "@/components/widgets/StatusPill"
import { statusMap } from "@/lib/constants"
import { keyValue, pluralize } from "@/lib/helpers"
import {
  useGetSuperAdListingsQuery,
  useListingPrefetch,
} from "@/services/listing.service"
import { paymentStatuses } from "@/services/payment.service"
import {
  superAdsCategoryMap,
  useGetSuperAdsQuery,
} from "@/services/superAd.service"
import { Listing, SuperAdListing } from "@/types/listing.type"
import { format } from "date-fns"
import { ClockAlert, LayoutGrid, LayoutList, XCircle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

const SuperAdsLists = () => {
  const [currentStatus, setCurrentStatus] =
    useState<Listing["status"]>("approved")
  const [filterDialogIsOpen, setFilterDialogIsOpen] = useState(false)
  const [layout, setLayout] = useState<"grid" | "list">("grid")
  const [listingDialogIsOpen, setListingDialogIsOpen] = useState(false)
  const [filters, setFilters] = useState<
    ListingFilters & {
      start?: Date
      end?: Date
      searchText: string
      ad_type: number[]
      status?: string[]
      payment_status: string[]
    }
  >({ searchText: "", status: [], ad_type: [], payment_status: [] })

  const limit = 20
  const [page, setPage] = useState(1)
  const prefetchPage = useListingPrefetch("getSuperAdListings")
  const requestOptions = useMemo(
    () => ({
      limit,
      page,
      search: filters.searchText,
      // status: currentStatus,
      // price_range: filters.price_range
      //   ? JSON.stringify(filters.price_range)
      //   : "",
      ad_type: filters.ad_type,
      payment_status: filters.payment_status,
    }),
    [
      page,
      filters.searchText,
      filters.ad_type,
      filters.payment_status,
      // currentStatus,
    ]
  )

  const { data: listingData, isFetching: isLoading } =
    useGetSuperAdListingsQuery(requestOptions)
  const { data: superAdsCategories } = useGetSuperAdsQuery("")
  const [listings, setListings] = useState<SuperAdListing[]>([])
  const [currentListing, setCurrentListing] = useState<SuperAdListing | null>(
    null
  )

  useEffect(() => {
    if (listingData) {
      setListings(listingData.results)

      if (requestOptions.page - 1) {
        prefetchPage({ ...requestOptions, page: requestOptions.page - 1 })
      }
      if (listingData?.results.length >= limit) {
        prefetchPage({ ...requestOptions, page: requestOptions.page + 1 })
      }
    }
  }, [listingData, prefetchPage, requestOptions])

  useEffect(() => {
    setPage(1)
  }, [filters.searchText, currentStatus, filters])

  return (
    <div className="">
      <div className="mb-12 flex flex-col gap-5">
        <Tabs defaultValue={currentStatus}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <TabsList className="capitalize" _style={2}>
              {(
                [
                  {
                    label: "Active",
                    value: "approved",
                  },
                  {
                    label: "Expired",
                    value: "rejected",
                  },
                ] as {
                  label: string
                  value: Listing["status"]
                  count?: number
                }[]
              ).map(({ value, label, count }) => (
                <TabsTrigger
                  onClick={() => {
                    setCurrentStatus(value)
                  }}
                  key={label}
                  value={value}
                  _style={2}
                  count={count}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setLayout(layout == "grid" ? "list" : "grid")}
                className="border h-10 flex items-center text-dark-2 px-4 py-2 text-sm rounded-lg gap-1"
              >
                {layout == "grid" ? (
                  <>
                    <LayoutGrid className="size-4" /> Grid
                  </>
                ) : (
                  <>
                    <LayoutList className="size-4" /> List
                  </>
                )}
              </button>

              <Popover
                open={filterDialogIsOpen}
                onOpenChange={setFilterDialogIsOpen}
              >
                <PopoverTrigger asChild>
                  <button className="border h-10 flex items-center text-dark-2 px-4 py-2 text-sm rounded-lg gap-1">
                    <MemoSort /> Filters
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="flex flex-col gap-5 max-h-[calc(100dvh_-_12rem)] w-[calc(100dvw_-_3rem)] overflow-auto max-w-sm px-0 pt-0 pb-4"
                >
                  <div className="flex bg-gray-50 px-6 py-5 items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-neutral-800">
                      Filter
                    </h3>
                    <button onClick={() => setFilterDialogIsOpen(false)}>
                      <XCircle className="size-6 stroke-neutral-800 stroke-[1.5]" />
                    </button>
                  </div>
                  <div className="px-3 flex flex-col gap-4">
                    <SearchInput
                      onSearch={(searchText) =>
                        setFilters((filter) => ({ ...filter, searchText }))
                      }
                      placeholder="Search"
                      containerClass="h-10 rounded-lg w-full bg-white"
                    />
                    <div className="flex items-center flex-wrap gap-3">
                      {filters.start && filters.end && (
                        <span className="bg-base-black px-2 py-1 flex items-center rounded-full gap-1 text-xs text-white">
                          <ClockAlert className="size-4" />
                          {format(filters.start, "dd MMM yyyy")} to{" "}
                          {format(filters.end, "dd MMM yyyy")}
                        </span>
                      )}
                    </div>
                    <div className="bg-gray-50 rounded-md">
                      <div className="p-3.5 border-b">
                        <div className="flex text-neutral-600 font-semibold text-sm items-center gap-3">
                          <MemoArmorUpgrade className="size-5" />{" "}
                          <span>Ads Type</span>
                        </div>
                        <div className="flex flex-col gap-3 pl-4 pb-2 pt-4">
                          {superAdsCategories?.map(({ title, id, tier }) => (
                            <div
                              key={id}
                              style={{ color: superAdsCategoryMap[tier].color }}
                              className="flex items-center justify-between gap-3 text-xs font-medium"
                            >
                              <span className="flex items-center gap-2">
                                <MemoShieldStar className="size-4" /> {title}
                              </span>
                              <Checkbox
                                value={id}
                                checked={filters.ad_type?.includes(id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFilters((filter) => ({
                                      ...filter,
                                      ad_type: [...filter.ad_type, id],
                                    }))
                                  } else {
                                    setFilters((filter) => ({
                                      ...filter,
                                      ad_type: filter.ad_type?.filter(
                                        (ad) => ad != id
                                      ),
                                    }))
                                  }
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-3.5 border-b">
                        <div className="flex text-neutral-600 font-semibold text-sm items-center gap-3">
                          <MemoPaymentClock className="size-5" />
                          <span>Payment Status</span>
                        </div>
                        <div className="flex flex-col gap-3 pl-4 pb-2 pt-4">
                          {keyValue(paymentStatuses).map(
                            ({ key, value: { label } }) => (
                              <div
                                key={key}
                                className="flex items-center justify-between gap-3 text-primary text-xs font-medium"
                              >
                                <StatusPill
                                  label={label}
                                  status={key as keyof typeof statusMap}
                                />
                                <Checkbox
                                  checked={filters.payment_status?.includes(
                                    key
                                  )}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFilters((filter) => ({
                                        ...filter,
                                        payment_status: [
                                          ...filter.payment_status,
                                          key,
                                        ],
                                      }))
                                    } else {
                                      setFilters((filter) => ({
                                        ...filter,
                                        payment_status:
                                          filter.payment_status?.filter(
                                            (ad) => ad != key
                                          ),
                                      }))
                                    }
                                  }}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div className="p-3.5">
                        <div className="flex text-neutral-600 font-semibold text-sm items-center gap-3">
                          <ClockAlert className="size-5" />
                          <span>Expiry date range</span>
                        </div>
                        <div className="flex flex-col gap-3 pb-2 pt-4">
                          <div className="flex items-center justify-between gap-3 text-xs font-medium">
                            <DateInput
                              date={filters.start}
                              setDate={(cdate) =>
                                setFilters((date) => ({
                                  ...date,
                                  start: cdate,
                                }))
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
                        </div>
                      </div>
                    </div>
                    {/* <Button>Apply</Button> */}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Tabs>

        {layout == "grid" ? (
          <div className="fade grid-cols-auto xs:[--col-w:17rem] gap-4 flex-wrap">
            {isLoading &&
              new Array(limit)
                .fill(null)
                .map((_, i) => <ListCardSkeleton key={i + "skeleton"} />)}

            {!isLoading &&
              listings.map((each, i) => {
                return (
                  <Link to={`./${each.id}`} key={`listing${i}`}>
                    <ListCard
                      hideStatus
                      badge={
                        <span className="bg-primary top-0 absolute right-0 text-primary-foreground text-xs px-2 py-1">
                          {each.days_left} {pluralize(each.days_left, "day")}{" "}
                          left
                        </span>
                      }
                      listing={each}
                    />
                  </Link>
                )
              })}
          </div>
        ) : (
          <SuperAdListingsTable isLoading={isLoading} listings={listings} />
        )}

        <ListingDialog
          setListing={(listing) => {
            setCurrentListing(listing as SuperAdListing)
          }}
          onOpenChange={setListingDialogIsOpen}
          listing={currentListing}
          open={listingDialogIsOpen}
        />

        <Pagination
          count={listingData?.count ?? 0}
          limit={limit}
          pageChange={(page) => setPage(page + 1)}
          // pageChange={pagination.changePage}
        />
      </div>
    </div>
  )
}

export default SuperAdsLists
