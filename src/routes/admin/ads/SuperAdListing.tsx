import AdEngagementChart, {
  AdPerformanceLineChart,
} from "@/components/charts/AdEngagementChart"
import ConfirmSuperAdCategoryChange from "@/components/ConfirmSuperAdCategoryChange"
import ListingDialog from "@/components/dialogs/ListingDialog"
import MemoAds from "@/components/icons/Ads"
import ListingDetails, { ListingSkeleton } from "@/components/ListingDetails"
import SuperAdListingsTable from "@/components/SuperAdListingsTable"
import * as AlertD from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import * as Bread from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/widgets/Header"
import InfoCard from "@/components/widgets/InfoCard"
import StatusPill from "@/components/widgets/StatusPill"
import WarnDialog from "@/components/widgets/WarnDialog"
import { useAppDispatch } from "@/hooks/redux.hooks"
import { pluralize } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import {
  useGetListingQuery,
  useGetListingsQuery,
} from "@/services/listing.service"
import {
  superAdsCategoryMap,
  useChangeAdStatusMutation,
  useDeleteAdMutation,
  useExtendAdMutation,
  useGetSuperAdsQuery,
} from "@/services/superAd.service"
import { openAlertDialog } from "@/slices/app.slice"
import { SuperAd } from "@/types/ad.type"
import {
  Listing,
  SuperAdListing as SuperAdListingType,
} from "@/types/listing.type"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ChevronDown,
  Edit2,
  Home,
  Layers,
  PauseCircle,
  PlayCircle,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

