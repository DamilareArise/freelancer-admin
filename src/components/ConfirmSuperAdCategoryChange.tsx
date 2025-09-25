import * as AlertD from "@/components/ui/alert-dialog"
import { useAppDispatch } from "@/hooks/redux.hooks"
import { useChangeSuperAdCategoryMutation } from "@/services/superAd.service"
import { openAlertDialog } from "@/slices/app.slice"
import { SuperAd } from "@/types/ad.type"
import { SuperAdListing } from "@/types/listing.type"
import { CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "./ui/button"

const ConfirmSuperAdCategoryChange = ({
  open,
  onOpenChange,
  setListing,
  listing,
  superAd,
}: {
  open: boolean
  listing: SuperAdListing
  superAd: SuperAd
  onOpenChange: (open: boolean) => void
  setListing?: (listing: SuperAdListing | null) => void
}) => {
  const [updateSuperAdCategory, { isLoading }] =
    useChangeSuperAdCategoryMutation()
  const dispatch = useAppDispatch()

  const handleUpdate = async () => {
    const { data, error } = await updateSuperAdCategory({
      id: listing.super_ad?.id,
      category_id: superAd.id,
    })

    if (data) {
      onOpenChange(false)
      dispatch(
        openAlertDialog({
          title: "Update Successful",
          desc: `You've successfully updated ${listing.service.header} Super Ad Subscription to ${superAd?.tier} (${superAd?.title})`,
        })
      )
      if (setListing) setListing(null)
    } else if (error && "message" in error) {
      toast.error("Oops", {
        position: "bottom-right",
        description: error.message,
      })
    }
  }

  return (
    <AlertD.AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertD.AlertDialogContent>
        <AlertD.AlertDialogHeader className="flex flex-col items-center gap-[16px]">
          <AlertD.AlertDialogTitle
            title="Update Super Ad"
            icon={<CheckCircle2 className="size-5 text-primary" />}
          />
        </AlertD.AlertDialogHeader>
        <AlertD.AlertDialogDescription>
          You are about to update{" "}
          <span className="font-medium text-neutral-800">
            {listing.service.header}
          </span>{" "}
          listing from{" "}
          <span className="font-medium text-neutral-800">
            Tier {listing.super_ad?.super_ads_category?.tier}
          </span>{" "}
          to{" "}
          <span className="font-medium text-neutral-800">
            Tier {superAd?.tier}
          </span>
          . Are you sure you want to continue
        </AlertD.AlertDialogDescription>
        <AlertD.AlertDialogFooter>
          <div className="flex flex-col w-full gap-3">
            <Button
              onClick={handleUpdate}
              isLoading={isLoading}
              className="h-11 font-normal"
            >
              Confirm
            </Button>
            <AlertD.AlertDialogCancel
              disabled={isLoading}
              className="w-full h-11 font-normal border-primary text-primary"
            >
              Cancel
            </AlertD.AlertDialogCancel>
          </div>
        </AlertD.AlertDialogFooter>
      </AlertD.AlertDialogContent>
    </AlertD.AlertDialog>
  )
}

export default ConfirmSuperAdCategoryChange
