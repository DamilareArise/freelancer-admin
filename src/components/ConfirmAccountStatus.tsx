import { useUserDialog } from "@/hooks/use-user"
import { ClipboardXIcon } from "lucide-react"
import * as AlertD from "./ui/alert-dialog"
import { Button } from "./ui/button"

const ConfirmStatusChangeAlert: React.FC<{
  handler: ReturnType<typeof useUserDialog>
}> = ({
  handler: {
    setStatusChangeIsOpen,
    statusChangeIsOpen,
    updateUserStatus,
    user,
    isUpdatingUserStatus,
    statusChangeAction,
  },
}) => {
  return (
    <AlertD.AlertDialog
      open={statusChangeIsOpen}
      onOpenChange={setStatusChangeIsOpen}
    >
      <AlertD.AlertDialogContent>
        <AlertD.AlertDialogHeader className="flex flex-col items-center gap-[16px]">
          <AlertD.AlertDialogTitle
            variant={
              statusChangeAction === "suspend" ? "destructive" : "success"
            }
            title={
              statusChangeAction === "suspend"
                ? "Suspend User"
                : "Activate User"
            }
            icon={
              <ClipboardXIcon
                className={`${
                  statusChangeAction === "suspend"
                    ? "text-destructive"
                    : "text-primary"
                } stroke-[1.5] size-5`}
              />
            }
          />
        </AlertD.AlertDialogHeader>
        <AlertD.AlertDialogDescription className="max-w-xs px-0">
          {statusChangeAction === "suspend"
            ? `You are about to suspend ${user?.fullname}'s account. After suspension, they will no longer be able to access their account.`
            : `You are about to activate ${user?.fullname}'s account. After activation, they will be able to access their account again.`}
        </AlertD.AlertDialogDescription>

        <div className="flex flex-col w-full gap-3 mt-2">
          <Button
            onClick={updateUserStatus}
            isLoading={isUpdatingUserStatus}
            variant={
              statusChangeAction === "suspend" ? "destructive" : "default"
            }
            className={`h-11 ${
              statusChangeAction === "suspend" ? "text-white" : ""
            } font-normal`}
          >
            Confirm{" "}
            {statusChangeAction === "suspend" ? "Suspension" : "Activation"}
          </Button>
        </div>
      </AlertD.AlertDialogContent>
    </AlertD.AlertDialog>
  )
}

export default ConfirmStatusChangeAlert
