import AdminDialog from "@/components/dialogs/AdminDialog"
import Pagination from "@/components/Pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/widgets/Header"
import RouteHead from "@/components/widgets/RouteHead"
import SearchInput from "@/components/widgets/SearchInput"
import { statusColors } from "@/lib/constants"
import { filter, joinWords } from "@/lib/helpers"
import {
  useDeleteAdminMutation,
  useGetAdminsQuery,
} from "@/services/admin.service"
import { UserData } from "@/types/auth"
import { Edit, Ellipsis, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import * as AlertD from "@/components/ui/alert-dialog"

const AdminManagement = () => {
  const [adminDialogIsOpen, setAdminDialogIsOpen] = useState(false)
  const [confirmDeletionIsOpen, setConfirmDeletionIsOpen] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<UserData | null>(null)
  const limit = 8
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const { data: rawAdmins, isLoading } = useGetAdminsQuery({ limit, page })
  const [admins, setAdmins] = useState<UserData[]>([])
  useEffect(() => {
    setAdmins(
      filter(rawAdmins?.results, searchText, [
        "first_name",
        "last_name",
        "email",
        "phone",
      ])
    )
  }, [searchText, rawAdmins])

  return (
    <div className="flex flex-col gap-4">
      <Header />
      <div className="flex items-center justify-between gap-4">
        <RouteHead title="Admin Management" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <SearchInput onSearch={setSearchText} />
        <Button
          className="h-10 font-normal"
          onClick={() => setAdminDialogIsOpen(true)}
        >
          <span className="size-5 border-white rounded-md border flex items-center justify-center">
            <Plus />
          </span>
          Add Admin
        </Button>
      </div>
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr className="thead-row">
              <th>Name</th>
              <th>Email Address</th>
              <th>Roles</th>
              <th>Date Added</th>
              <th>Status</th>
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
            {admins.map((each) => (
              <tr className="tbody-row" key={each.email}>
                <td className="flex gap-2 items-center">
                  <Avatar className="size-10">
                    <AvatarImage src={each.passport} alt="Profile Image" />
                    <AvatarFallback>{each.initial}</AvatarFallback>
                  </Avatar>
                  <span>{each.fullname}</span>
                </td>
                <td>{each.email}</td>
                <td className="min-w-40">
                  <span className="text-xs text-neutral-600">
                    {joinWords(each.user_roles.map((each) => each.label))}
                  </span>
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 text-xs text-primary whitespace-nowrap flex gap-1 items-center">
                      Finance Admin <ChevronDown className="size-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Super Admin</DropdownMenuItem>
                      <DropdownMenuItem>Financial Admin</DropdownMenuItem>
                      <DropdownMenuItem>Support Admin</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </td>
                <td className="whitespace-nowrap">
                  {new Date(each.created_at).toDateString()}
                </td>
                <td>
                  <span
                    className={`px-2 py-1 text-xs capitalize font-normal rounded-[24px] ${
                      statusColors[each.status]
                    }`}
                  >
                    {each.status}
                  </span>
                </td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex size-8 items-center">
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setCurrentAdmin(each)
                          setConfirmDeletionIsOpen(true)
                        }}
                        className="text-destructive"
                      >
                        <Trash2 /> Remove User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setCurrentAdmin(each)
                          setAdminDialogIsOpen(true)
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
        count={rawAdmins?.count ?? 0}
        limit={limit}
        // page={page}
        pageChange={setPage}
      />

      <AdminDialog
        close={() => {
          setCurrentAdmin(null)
          setAdminDialogIsOpen(false)
        }}
        open={adminDialogIsOpen}
        admin={currentAdmin}
      />

      {currentAdmin && (
        <ConfirmAdminDeletion
          open={confirmDeletionIsOpen}
          onOpenChange={setConfirmDeletionIsOpen}
          admin={currentAdmin}
          setAdmin={setCurrentAdmin}
        />
      )}
    </div>
  )
}

export default AdminManagement

const ConfirmAdminDeletion = ({
  open,
  onOpenChange,
  setAdmin,
  admin,
}: {
  open: boolean
  admin: UserData
  onOpenChange: (open: boolean) => void
  setAdmin: (admin: UserData | null) => void
}) => {
  const [delAdmin, { isLoading }] = useDeleteAdminMutation()

  const deleteAdmin = async () => {
    // setCurrentAdmin(admin)
    const { data, error } = await delAdmin(admin.id)
    setAdmin(null)

    if (data) {
      toast.success("Success", {
        position: "bottom-right",
        description: "Admin deleted successfully",
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
            title="Delete Admin Account"
            variant="destructive"
            icon={<Trash2 className="text-destructive size-5" />}
          />
        </AlertD.AlertDialogHeader>
        <AlertD.AlertDialogDescription>
          You are about to delete{" "}
          <span className="font-medium text-neutral-800">{admin.fullname}</span>{" "}
          account. Please note that this action is not reversible.
        </AlertD.AlertDialogDescription>
        <AlertD.AlertDialogFooter>
          <div className="flex flex-col w-full gap-3">
            <Button
              onClick={deleteAdmin}
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