const SuperAdListing = () => {
  const { listing_id } = useParams()
  const { data: listing, isFetching } = useGetListingQuery(listing_id!)
  const [updateAdStatus, { isLoading: isUpdatingStatus }] =
    useChangeAdStatusMutation()
  const [deleteAd, { isLoading: isDeleting }] = useDeleteAdMutation()
  const [listingDialogIsOpen, setListingDialogIsOpen] = useState(false)
  const [warnAlertIsOpen, setWarnAlertIsOpen] = useState(false)
  const [statusAlertIsOpen, setStatusAlertIsOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState("listing")
  const [currentListing, setCurrentListing] = useState<Listing | undefined>()
  const [extendFormIsOpen, setExtendFormIsOpen] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (listing) {
      setCurrentListing(listing)
    }
  }, [listing])

  useEffect(() => {
    setCurrentTab("listing")
    document
      .getElementById("outletContainer")
      ?.scrollTo({ top: 0, behavior: "smooth" })
  }, [listing_id])

  const handleDeleteAd = async () => {
    setWarnAlertIsOpen(false)

    toast.loading("Deleting...", {
      description: "Ad deletion in progress.",
      id: "progressLoader",
    })

    const { error } = await deleteAd(listing?.super_ad?.id)

    toast.dismiss("progressLoader")

    if (!error) {
      toast.success("Deletion Successful", {
        description: `You have successfully take down Super Ad for ${listing?.service.header} listing`,
        duration: 5000,
      })
      navigate("/admin/ads/super")
    } else if ("message" in error) {
      toast.error("Oops", { description: error.message })
    }
  }

  const handleAdStatus = async () => {
    setStatusAlertIsOpen(false)

    toast.loading("Updating...", {
      description: "Super Ad status update in progress.",
      id: "progressLoader",
    })

    const { data, error } = await updateAdStatus({
      id: listing?.super_ad?.id,
      action: listing?.super_ad?.status == "active" ? "paused" : "active",
    })

    toast.dismiss("progressLoader")

    if (data) {
      dispatch(
        openAlertDialog({
          title: `${
            listing?.super_ad?.status == "active" ? "Pause" : "Activation"
          } Successful`,
          desc: `You have successfully ${
            listing?.super_ad?.status == "active" ? "pause" : "activate"
          } this Ad. A notification will be sent to the service provider to this effect.`,
          buttonLabel: "Continue",
        })
      )
    } else if (error && "message" in error) {
      toast.error("Oops", { description: error.message })
    }
  }

  return (
    <div>
      <Header />
      {!isFetching && listing && (
        <>
          <Breadcrumb page={listing.service.header} />
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <div className="flex items-center justify-between gap-3 flex-wrap border-b pb-2 mb-2">
              <TabsList className="capitalize">
                <TabsTrigger value="listing">Listing</TabsTrigger>
                <TabsTrigger value="ads-info">Ads Information</TabsTrigger>
              </TabsList>

              <div className="flex flex-wrap gap-2.5">
                {listing.super_ad?.status != "expired" && (
                  <Button
                    isLoading={isUpdatingStatus}
                    onClick={() => setStatusAlertIsOpen(true)}
                    variant={"secondary"}
                    className="text-primary bg-primary/10 font-normal"
                  >
                    {listing.super_ad?.status == "active" ? (
                      <>
                        <PauseCircle /> Pause
                      </>
                    ) : (
                      <>
                        <PlayCircle /> Activate
                      </>
                    )}
                  </Button>
                )}
                <Button
                  onClick={() => setExtendFormIsOpen(true)}
                  className="shadow-none font-normal"
                >
                  <Layers /> Extent Ad
                </Button>
                <Button
                  onClick={() => {
                    setListingDialogIsOpen(true)
                  }}
                  variant={"outline"}
                  className="font-normal"
                >
                  <Edit2 /> Edit Ad
                </Button>
                <Button
                  onClick={() => {
                    setWarnAlertIsOpen(true)
                  }}
                  isLoading={isDeleting}
                  variant={"destructive"}
                  className="font-normal"
                >
                  <Trash2 /> Remove Ad
                </Button>
              </div>
            </div>

            <TabsContent value="listing">
              <div className="max-w-[49.5rem] pb-6">
                <ListingDetails listing={listing} />
              </div>
            </TabsContent>
            <TabsContent value="ads-info">
              <AdsInfo listing={listing} />
            </TabsContent>
          </Tabs>
        </>
      )}

      {isFetching && (
        <div className="flex flex-col gap-6 mt-2">
          <Skeleton className="h-4 w-1/3" />
          <div className="flex items-center flex-wrap gap-4 justify-between">
            <div className="flex gap-x-4 flex-wrap">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="flex gap-x-4 flex-wrap">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24 delay-200" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24 delay-100" />
            </div>
          </div>
          <div className="max-w-[49.5rem] pb-6">
            <ListingSkeleton />
          </div>
        </div>
      )}

      <ListingDialog
        editing
        setListing={setCurrentListing}
        onOpenChange={setListingDialogIsOpen}
        listing={currentListing ?? null}
        open={listingDialogIsOpen}
      />

      {listing && (
        <ExtendAdAlert
          open={extendFormIsOpen}
          listing={listing}
          setOpen={setExtendFormIsOpen}
        />
      )}

      <WarnDialog
        onConfirm={handleDeleteAd}
        open={warnAlertIsOpen}
        setOpen={setWarnAlertIsOpen}
        title="Delete Ad?"
        desc="Please note that this action is not reversible, are you sure you want to take down this Ad?"
      />

      <WarnDialog
        icon={<PauseCircle />}
        variant="primary"
        onConfirm={handleAdStatus}
        open={statusAlertIsOpen}
        setOpen={setStatusAlertIsOpen}
        title={
          listing?.super_ad?.status == "active"
            ? "Pause Super Ad?"
            : "Activate Super Ad"
        }
        desc={
          listing?.super_ad?.status == "active"
            ? "You are about to pause this ads. This puts a stop to all the features of this Ad. Do you still want to proceed?"
            : "You are about to activate this ad. Do you want to proceed?"
        }
      />
    </div>
  )
}

export default SuperAdListing

