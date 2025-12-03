import NotificationDialog from "@/components/dialogs/NotificationDialog"
import Pagination from "@/components/Pagination"
import * as AlertD from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import SearchInput from "@/components/widgets/SearchInput"
import { filter } from "@/lib/helpers"
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
} from "@/services/notification.service"
import { Notification } from "@/types/notification.type"
import { Edit, Ellipsis, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const AppNotification = () => {
  const [notificationDialogIsOpen, setNotificationDialogIsOpen] =
    useState(false)
  const [confirmDeletionIsOpen, setConfirmDeletionIsOpen] = useState(false)
  const [currentNotification, setCurrentNotification] =
    useState<Notification | null>(null)
  const limit = 8
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const { data: rawNotifications, isLoading } = useGetNotificationsQuery({
    limit,
    page,
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  useEffect(() => {
    setNotifications(
      filter(rawNotifications?.results, searchText, [
        "header",
        "body",
        "category",
      ])
    )
  }, [searchText, rawNotifications])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <SearchInput onSearch={setSearchText} />
        <Button
          className="h-10 font-normal"
          onClick={() => setNotificationDialogIsOpen(true)}
        >
          <span className="size-5 border-white rounded-md border flex items-center justify-center">
            <Plus />
          </span>
          Add Notification
        </Button>
      </div>
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr className="thead-row">
              <th>Header</th>
              <th>Body</th>
              <th>Category</th>
              <th>Trigger Type</th>
              <th>Frequency</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              new Array(limit).fill(null).map((_, i) => (
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
                </tr>
              ))}
            {notifications.map((each) => (
              <tr className="tbody-row" key={each.id}>
                <td>{each.header}</td>
                <td>{each.body}</td>
                <td>{each.category}</td>
                <td className="capitalize">{each.trigger_type}</td>
                <td className="capitalize">{each.recurring_frequency}</td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex size-8 items-center">
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setCurrentNotification(each)
                          setConfirmDeletionIsOpen(true)
                        }}
                        className="text-destructive"
                      >
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setCurrentNotification(each)
                          setNotificationDialogIsOpen(true)
                        }}
                      >
                        <Edit /> Edit Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        count={rawNotifications?.count ?? 0}
        limit={limit}
        // page={page}
        pageChange={setPage}
      />

      <NotificationDialog
        close={() => {
          setCurrentNotification(null)
          setNotificationDialogIsOpen(false)
        }}
        open={notificationDialogIsOpen}
        notification={currentNotification}
      />

      {currentNotification && (
        <ConfirmNotificationDeletion
          open={confirmDeletionIsOpen}
          onOpenChange={setConfirmDeletionIsOpen}
          notification={currentNotification}
          setNotification={setCurrentNotification}
        />
      )}
    </div>
  )
}

export default AppNotification

const ConfirmNotificationDeletion = ({
  open,
  onOpenChange,
  setNotification,
  notification,
}: {
  open: boolean
  notification: Notification
  onOpenChange: (open: boolean) => void
  setNotification: (notification: Notification | null) => void
}) => {
  const [delNotification, { isLoading }] = useDeleteNotificationMutation()

  const deleteNotification = async () => {
    // setCurrentNotification(notification)
    const { data, error } = await delNotification(notification.id)
    setNotification(null)

    if (data) {
      toast.success("Success", {
        position: "bottom-right",
        description: "Notification deleted successfully",
      })
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
            title="Delete Notification Account"
            variant="destructive"
            icon={<Trash2 className="text-destructive size-5" />}
          />
        </AlertD.AlertDialogHeader>
        <AlertD.AlertDialogDescription>
          You are about to delete this Notification. Please note that this
          action is not reversible.
        </AlertD.AlertDialogDescription>
        <AlertD.AlertDialogFooter>
          <div className="flex flex-col w-full gap-3">
            <Button
              onClick={deleteNotification}
              isLoading={isLoading}
              variant={"destructive"}
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
