import DisputesTable from "@/components/DisputesTable"
import * as AlertD from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CheckCircle from "@/components/widgets/CheckCircle"
import DateInput from "@/components/widgets/DateInput"
import FilterPopover from "@/components/widgets/FilterPopover"
import RouteHead from "@/components/widgets/RouteHead"
import SearchInput from "@/components/widgets/SearchInput"
import { useAppDispatch } from "@/hooks/redux.hooks"
import { demoSubscriptionPayments } from "@/lib/constants"
import { filter as arrFilter, pluralize } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { useUpdateListStatusMutation } from "@/services/listing.service"
import { openAlertDialog } from "@/slices/app.slice"
import { format } from "date-fns"
import { Circle, ClipboardList, ClockAlert, Trash2 } from "lucide-react"
import { JSX, ReactNode, useEffect, useState } from "react"
import { toast } from "sonner"
import { SupportBreadcrumb, TicketsCardSummary } from "./Index"

type Action = "pend" | "escalate" | "resolve" | "delete" | "open"

const AdsDisputes = () => {
  const [tickets, setTickets] = useState(demoSubscriptionPayments)
  //   const [currentStatus, setCurrentStatus] = useState("all")
  const [action, setAction] = useState<Action | undefined>()
  const [selectingBulk, setSelectingBulk] = useState(false)
  const [selections, setSelections] = useState<number[]>([])
  const [filter, setFilter] = useState<{
    start?: Date
    end?: Date
    searchText: string
    adsType?: string
  }>({ searchText: "" })

  useEffect(() => {
    setTickets(
      arrFilter(demoSubscriptionPayments, filter.searchText, [
        "user",
        "property",
      ])
    )
  }, [filter.searchText])

  return (
    <div>
      <div className="flex fade flex-col gap-6 mb-6">
        <SupportBreadcrumb page="Ads Dispute" />
        <RouteHead title="Ads Disputes" />
        <TicketsCardSummary />

        <Tabs defaultValue="all">
          <div className="flex md:items-center justify-between gap-4 flex-col md:flex-row">
            <TabsList defaultValue={"all"} className="capitalize" _style={2}>
              {[
                { label: "All", value: "all" },
                {
                  label: "Resolved",
                  value: "resolved",
                },
                {
                  label: "Pending",
                  value: "pending",
                },
                {
                  label: "Escalated",
                  value: "escalated",
                },
              ].map(({ value, label }) => (
                <TabsTrigger
                  onClick={() => {
                    // setCurrentStatus(value)
                    setTickets(
                      demoSubscriptionPayments.filter((eachList) =>
                        value != "all" ? eachList.status == value : true
                      )
                    )
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
              {
                <CheckCircle
                  className="whitespace-nowrap mr-3 text-neutral-600"
                  onClick={() => {
                    setSelectingBulk(!selectingBulk)
                    if (selectingBulk) setSelections([])
                  }}
                  checked={selectingBulk}
                >
                  Bulk Select
                </CheckCircle>
              }

              <SearchInput
                onSearch={(searchText) =>
                  setFilter((filter) => ({ ...filter, searchText }))
                }
                placeholder="Search by user or property name"
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
                  {
                    title: "Expiry date range",
                    icon: <ClockAlert className="size-5" />,
                    content: (
                      <>
                        <div className="flex items-center justify-between gap-3 text-xs font-medium">
                          <DateInput
                            date={filter.start}
                            setDate={(cdate) =>
                              setFilter((date) => ({ ...date, start: cdate }))
                            }
                          />
                          To
                          <DateInput
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

        {selections[0] && (
          <div className="bg-neutral-50 fade items-center flex flex-wrap md:justify-end gap-2 p-1.5 rounded-md min-h-11">
            <div className="px-2.5 h-9 flex items-center text-sm gap-1 border rounded-md">
              {selections.length}
              <Circle className="fill-primary stroke-white size-4" />
            </div>
            <Button
              onClick={() => setAction("resolve")}
              variant={"ghost"}
              className="font-normal text-primary"
            >
              Resolve
            </Button>
            <Button
              onClick={() => setAction("open")}
              variant={"ghost"}
              className="font-normal text-[#104BB9]"
            >
              Open
            </Button>
            <Button
              onClick={() => setAction("pend")}
              variant={"ghost"}
              className="font-normal text-warning"
            >
              Pend
            </Button>
            <Button
              onClick={() => setAction("escalate")}
              variant={"ghost"}
              className="font-normal text-destructive"
            >
              Escalate
            </Button>
            <Button
              onClick={() => setAction("delete")}
              variant={"ghost"}
              className="font-normal text-destructive"
            >
              <Trash2 />
              Delete
            </Button>
          </div>
        )}

        <DisputesTable
          selecting={selectingBulk}
          selections={selections}
          setSelections={setSelections}
          tickets={tickets}
        />

        {action && (
          <ConfirmActionAlert
            selections={selections}
            setSelections={setSelections}
            action={action}
            open={!!action}
            onOpenChange={(open) => {
              if (!open) setAction(undefined)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default AdsDisputes

const ConfirmActionAlert = ({
  open,
  onOpenChange,
  selections,
  icon,
  action: actiontext,
  setSelections,
}: {
  open: boolean
  selections: number[]
  icon?: JSX.Element
  onOpenChange: (open: boolean) => void
  setSelections: (selections: number[]) => void
  action: Action
}) => {
  const dispatch = useAppDispatch()
  const [updateStatus, { isLoading }] = useUpdateListStatusMutation()

  const actions: Record<
    Action,
    {
      variant?: "success" | "destructive"
      confirm?: () => void
      title?: string
      desc?: ReactNode
    }
  > = {
    delete: {
      variant: "destructive",
      confirm: async () => {
        const { data, error } = await updateStatus({
          listing_ids: selections,
          action: "approve",
        })

        if (data) {
          setSelections([])
          onOpenChange(false)
          dispatch(
            openAlertDialog({
              desc: `You have successfully approved ${
                selections.length
              } ${pluralize(selections, "listing")}`,
              title: `${pluralize(selections, "Listing")} Approved`,
            })
          )
        } else if (error && "message" in error) {
          toast.error("Oops", {
            position: "bottom-center",
            description: error.message,
          })
        }
      },
    },
    pend: {},
    escalate: {},
    open: {},
    resolve: {},
  }

  const { variant, confirm, title, desc } = actions[actiontext]

  return (
    <AlertD.AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertD.AlertDialogContent>
        <AlertD.AlertDialogHeader className="flex flex-col items-center gap-[16px]">
          <AlertD.AlertDialogTitle
            variant={variant}
            title={title}
            icon={
              icon || (
                <ClipboardList
                  className={cn(
                    "stroke-[1.5] size-5",
                    variant == "destructive"
                      ? "text-destructive"
                      : "text-primary"
                  )}
                />
              )
            }
          />
        </AlertD.AlertDialogHeader>
        <AlertD.AlertDialogDescription>{desc}</AlertD.AlertDialogDescription>
        <AlertD.AlertDialogFooter>
          <div className="flex flex-col w-full gap-3">
            <Button
              onClick={confirm}
              isLoading={isLoading}
              className="h-11 font-normal"
            >
              Confirm
            </Button>
            <AlertD.AlertDialogCancel className="w-full h-11 font-normal border-primary text-primary">
              Cancel
            </AlertD.AlertDialogCancel>
          </div>
        </AlertD.AlertDialogFooter>
      </AlertD.AlertDialogContent>
    </AlertD.AlertDialog>
  )
}
