import MemoEllipses from "@/components/icons/Ellipses"
import MemoSort from "@/components/icons/Sort"
import Pagination from "@/components/Pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import ListingFilterDialog from "@/components/ListFilterDialog"
// import ListingDialog from "@/components/ListingDialog"
import UserDialog from "@/components/UserDialog"
import UserFilter from "@/components/UserFilter"
import Header from "@/components/widgets/Header"
import InfoCard from "@/components/widgets/InfoCard"
import RouteHead from "@/components/widgets/RouteHead"
import SearchInput from "@/components/widgets/SearchInput"
import StatusPill from "@/components/widgets/StatusPill"
import { joinWords, shortNum } from "@/lib/helpers"
// import { usersData as _usersData } from "@/lib/constants";
import {
  useGetUsersQuery,
  UsersFilters,
  useUsersPrefetch,
} from "@/services/user.service"
import { UserData } from "@/types/auth"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import { CheckCircle, FileCheck, View } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

// const usersData = _usersData;

const Users: React.FC = () => {
  const limit = 10
  const [userDialogIsOpen, setUserDialogIsOpen] = useState(false)
  const [filters, setFilters] = useState<UsersFilters>({})

  const [currentUser, setCurrentUser] = useState<UserData | undefined>()
  const [checkingDocs, setCheckingDocs] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<string | undefined>()
  const [docStatus, setDocStatus] = useState<string | undefined>()
  const [filterDialogIsOpen, setFilterDialogIsOpen] = useState(false)
  const [currentPage, setcurrentPage] = useState(1)
  const prefetchPage = useUsersPrefetch("getUsers")

  const [users, setUsers] = useState<UserData[]>([])
  const [searchText, setSearchText] = useState("")
  const requestOptions = useMemo(
    () => ({
      limit,
      page: currentPage,
      search: searchText,
      status: currentStatus,
      doc_status: docStatus,
    }),
    [currentPage, searchText, currentStatus, docStatus]
  )
  const { data, isLoading } = useGetUsersQuery(requestOptions)

  useEffect(() => {
    if (data) {
      setUsers(data?.results)
      if (requestOptions.page - 1) {
        prefetchPage({ ...requestOptions, page: requestOptions.page - 1 })
      }
      if (data?.results.length >= limit) {
        prefetchPage({ ...requestOptions, page: requestOptions.page + 1 })
      }
    }
  }, [data, prefetchPage, requestOptions])

  useEffect(() => {
    setcurrentPage(1)
  }, [searchText, currentStatus, filters])

  return (
    <div className="mb-6">
      <Header />

      <div className="flex items-center justify-between gap-2 flex-wrap py-2">
        <RouteHead title="Users" />
      </div>

      <UserSummary />
      <div className="mt-[40px]">
        <div className="mb-[20px]">
          <div className="flex justify-between gap-4">
            <SearchInput
              onSearch={setSearchText}
              placeholder="Search user, customers, service providers"
            />
            <Dialog
              onOpenChange={setFilterDialogIsOpen}
              open={filterDialogIsOpen}
            >
              <DialogTrigger className="border flex items-center text-dark-2 px-4 py-2 text-sm rounded-lg gap-1">
                <MemoSort /> Filter
              </DialogTrigger>
              <UserFilter
                filters={filters}
                setOpen={setFilterDialogIsOpen}
                setFilters={setFilters}
                open={filterDialogIsOpen}
              />
            </Dialog>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap mb-4">
          <Tabs>
            <TabsList className="capitalize" _style={2}>
              {(
                [
                  {
                    label: "All Users",
                    value: undefined,
                    count: shortNum(data?.count ?? 0),
                  },
                  { label: "Active", value: "active" },
                  { label: "Suspended", value: "suspended" },
                ] as {
                  label: string
                  value: string
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
          </Tabs>
          -
          <Tabs value={docStatus}>
            <TabsList className="capitalize" _style={2}>
              {(
                [
                  { label: "All", value: undefined },
                  { label: "Verified", value: "verified" },
                  { label: "Unverified", value: "submitted" },
                ] as {
                  label: string
                  value: string
                  count?: number
                }[]
              ).map(({ value, label, count }) => (
                <TabsTrigger
                  isActive={docStatus == value}
                  onClick={() => {
                    setDocStatus(value)
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
          </Tabs>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr className="thead-row">
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status | Document</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <UsersSkeleton limit={limit} />}

              {!isLoading &&
                users?.map((user) => (
                  <tr key={user.id} className="tbody-row">
                    <td className="p-6 flex items-center space-x-2 w-max">
                      <Avatar className="size-10">
                        <AvatarImage src={user.passport} alt="Profile Image" />
                        <AvatarFallback>{user.initial}</AvatarFallback>
                      </Avatar>
                      <span>{user.fullname}</span>
                      {user.document_status === "verified" && (
                        <CheckCircle className="size-3 text-green-600" />
                      )}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td className="whitespace-nowrap">
                      <span className="text-xs text-neutral-600">
                        {joinWords(user.user_roles.map((each) => each.label))}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-2">
                        <StatusPill
                          status={user.status}
                          noIcon
                          className="px-3 py-1 text-xs font-medium"
                        />

                        <StatusPill
                          label={
                            user.document_status == "pending"
                              ? "No Document"
                              : user.document_status
                          }
                          status={
                            user.document_status == "pending"
                              ? "muted"
                              : user.document_status
                          }
                          noIcon
                          className="px-3 py-1 text-xs font-medium"
                        />
                      </span>
                    </td>
                    <td className="menu-container">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2">
                          <MemoEllipses />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentUser(user)
                              setUserDialogIsOpen(true)
                              setCheckingDocs(false)
                            }}
                          >
                            <View />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentUser(user)
                              setCheckingDocs(true)
                              setUserDialogIsOpen(true)
                            }}
                          >
                            <FileCheck />
                            Verify Identity
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
          count={data?.count ?? 0}
          limit={limit}
          pageChange={(page) => setcurrentPage(page + 1)}
          // pageChange={pagination.changePage}
        />
      </div>

      <UserDialog
        user={currentUser}
        open={userDialogIsOpen}
        checkingDocs={checkingDocs}
        setOpen={setUserDialogIsOpen}
      />
    </div>
  )
}

export default Users

const UserSummary = () => {
  return (
    <div className="grid-cols-auto [--col-w:15rem] sm:[--col-w:18rem] gap-2 mt-4">
      <InfoCard rate={20} value={20000} title="Total registered users" />
      <InfoCard rate={-20} value={12899} title="Total registered customers" />
      <InfoCard
        rate={-20}
        value={7034}
        title="Total registered service providers"
      />
      <InfoCard rate={20} value={32} title="Average signups per day" />
      <InfoCard rate={20} value={19998} title="Total active users" />
      <InfoCard rate={20} value={11300} title="Total active customers" />
      <InfoCard
        rate={-20}
        value={6900}
        title="Total active service providers"
      />
    </div>
  )
}

const UsersSkeleton = ({ limit }: { limit: number }) => {
  return new Array(limit).fill(null).map((_, i) => (
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
  ))
}
