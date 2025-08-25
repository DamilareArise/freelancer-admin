import { useGetUserQuery, useUpdateUserDocStatusMutation, useUpdateUserStatusMutation } from "@/services/user.service"
import { openAlertDialog } from "@/slices/app.slice"
import { UserData } from "@/types/auth"
import { Listing } from "@/types/listing.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { skipToken } from "@reduxjs/toolkit/query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useAppDispatch } from "./redux.hooks"


interface UserDialogProps {
  open: boolean, user?: UserData, close: () => void,
  checkingDocs?: boolean
}


export const rejectionForm = z.object({
  reason: z
    .string()
    .max(300, {
      message: "Message must not be longer than 3000 characters.",
    })
    .nonempty({ message: "Reason is required" }),
})

export const useUserDialog = ({ open, user, close, checkingDocs: chkdocs }: UserDialogProps) => {
  // const requestOptions = useMemo(() => ({ limit: 10, page: 3, search: "", price_range: "", category_ids: "" }), [])
  const dispatch = useAppDispatch();
  const { data: userDetails, isFetching: gettingUser } = useGetUserQuery(user ? { id: user.id } : skipToken)
  // const { data: listingData, isFetching: loadingListings } =
  //   useGetListingsQuery(requestOptions)
  const [updateDocumentStatus, { isLoading: isUpdatingDocStatus }] = useUpdateUserDocStatusMutation()
  const [updateUserStatusM, { isLoading: isUpdatingUserStatus }] = useUpdateUserStatusMutation()


  const [selectedTab, setSelectedTab] = useState<"bookingHistory" | "listings">(
    "bookingHistory"
  )
  const [listingDialogIsOpen, setListingDialogIsOpen] = useState(false)
  const [currentListing, setCurrentListing] = useState<Listing | null>(null)
  const [filterr, setfilter] = useState<string>("All")
  const [confirmApprovalIsOpen, setConfirmApprovalIsOpen] = useState(false);
  const [confirmRejectionIsOpen, setConfirmRejectionIsOpen] = useState(false);
  const [statusChangeAction, setStatusChangeAction] = useState<"activate" | "suspend" | undefined>();
  const [statusChangeIsOpen, setStatusChangeIsOpen] = useState(false);
  // const [listings, setListings] = useState<Listing[]>([])
  const [openAlert, setOpenAlert] = useState(false)
  const [checkingDocs, setCheckingDocs] = useState(chkdocs)

  useEffect(() => {
    setCheckingDocs(chkdocs)
  }, [chkdocs])


  // useEffect(() => {
  //   setListings(listingData?.results ?? []);
  // }, [listingData?.results])

  //   const filteredBookings = usersData.filter((user) =>
  //     filterr === "All" ? true : user.status === filterr
  //   )

  const _rejectionForm = useForm<z.infer<typeof rejectionForm>>({
    resolver: zodResolver(rejectionForm),
  })

  useEffect(() => {
    if (!confirmRejectionIsOpen) {
      _rejectionForm.reset({ reason: "" })
    }
  }, [confirmRejectionIsOpen, _rejectionForm])

  const rejectDocument = async (values: z.infer<typeof rejectionForm>) => {
    const { data, error } = await updateDocumentStatus({
      user_id: user?.id,
      action: "reject",
      message: values.reason
    })

    if (data) {
      setConfirmRejectionIsOpen(false);
      close()
      dispatch(
        openAlertDialog({
          desc: `Document rejected.`,
          title: "Done",
        })
      )
    } else if (error && "message" in error) {
      toast.error("Oops", {
        position: "bottom-center",
        description: error.message,
      })
    }
  }



  const approveDocument = async () => {
    const { data, error } = await updateDocumentStatus({
      user_id: user?.id,
      action: "approve",
    })

    if (data) {
      setConfirmApprovalIsOpen(false);
      close()
      dispatch(
        openAlertDialog({
          desc: `The user's account has been successfully verified and activated. They will be notified via email and in-app notification of the approval`,
          title: "Verification approved successfully",
        })
      )
    } else if (error && "message" in error) {
      toast.error("Oops", {
        position: "bottom-center",
        description: error.message,
      })
    }
  }

  const updateUserStatus = async () => {
    if (!statusChangeAction) return;
    const { data, error } = await updateUserStatusM({
      user_id: user?.id,
      action: statusChangeAction,
    })

    if (data) {
      setConfirmApprovalIsOpen(false);
      close()
      dispatch(
        openAlertDialog({
          desc: statusChangeAction === "suspend"
            ? "The user's account has been suspended. They will be notified via email."
            : "The user's account has been activated. They will be notified via email.",
          title: statusChangeAction === "suspend" ? "Account Suspended" : "Account Activated",
        })
      )
    } else if (error && "message" in error) {
      toast.error("Oops", {
        position: "bottom-center",
        description: error.message,
      })
    }
  }
  // const updateUserStatus = async () => {
  //   if (!statusChangeAction) return;
  //   const { data, error } = await updateUserStatusM({
  //     user_id: user?.id,
  //     action: statusChangeAction,
  //   })

  //   if (data) {
  //     setConfirmApprovalIsOpen(false);
  //     close()
  //     dispatch(
  //       openAlertDialog({
  //         desc: statusChangeAction === "suspend"
  //           ? "The user's account has been suspended. They will be notified via email."
  //           : "The user's account has been activated. They will be notified via email.",
  //         title: statusChangeAction === "suspend" ? "Account Suspended" : "Account Activated",
  //       })
  //     )
  //   } else if (error && "message" in error) {
  //     toast.error("Oops", {
  //       position: "bottom-center",
  //       description: error.message,
  //     })
  //   }
  // }


  return {
    // listings, loadingListings,
    close, open, user, checkingDocs, setCheckingDocs, gettingUser,
    listingDialogIsOpen, setListingDialogIsOpen, currentListing, setCurrentListing,
    openAlert, setOpenAlert, selectedTab, setSelectedTab, filterr, setfilter,
    rejectionForm: _rejectionForm, confirmRejectionIsOpen, confirmApprovalIsOpen,
    setConfirmApprovalIsOpen, setConfirmRejectionIsOpen, isUpdatingDocStatus,
    updateDocumentStatus, rejectDocument, approveDocument, userDetails,

    isUpdatingUserStatus, updateUserStatus, statusChangeIsOpen, setStatusChangeIsOpen,
    statusChangeAction, setStatusChangeAction,

  }
}
