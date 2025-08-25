import { ListingFilters } from "@/components/dialogs/ListFilterDialog"
import MemoSort from "@/components/icons/Sort"
import Pagination from "@/components/Pagination"
import * as AlertD from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import CheckCircle from "@/components/widgets/CheckCircle"
import FilterBadge from "@/components/widgets/FilterBadge"
import ListCard, { ListCardSkeleton } from "@/components/widgets/ListCard"
import ListingSummary from "@/components/widgets/ListingSummary"
import SearchInput from "@/components/widgets/SearchInput"
import { useAppDispatch } from "@/hooks/redux.hooks"
import { pluralize, shortNum } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import {
  rejectionForm,
  RejectionFormType,
  rejectionReasons,
  useGetListingsQuery,
  useListingPrefetch,
  useUpdateListStatusMutation,
} from "@/services/listing.service"
import { openAlertDialog } from "@/slices/app.slice"
import { Listing } from "@/types/listing.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { ClipboardList, ClipboardXIcon } from "lucide-react"
import { lazy, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
const ListingDialog = lazy(() => import("@/components/dialogs/ListingDialog"))

const ListingFilterDialog = lazy(
  () => import("@/components/dialogs/ListFilterDialog")
)

const ListingManagement = () => {
  const [currentStatus, setCurrentStatus] = useState<
    Listing["status"] | undefined
  >()
  const [filterDialogIsOpen, setFilterDialogIsOpen] = useState(false)
  const [listingDialogIsOpen, setListingDialogIsOpen] = useState(false)
  const [filters, setFilters] = useState<ListingFilters>({})
  const limit = 20
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const prefetchPage = useListingPrefetch("getListings")
  const requestOptions = useMemo(
    () => ({
      limit,
      page,
      search: searchText,
      status: currentStatus,
      price_range: filters.price_range
        ? JSON.stringify(filters.price_range)
        : "",
      category_ids:
        filters.categories && filters.categories[0]
          ? JSON.stringify(filters.categories.map((each) => each.id))
          : "",
    }),
    [currentStatus, filters.categories, filters.price_range, page, searchText]
  )

  const { data: listingData, isFetching: isLoading } =
    useGetListingsQuery(requestOptions)
  const [listings, setListings] = useState<Listing[]>([])
  const [currentListing, setCurrentListing] = useState<Listing | null>(null)
  const [confirmBulkApprovalIsOpen, setConfirmBulkApprovalIsOpen] =
    useState(false)
  const [confirmBulkRejectionIsOpen, setConfirmBulkRejectionIsOpen] =
    useState(false)
  const [selections, setSelections] = useState<number[]>([])

  useEffect(() => {
    if (listingData) {
      setListings(listingData.results)
    }
  }, [listingData])

  useEffect(() => {
    setPage(1)
  }, [searchText, currentStatus, filters])

  useEffect(() => {
    if (requestOptions.page - 1) {
      prefetchPage({ ...requestOptions, page: requestOptions.page - 1 })
    }
    prefetchPage({ ...requestOptions, page: requestOptions.page + 1 })
  }, [prefetchPage, requestOptions])

  return (
    <div className="">
      <ListingSummary />

      <div className="mt-10 mb-12 flex flex-col gap-5">
        <div className="flex justify-between gap-4">
          <SearchInput
            onSearch={setSearchText}
            placeholder="Search listings, price, description, categories"
          />
          <Dialog
            open={filterDialogIsOpen}
            onOpenChange={(open) => setFilterDialogIsOpen(open)}
          >
            <DialogTrigger className="border flex items-center text-dark-2 px-4 py-2 text-sm rounded-lg gap-1">
              <MemoSort /> Filter
            </DialogTrigger>
            <ListingFilterDialog
              filters={filters}
              setFilters={setFilters}
              setOpen={setFilterDialogIsOpen}
              open={filterDialogIsOpen}
            />
          </Dialog>
        </div>

        <Tabs>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <TabsList className="capitalize" _style={2}>
              {(
                [
                  { label: "All listings", value: undefined },
                  { label: "Approved", value: "approved" },
                  {
                    label: "Pending",
                    value: "pending",
                    count: listingData?.pending_count,
                  },
                  {
                    label: "Rejected",
                    value: "rejected",
                    count: listingData?.rejected_count,
                  },
                  { label: "Expired", value: "expired" },
                ] as {
                  label: string
                  value: Listing["status"]
                  count?: number
                }[]
              ).map(({ value, label, count }) => (
                <TabsTrigger
                  isActive={currentStatus == value}
                  onClick={() => {
                    setCurrentStatus(value)
                  }}
                  key={label}
                  value={String(value)}
                  _style={2}
                  count={count}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex items-center">
              <div className="flex items-center flex-wrap gap-5">
                {currentStatus == "pending" && (
                  <CheckCircle
                    className="ml-auto"
                    onClick={() =>
                      setSelections((s) =>
                        s[0] ? [] : listings.map((each) => each.id)
                      )
                    }
                    checked={selections.length == listings.length}
                  >
                    Select
                  </CheckCircle>
                )}

                {filters.rating && (
                  <FilterBadge
                    onClose={() => {
                      setFilters({ ...filters, rating: undefined })
                    }}
                  >
                    {filters.rating.label}
                  </FilterBadge>
                )}

                {filters.price_range && (
                  <FilterBadge
                    onClose={() => {
                      setFilters({ ...filters, price_range: undefined })
                    }}
                  >
                    {shortNum(filters.price_range[0], true)}～
                    {shortNum(filters.price_range[1], true)}
                  </FilterBadge>
                )}

                {filters.categories && filters.categories[0] && (
                  <FilterBadge
                    onClose={() => {
                      setFilters({ ...filters, categories: undefined })
                    }}
                  >
                    {filters.categories[0].name}{" "}
                    {filters.categories.length > 1 && (
                      <span className="text-xs text-neutral-500">
                        and {filters.categories.length - 1}{" "}
                        {pluralize(filters.categories.length - 1, "other")}
                      </span>
                    )}
                  </FilterBadge>
                )}
              </div>
            </div>
          </div>
        </Tabs>

        <div
          id="listings"
          className="grid-cols-auto xs:[--col-w:17rem] gap-4 flex-wrap"
        >
          {isLoading &&
            new Array(limit)
              .fill(null)
              .map((_, i) => <ListCardSkeleton key={i + "skeleton"} />)}
          {!isLoading &&
            listings.map((each, i) => {
              return (
                <button
                  onClick={() => {
                    setCurrentListing(each)
                    setListingDialogIsOpen(true)
                  }}
                  key={`listing${i}`}
                >
                  <ListCard
                    listing={each}
                    selectionChange={(selected) => {
                      if (selected) {
                        setSelections((s) => [...s, each.id])
                      } else {
                        setSelections((s) => s.filter((e) => e != each.id))
                      }
                    }}
                    selected={selections.includes(each.id)}
                    selecting={currentStatus == "pending"}
                  />
                </button>
              )
            })}

          <ListingDialog
            setListing={setCurrentListing}
            onOpenChange={setListingDialogIsOpen}
            listing={currentListing}
            open={listingDialogIsOpen}
          />
        </div>
        <Pagination
          count={listingData?.count ?? 0}
          limit={limit}
          pageChange={(page) => setPage(page + 1)}
          // pageChange={pagination.changePage}
        />
      </div>

      <div
        style={{ boxShadow: "-1px 0 10px #ccc" }}
        className={cn(
          " flex justify-end py-5 fixed w-screen bg-white lg:max-w-[calc(100vw_-_15rem)] right-0 px-8 transition-all duration-500",
          selections.length > 0
            ? "opacity-100 bottom-0"
            : "-bottom-20 opacity-0"
        )}
      >
        <div className="flex w-full items-center gap-3 max-w-md">
          <Button
            onClick={() => setConfirmBulkRejectionIsOpen(true)}
            className="flex-1 h-11 font-normal"
            variant={"destructive"}
          >
            Reject {selections.length} {pluralize(selections.length, "listing")}
          </Button>
          <Button
            className="flex-1 h-11 font-normal"
            onClick={() => setConfirmBulkApprovalIsOpen(true)}
          >
            Approve {selections.length}{" "}
            {pluralize(selections.length, "listing")}
          </Button>
        </div>
      </div>
      <ConfirmBulkApprovalAlert
        setSelections={setSelections}
        selections={selections}
        open={confirmBulkApprovalIsOpen}
        onOpenChange={setConfirmBulkApprovalIsOpen}
      />
      <ConfirmBulkRejectionAlert
        setSelections={setSelections}
        selections={selections}
        open={confirmBulkRejectionIsOpen}
        onOpenChange={setConfirmBulkRejectionIsOpen}
      />
    </div>
  )
}

export default ListingManagement

const ConfirmBulkApprovalAlert = ({
  open,
  onOpenChange,
  selections,
  setSelections,
}: {
  open: boolean
  selections: Listing["id"][]
  onOpenChange: (open: boolean) => void
  setSelections: (selections: Listing["id"][]) => void
}) => {
  const dispatch = useAppDispatch()
  const [updateStatus, { isLoading }] = useUpdateListStatusMutation()

  const confirm = async () => {
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
  }
  return (
    <AlertD.AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertD.AlertDialogContent>
        <AlertD.AlertDialogHeader className="flex flex-col items-center gap-[16px]">
          <AlertD.AlertDialogTitle
            title="Confirm Bulk Approval"
            icon={
              <ClipboardList className="text-primary stroke-[1.5] size-5" />
            }
          />
        </AlertD.AlertDialogHeader>
        <AlertD.AlertDialogDescription>
          You are about to approve{" "}
          <span className="text-primary">{selections.length}</span>{" "}
          {pluralize(selections.length, "listing")}. Once approved,{" "}
          {pluralize(selections.length, "this listing", "these listings")} will
          be live and visible to all users
        </AlertD.AlertDialogDescription>
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

const ConfirmBulkRejectionAlert = ({
  open,
  onOpenChange,
  selections,
  setSelections,
}: {
  selections: Listing["id"][]
  setSelections: (selections: Listing["id"][]) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const dispatch = useAppDispatch()
  const [updateStatus, { isLoading }] = useUpdateListStatusMutation()
  const form = useForm<RejectionFormType>({
    resolver: zodResolver(rejectionForm),
  })

  useEffect(() => {
    if (!open) {
      form.reset({})
    }
  }, [open, form])

  const onSubmit = async (values: RejectionFormType) => {
    const { data, error } = await updateStatus({
      listing_ids: selections,
      action: "reject",
      rejection_reasons: values.items.map((each) =>
        each == "Other" ? values.other : each
      ),
    })

    if (data) {
      setSelections([])
      onOpenChange(false)
      dispatch(
        openAlertDialog({
          desc: `You have successfully rejected ${
            selections.length
          } ${pluralize(selections.length, "listing")}`,
          title: "Listings Rejected",
        })
      )
    } else if (error && "message" in error) {
      toast.error("Oops", {
        position: "bottom-center",
        description: error.message,
      })
    }
  }

  return (
    <AlertD.AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertD.AlertDialogContent>
        <AlertD.AlertDialogHeader className="flex flex-col items-center gap-[16px]">
          <AlertD.AlertDialogTitle
            variant="destructive"
            title="Confirm Bulk Rejection"
            icon={
              <ClipboardXIcon className="text-destructive stroke-[1.5] size-5" />
            }
          />
        </AlertD.AlertDialogHeader>
        <AlertD.AlertDialogDescription className="text-start max-w-full px-0">
          You are about to reject{" "}
          <span className="text-desctructive">{selections.length}</span>{" "}
          {pluralize(selections.length, "listing")}. Once rejected,{" "}
          {pluralize(selections.length, "this listing", "these listings")} will
          not be visible to users and the owners will be notified. <br /> <br />{" "}
          Why do you want to reject{" "}
          {pluralize(selections.length, "this listing", "these listings")}?,
          Give a reason(s) below to help the users when resubmitting
        </AlertD.AlertDialogDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <FormItem>
                  {rejectionReasons.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-center space-x-2 space-y-1"
                          >
                            <FormControl>
                              <Checkbox
                                className="shadow-none"
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        item,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-muted-foreground">
                              {item}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="other"
              disabled={!form.getValues("items")?.includes("others")}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Reason"
                      className="resize-none min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertD.AlertDialogFooter>
              <div className="flex flex-col w-full gap-3 mt-2">
                <Button
                  isLoading={isLoading}
                  variant={"destructive"}
                  className="h-11 text-white font-normal"
                >
                  Confirm Rejection
                </Button>
              </div>
            </AlertD.AlertDialogFooter>
          </form>
        </Form>
      </AlertD.AlertDialogContent>
    </AlertD.AlertDialog>
  )
}