const AdsInfo = ({ listing }: { listing: Listing }) => {
  const { data: superAdsCategories } = useGetSuperAdsQuery("")
  const { data: listingsData, isLoading } = useGetListingsQuery({
    page: 5,
    limit: 5,
  })

  const [selectedSuperAd, setSelectedSuperAd] = useState<SuperAd | undefined>()
  const [confirmStatusChangeIsOpen, setConfirmStatusChangeIsOpen] =
    useState(false)

  return (
    <>
      <div className="flex flex-col gap-5 pb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 w-full sm:min-w-sm border rounded-lg">
            <div className="border-b py-3 px-6 flex gap-3 justify-between">
              <h3 className="font-semibold">Ads Information</h3>
              <span className="flex gap-2 items-center">
                {listing.images[0] ? (
                  <img
                    src={listing.images[0].resource}
                    className="rounded-full size-6 object-cover"
                  />
                ) : (
                  <div className="bg-neutral-100 size-6 rounded-full"></div>
                )}
                <span className="font-medium text-sm">
                  {listing.service.header}
                </span>
              </span>
            </div>

            <div className="px-6">
              <div className="flex border-b py-4 justify-between gap-3">
                <span className="text-muted-foreground">Category</span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-full">
                    {listing.super_ad?.super_ads_category?.tier && (
                      <StatusPill
                        noIcon
                        className="py-1.5 px-2.5 text-xs"
                        color={
                          superAdsCategoryMap[
                            listing.super_ad?.super_ads_category?.tier
                          ].color
                        }
                        label={
                          <span className="flex gap-1 items-center">
                            {listing.super_ad?.super_ads_category?.title}{" "}
                            <ChevronDown className="size-4" />
                          </span>
                        }
                      />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {superAdsCategories?.map((each) => (
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedSuperAd(each)
                          setConfirmStatusChangeIsOpen(true)
                        }}
                        style={{
                          color: superAdsCategoryMap[each.tier].color,
                        }}
                        key={each.id + "sac"}
                      >
                        {each.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex border-b py-4 justify-between gap-3">
                <span className="text-muted-foreground">Property</span>
                <span className="flex gap-2 items-center">
                  {listing.images[0] ? (
                    <img
                      src={listing.images[0].resource}
                      className="rounded-full size-6 object-cover"
                    />
                  ) : (
                    <div className="bg-neutral-100 size-6 rounded-full"></div>
                  )}
                  <span className="font-medium text-sm">
                    {listing.service.header}
                  </span>
                </span>
              </div>
              <div className="flex border-b py-4 justify-between gap-3">
                <span className="text-muted-foreground">Ad Title</span>
                <span className="font-medium text-sm">--</span>
              </div>
              <div className="flex border-b py-4 justify-between gap-3">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-medium text-sm">
                  {listing.super_ad?.start_date
                    ? new Date(listing.super_ad?.start_date).toDateString()
                    : "--"}
                </span>
              </div>
              <div className="flex border-b py-4 justify-between gap-3">
                <span className="text-muted-foreground">End Date</span>
                <span className="font-medium text-sm">
                  {listing.super_ad?.end_date
                    ? new Date(listing.super_ad?.end_date).toDateString()
                    : "--"}
                </span>
              </div>
              <div className="flex py-4 justify-between gap-3">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-sm">
                  <StatusPill status={listing.super_ad?.status} />
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 justify-between">
            <InfoCard rate={0} title="Total Revenue" isAmount value={0} />
            <InfoCard
              rate={0}
              title="Impressions"
              value={listing.impressions}
            />
            <InfoCard
              rate={0}
              title="Click Through Rate"
              value={listing.clicks}
            />
          </div>

          <div className="flex-1 min-w-full sm:min-w-xs">
            <AdEngagementChart />
          </div>
        </div>

        <div className="">
          <AdPerformanceLineChart />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-forground">
            Full List of Super Ads by
          </span>{" "}
          <Separator orientation="vertical" className="h-8 bg-neutral-200" />
          <div className="flex items-center gap-2 text-sm text-neutral-800">
            <Avatar className="size-8">
              <AvatarImage
                src={listing?.created_by.passport}
                className="object-cover"
                alt="Profile Image"
              />
              <AvatarFallback>{listing.created_by.initial}</AvatarFallback>
            </Avatar>
            <span>{listing.created_by.fullname}</span>
          </div>
        </div>

        <SuperAdListingsTable
          isLoading={isLoading}
          listings={listingsData?.results ?? []}
        />
      </div>

      {listing && selectedSuperAd && (
        <ConfirmSuperAdCategoryChange
          open={confirmStatusChangeIsOpen}
          onOpenChange={setConfirmStatusChangeIsOpen}
          listing={listing as SuperAdListingType}
          superAd={selectedSuperAd}
        />
      )}
    </>
  )
}

const Breadcrumb = ({ page }: { page: string }) => {
  return (
    <Bread.Breadcrumb className="mb-4 mt-2">
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
            <Link to="/admin/ads/super" className="flex items-center gap-1">
              <MemoAds className="size-4" /> Ads Management
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

const extendForm = z.object({
  days: z.coerce
    .number({ invalid_type_error: "You must input a valid number of day(s)" })
    .int()
    .min(1, {
      message: "You can't add less than 1 day",
    }),
})

const ExtendAdAlert = ({
  open,
  listing,
  setOpen,
}: {
  listing: Listing
  open: boolean
  setOpen: (open: boolean) => void
}) => {
  const [extendAd, { isLoading }] = useExtendAdMutation()
  const dispatch = useAppDispatch()

  const form = useForm<z.infer<typeof extendForm>>({
    resolver: zodResolver(extendForm),
  })

  const handleExtendAd = async (values: z.infer<typeof extendForm>) => {
    const { error, data } = await extendAd({
      id: listing.super_ad?.id,
      days: values.days,
    })

    if (data) {
      setOpen(false)
      dispatch(
        openAlertDialog({
          desc: `You have successfully extended this Ad with ${
            values.days
          } ${pluralize(values.days, "day")}`,
          // desc: `You have successfully extended this Ad. New end time for Ad has been set to 30th March 2025`,
          title: "Ad has been extended successfully",
        })
      )
    } else if (error && "message" in error) {
      toast.error("Oops", { description: error.message })
    }
  }

  return (
    <AlertD.AlertDialog open={open} onOpenChange={setOpen}>
      <AlertD.AlertDialogContent className="px-0 pb-5 rounded-xl">
        <AlertD.AlertDialogHeader className="flex px-5 flex-col items-center gap-[16px]">
          <AlertD.AlertDialogTitle className="text-start font-semibold w-full">
            Extend Ad
          </AlertD.AlertDialogTitle>
        </AlertD.AlertDialogHeader>
        <AlertD.AlertDialogDescription className="text-start px-5 w-full ml-0 text-foreground text-base">
          This Ad ends on{" "}
          <span className="font-semibold">
            {listing.super_ad
              ? new Date(listing.super_ad?.end_date).toDateString()
              : ""}
          </span>
          . <br /> Please note that this action is not reversible. Are you sure
          you want to extend
        </AlertD.AlertDialogDescription>
        <Form {...form}>
          <form
            className="flex flex-col gap-16 mt-4"
            onSubmit={form.handleSubmit(handleExtendAd)}
          >
            <div className="px-5">
              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter number of days to extend</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span
                          className={cn(
                            "absolute h-full text-sm flex items-center right-4 pointer-events-none",
                            field.disabled && "opacity-50"
                          )}
                        >
                          Days
                        </span>
                        <Input inputMode="numeric" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <AlertD.AlertDialogFooter className="border-t px-5 pt-5">
              <AlertD.AlertDialogCancel asChild>
                <Button
                  disabled={isLoading}
                  variant={"outline"}
                  className="w-full h-11 text-foreground font-normal"
                >
                  Cancel
                </Button>
              </AlertD.AlertDialogCancel>
              <Button isLoading={isLoading} className="w-full h-11 font-normal">
                Extend
              </Button>
            </AlertD.AlertDialogFooter>
          </form>
        </Form>
      </AlertD.AlertDialogContent>
    </AlertD.AlertDialog>
  )
}
