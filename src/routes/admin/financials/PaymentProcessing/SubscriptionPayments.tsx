import MemoPaymentClock from "@/components/icons/PaymentClock"
import Pagination from "@/components/Pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DateInput from "@/components/widgets/DateInput"
import FilterPopover from "@/components/widgets/FilterPopover"
import SearchInput from "@/components/widgets/SearchInput"
import StatusPill from "@/components/widgets/StatusPill"
import { statusMap } from "@/lib/constants"
import { keyValue, toCurrency } from "@/lib/helpers"
import {
  PaymentFilter,
  paymentStatuses,
  useGetPaymentsQuery,
  usePaymentPrefetch,
  useRequeryPaymentMutation,
} from "@/services/payment.service"
import { Payment } from "@/types/payment.type"
import { format } from "date-fns"
import { ClockAlert, Ellipsis, RefreshCcw } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

// const adsTypes = {
//   free: { label: "Free Plan", color: "var(--primary)" },
//   basic: { label: "Basic Plan", color: "#BA19D6" },
//   business: { label: "Business Plan", color: "#3A28DD" },
// }

const SubscriptionPayments = () => {
  const [filter, setFilter] = useState<{
    start?: Date
    end?: Date
    status: Payment["status"][]
    searchText: string
    adsType?: string
  }>({ searchText: "", status: [] })

  const [currentStatus, setCurrentStatus] = useState<
    Payment["status"] | undefined
  >()
  // const [filterDialogIsOpen, setFilterDialogIsOpen] = useState(false)
  // const [paymentDialogIsOpen, setPaymentDialogIsOpen] = useState(false)
  // const [filters, setFilters] = useState<PaymentFilters>({})

  const limit = 10
  const [page, setPage] = useState(1)
  const prefetchPage = usePaymentPrefetch("getPayments")
  const [requeryPayment, { isLoading: requerying }] =
    useRequeryPaymentMutation()

  const requestOptions: PaymentFilter = useMemo(
    () => ({
      limit,
      ad_type: filter.adsType,
      date_range:
        filter.start && filter.end
          ? [
              format(filter.start, "yyyy-MM-dd"),
              format(filter.end, "yyyy-MM-dd"),
            ]
          : [],
      page,
      search: filter.searchText,
      status: currentStatus ? [currentStatus] : filter.status,
    }),
    [
      filter.adsType,
      filter.start,
      filter.end,
      filter.searchText,
      filter.status,
      page,
      currentStatus,
    ]
  )

  const { data: paymentsData, isFetching: isLoading } =
    useGetPaymentsQuery(requestOptions)

  const [payments, setPayments] = useState<Payment[]>([])
  // const [currentPayment, setCurrentPayment] = useState<Payment | null>(null)

  useEffect(() => {
    if (paymentsData) {
      setPayments(paymentsData.results)

      if (requestOptions.page - 1) {
        prefetchPage({ ...requestOptions, page: requestOptions.page - 1 })
      }
      if (paymentsData.results.length >= limit) {
        prefetchPage({ ...requestOptions, page: requestOptions.page + 1 })
      }
    }
  }, [paymentsData, prefetchPage, requestOptions])

  useEffect(() => {
    setPage(1)
  }, [filter.searchText, currentStatus])

  const requeryPaymentFn = async (payment: Payment) => {
    toast.loading("Requerying...", {
      description: "We are confirming this transaction.",
      id: "requeryingLoader",
    })

    const { data, error } = await requeryPayment({
      payment_intent_id: payment.transaction_id,
    })

    toast.dismiss("requeryingLoader")

    if (data) {
      toast.success("Success", {
        description: "Payment Status Update",
      })
    } else if (error && "message" in error) {
      toast.error("Oops", { description: error.message })
    }
  }

  return (
    <div className="pb-10">
      <Tabs defaultValue={"all"}>
        <div className="flex md:items-center justify-between gap-4 flex-col md:flex-row">
          <TabsList className="capitalize" _style={2}>
            {[
              { label: "Payment History", value: "all" },
              {
                label: "Failed Payments",
                value: "failed",
                count: payments.filter((each) => each.status == "failed")
                  .length,
              },
            ].map(({ value, label, count }) => (
              <TabsTrigger
                onClick={() => {
                  if (value == "all") {
                    setCurrentStatus(undefined)
                  } else {
                    setCurrentStatus(value as Payment["status"])
                  }
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

          <div className="flex items-center w-full md:w-fit gap-3">
            <SearchInput
              onSearch={(searchText) =>
                setFilter((filter) => ({ ...filter, searchText }))
              }
              placeholder="Search by user or subscription type"
              containerClass="h-10 rounded-lg lg:min-w-84"
            />

            <FilterPopover
              head={
                <>
                  {filter.start && filter.end && (
                    <div className="flex items-center flex-wrap gap-3">
                      <span className="bg-base-black px-2 py-1 flex items-center rounded-full gap-1 text-xs text-white">
                        <ClockAlert className="size-4" />
                        {format(filter.start, "dd MMM yyyy")} to{" "}
                        {format(filter.end, "dd MMM yyyy")}
                      </span>
                    </div>
                  )}
                </>
              }
              sections={[
                // {
                //   title: "Ads Type",
                //   icon: <MemoArmorUpgrade className="size-5" />,
                //   content: (
                //     <>
                //       {keyValue(adsTypes).map(({ key, value }) => (
                //         <div
                //           key={key}
                //           style={{ color: value.color }}
                //           className="flex items-center justify-between gap-3 text-xs font-medium"
                //         >
                //           <span className="flex items-center gap-2">
                //             <MemoShieldStar className="size-4" /> {value.label}
                //           </span>
                //           <Checkbox value={key} />
                //         </div>
                //       ))}
                //     </>
                //   ),
                // },
                ...(currentStatus
                  ? []
                  : [
                      {
                        title: "Payment Status",
                        icon: <MemoPaymentClock className="size-5" />,
                        content: (
                          <>
                            {keyValue(paymentStatuses).map(({ key, value }) => (
                              <div
                                key={key}
                                className="flex items-center justify-between gap-3 text-primary text-xs font-medium"
                              >
                                <StatusPill
                                  label={value.label}
                                  status={key as keyof typeof statusMap}
                                />
                                <Checkbox
                                  checked={filter.status?.includes(
                                    key as Payment["status"]
                                  )}
                                  onCheckedChange={(checked) =>
                                    checked
                                      ? setFilter((_) => ({
                                          ..._,
                                          status: [
                                            ..._.status,
                                            key as Payment["status"],
                                          ],
                                        }))
                                      : setFilter((_) => ({
                                          ..._,
                                          status: _.status.filter(
                                            (each) => each != key
                                          ),
                                        }))
                                  }
                                />
                              </div>
                            ))}
                          </>
                        ),
                      },
                    ]),
                {
                  title: "Expiry date range",
                  icon: <ClockAlert className="size-5" />,
                  content: (
                    <>
                      <div className="flex items-center justify-between gap-3 text-xs font-medium">
                        <DateInput
                          // max={filter.end}
                          date={filter.start}
                          setDate={(cdate) => {
                            setFilter((date) => ({
                              ...date,
                              start: cdate,
                              end:
                                cdate && date.end && cdate > date.end
                                  ? undefined
                                  : date.end,
                            }))
                          }}
                        />
                        To
                        <DateInput
                          min={filter.start}
                          date={filter.end}
                          setDate={(cdate) =>
                            setFilter((date) => ({ ...date, end: cdate }))
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

      <div className="overflow-auto mt-5 border-t border-x rounded-2xl text-neutral-800 font-medium">
        <table className="w-full">
          <thead>
            <tr className="thead-row">
              <th>Property</th>
              <th>Subscriber</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              new Array(8).fill(null).map((_, i) => (
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
                  <td>
                    <Skeleton className="h-2 w-9" />
                  </td>
                </tr>
              ))}
            {!isLoading &&
              payments.map(
                (
                  {
                    listing: { created_by, service, images, category },
                    ...each
                  },
                  i,
                  arr
                ) => (
                  <tr className="tbody-row" key={each.transaction_id}>
                    <td>
                      <span className="flex gap-2 items-center">
                        <Avatar className="size-7">
                          <AvatarImage
                            src={images[0].resource}
                            alt="Property Image"
                          />
                          <AvatarFallback>
                            {service.header.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{service.header}</span>
                      </span>
                    </td>

                    <td className="flex gap-2 items-center">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={created_by.passport}
                          alt="Profile Image"
                        />
                        <AvatarFallback>{created_by.initial}</AvatarFallback>
                      </Avatar>
                      <span>{created_by.fullname}</span>
                    </td>
                    <td className="min-w-40">
                      <span className="bg-neutral-500/10 rounded-full py-1.5 px-4 w-fit flex items-center text-xs font-medium text-neutral-500 whitespace-nowrap">
                        {category}
                      </span>
                    </td>
                    <td>{toCurrency(each.amount_paid)}</td>
                    <td className="whitespace-nowrap">
                      {each.due_date
                        ? new Date(each.due_date).toDateString()
                        : "--"}
                    </td>
                    <td>
                      <StatusPill status={each.status} />
                    </td>
                    <td>
                      {each.status == "pending" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex size-8 items-center">
                            <Ellipsis />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              disabled={requerying}
                              onClick={() => {
                                requeryPaymentFn(arr[i])
                                // setCurrentAdmin(each)
                                // setAdminDialogIsOpen(true)
                              }}
                            >
                              <RefreshCcw /> Requery Payment
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>
                          <Send /> Send Reminder Mail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          // onClick={() => deleteAdmin(each)}
                          className="text-destructive"
                        >
                          <Trash2 /> Delete
                        </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>

      <Pagination
        count={paymentsData?.count ?? 0}
        limit={limit}
        pageChange={(page) => setPage(page + 1)}
        // pageChange={pagination.changePage}
      />
    </div>
  )
}

export default SubscriptionPayments
