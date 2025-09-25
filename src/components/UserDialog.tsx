import { useUserDialog } from "@/hooks/use-user"
import { cn } from "@/lib/utils"
import { documentSatusMap } from "@/services/user.service"
import { UserData } from "@/types/auth"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import {
  ChevronDown,
  ChevronLeft,
  ClipboardXIcon,
  ExternalLinkIcon,
  FileCheck,
  UserRoundX,
} from "lucide-react"
import React, { useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import ListingDialog from "./dialogs/ListingDialog"
import MemoDelete from "./icons/Delete"
import MemoEllipsesVertical from "./icons/EllipsesVertical"
import MemoFilter from "./icons/Filter"
import MemoSortBooking from "./icons/SortBooking"
import * as AlertD from "./ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Textarea } from "./ui/textarea"
import BookingCard, { BookingCardSkeleton } from "./widgets/BookingCard"
import ListCard, { ListCardSkeleton } from "./widgets/ListCard"
import SearchInput from "./widgets/SearchInput"
import StatusPill from "./widgets/StatusPill"
import { Booking } from "@/types/booking.type"
import ConfirmStatusChangeAlert from "./ConfirmAccountStatus"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

const UserDialog = ({
  open,
  user,
  checkingDocs,
  setOpen,
}: //   listing,
{
  open: boolean
  user?: UserData
  checkingDocs?: boolean
  setOpen: (open: boolean) => void
  //   listing: Listing | null
}) => {
  const close = () => {
    setOpen(false)
    handler.setCheckingDocs(false)
    handler.setStatusChangeAction(undefined)
    handler.setStatusChangeIsOpen(false)
  }

  const handler = useUserDialog({
    open,
    checkingDocs,
    user,
    close,
  })

  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingsFilters, setBookingsFilters] = useState({
    search: "",
    status: "",
    sort: "NEW_TO_OLD",
  })

  useEffect(() => {
    const allBookings = handler.userDetails?.incoming_bookings
    if (!allBookings) return
    const { status, search, sort } = bookingsFilters
    const filtered = allBookings.filter(
      (each) =>
        each.status == status ||
        each.listing.service.header.toLowerCase().includes(search) ||
        each.listing.address.toLowerCase().includes(search) ||
        each.requester.fullname.toLowerCase().includes(search)
    )

    // Sort based on date_time field
    if (sort === "NEW_TO_OLD") {
      filtered.sort(
        (a, b) =>
          new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
      )
    } else if (sort === "OLD_TO_NEW") {
      filtered.sort(
        (a, b) =>
          new Date(a.date_time).getTime() - new Date(b.date_time).getTime()
      )
    }

    setBookings(filtered)
  }, [bookingsFilters, handler.userDetails?.incoming_bookings])

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => (open ? setOpen(open) : close())}
      >
        {user && (
          <DialogContent
            id="user-dialog-content"
            className={cn(
              "sm:max-w-lg p-5",
              handler.checkingDocs && "rounded-none"
            )}
            _style={2}
          >
            {handler.checkingDocs ? (
              <>
                <VerificationDetails
                  close={() => {
                    handler.setCheckingDocs(false)
                  }}
                  user={user}
                  handler={handler}
                />
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="/gap-2">
                    <div className="flex justify-end mb-[16px]">
                      <Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="p-2"
                            // onClick={() => toggleMenu(user.id)}
                          >
                            <MemoEllipsesVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                handler.setStatusChangeAction(
                                  user.status == "active"
                                    ? "suspend"
                                    : "activate"
                                )
                                handler.setStatusChangeIsOpen(true)
                              }}
                              className="text-[#898483] text-[12px]"
                            >
                              <UserRoundX />{" "}
                              {user.status == "active" ? "Suspend" : "Activate"}{" "}
                              User
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handler.setOpenAlert(true)}
                            >
                              <MemoDelete />
                              Delete account
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                              onClick={() => handler.setCheckingDocs(true)}
                            >
                              <FileCheck />
                              Verify Identity
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Dialog>
                      <AlertD.AlertDialog
                        open={handler.openAlert}
                        onOpenChange={handler.setOpenAlert}
                      >
                        <AlertD.AlertDialogContent>
                          <AlertD.AlertDialogHeader>
                            <AlertD.AlertDialogTitle
                              title={"Delete account"}
                              variant="destructive"
                              icon={<MemoDelete />}
                            />
                          </AlertD.AlertDialogHeader>
                          <AlertD.AlertDialogDescription>
                            Are you sure you want to delete {user.fullname}’s
                            account?
                          </AlertD.AlertDialogDescription>
                          <AlertD.AlertDialogFooter>
                            <Button variant={"destructive"} className="w-full">
                              Yes, Delete account
                            </Button>
                          </AlertD.AlertDialogFooter>
                        </AlertD.AlertDialogContent>
                      </AlertD.AlertDialog>
                    </div>
                    <div className=" flex flex-col items-center justify-center">
                      {/* {listing?.name} */}
                      {/* {checkingDocs ? "Document" : "Ordinary"} */}
                      <Avatar className="size-40">
                        <AvatarImage src={user.passport} alt="Profile Image" />
                        <AvatarFallback className="text-3xl text-neutral-500">
                          {user.initial}
                        </AvatarFallback>
                      </Avatar>

                      <p className="font-semibold text-3xl mt-6">
                        {user.fullname}
                      </p>

                      {/* <p className="p-2 font-[500] text-[14px] text-[#433E3F] text-center">
                            {user.role == 'Customer' ? <span className="px-2 py-1 rounded-[24px] bg-[#DDF6EE] text-[#10B981] font-[500] text-[12px] text-center">
                                {user.role}
                            </span> : <span className="px-2 py-1 rounded-[24px] bg-[#F7EBFF] text-[#BA19D6] font-[500] text-[12px] text-center">
                                {user.role}
                            </span>}
                        </p> */}

                      <div className="flex gap-[16px] justify-center items-center border-b-[1px] border-[#F2F2F2] w-full py-4">
                        {user.user_roles.map((each) => (
                          <span
                            key={user.id + each.id}
                            className="px-[12px] py-[6px] rounded-[24px] bg-[#F7EBFF] text-[#BA19D6] font-[500] text-[14px] text-center"
                          >
                            {each.label}
                          </span>
                        ))}
                        <StatusPill
                          status={user.status}
                          noIcon
                          className="px-3 py-1 text-sm font-medium"
                        />
                      </div>

                      <div className=""></div>
                    </div>
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="py-[16px] /border-b-[1px] /border-[#F2F2F2] w-full">
                  <div className="flex flex-col gap-[24px] mb-[24px]">
                    <div className="flex justify-between items-center text-[12px] md:text-[16px] font-[500]">
                      <p className=" text-[#2B2928] font-[500] ">
                        Document Status
                      </p>
                      {user.document ? (
                        <StatusPill
                          label={user.document_status}
                          status={user.document_status}
                          noIcon
                          className="px-3 py-1 text-xs font-medium"
                        />
                      ) : (
                        <StatusPill
                          label={"No Document"}
                          status={"muted"}
                          noIcon
                          className="px-3 py-1 text-xs font-medium"
                        />
                      )}
                    </div>
                    <div className="flex justify-between items-center text-[12px] md:text-[16px] font-[500]">
                      <p className=" text-[#2B2928] font-[500] ">
                        Email address
                      </p>
                      <p className="text-[#B5B3B3] font-[500] ">{user.email}</p>
                    </div>

                    <div className="flex justify-between items-center text-[12px] md:text-[16px] font-[500]">
                      <p className=" text-[#2B2928]">Phone number</p>
                      <p className="text-[#B5B3B3]">{user.phone}</p>
                    </div>

                    <div className="flex justify-between items-center text-[12px] md:text-[16px] font-[500]">
                      <p className=" text-[#2B2928]">Number of listings</p>
                      <p className="text-[#B5B3B3]">
                        {handler.userDetails?.total_listings ?? "--"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[12px] md:text-[16px] font-[500]">
                      <p className=" text-[#2B2928]">
                        Number of completed bookings
                      </p>
                      <p className="text-[#B5B3B3]">--</p>
                    </div>
                  </div>

                  <div className="border-y-[1px] border-[#F2F2F2] py-[24px] flex flex-col justify-start items-start gap-[20px]">
                    <p className="/text-[20px] font-[600] text-[#5A5555]">
                      Activities
                    </p>

                    <div className="flex flex-col w-full justify-start items-start">
                      <div className="flex justify-between gap-4 items-center text-neutral-600 w-full">
                        <span className="font-medium flex items-center gap-2 text-[12px] md:text-[16px]">
                          <span className="size-5 rounded-full border-[6px] border-primary bg-white "></span>
                          Signed up
                        </span>
                        <span className="text-[12px] md:text-[16px]">
                          {new Date(user.created_at).toDateString()}
                        </span>
                      </div>
                      <div className="h-8 my-2 border-neutral-200 border-l-2 ml-2 border-dashed"></div>
                      <div className="flex justify-between gap-4 items-center text-neutral-600 w-full">
                        <span className="font-medium flex items-center gap-2 text-[12px] md:text-[16px]">
                          <span className="size-5 rounded-full border-[6px]  border-neutral-200 bg-white "></span>
                          Suspended
                        </span>
                        <span className="text-[12px] md:text-[16px]">-:-</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full mt-[28px] mb-[28px]">
                    <Button
                      type="button"
                      variant={
                        handler.selectedTab === "bookingHistory"
                          ? "default"
                          : "ghost"
                      }
                      size={"lg"}
                      onClick={() => handler.setSelectedTab("bookingHistory")}
                    >
                      Booking history
                    </Button>

                    <Button
                      type="button"
                      variant={
                        handler.selectedTab === "listings" ? "default" : "ghost"
                      }
                      size={"lg"}
                      onClick={() => handler.setSelectedTab("listings")}
                    >
                      Listings
                    </Button>
                  </div>

                  <div className="/relative">
                    {handler.selectedTab === "bookingHistory" && (
                      <div className="text-gray-700 flex flex-col gap-[24px] relative">
                        <p className="text-lg font-semibold text-[#0A0B0A] /mb-[24px]">
                          Booking History
                        </p>

                        <div className="flex items-center gap-[11px]">
                          <SearchInput
                            className="rounded-lg"
                            onSearch={(search) =>
                              setBookingsFilters((_) => ({ ..._, search }))
                            }
                            placeholder="Search booking history"
                          />
                          <div className="flex gap-[20px] items-center">
                            <Dialog>
                              <DialogTrigger>
                                <MemoSortBooking />
                              </DialogTrigger>
                              <DialogContent
                                className="w-lg data-[state=closed]:slide-out-to-bottom-[10%] data-[state=open]:slide-in-from-bottom-[100%]"
                                _style={2}
                                position={"br"}
                              >
                                <DialogTitle />
                                <DialogHeader className="text-lg text-start font-semibold text-gray-800">
                                  Sort by
                                </DialogHeader>

                                <div className="flex flex-col gap-[16px] /mb-[40px]">
                                  <RadioGroup
                                    value={bookingsFilters.sort}
                                    onValueChange={(sort) =>
                                      setBookingsFilters((_) => ({
                                        ..._,
                                        sort,
                                      }))
                                    }
                                    className="flex flex-col gap-4 max-h-[30rem] overflow-auto"
                                  >
                                    {[
                                      {
                                        value: "NEW_TO_OLD",
                                        label: "Newest to oldest",
                                      },
                                      {
                                        value: "OLD_TO_NEW",
                                        label: "Oldest to newest",
                                      },
                                    ].map((each, i) => (
                                      <div
                                        key={i + "location"}
                                        className="flex gap-2 pr-6 text-neutral-600 justify-between items-center"
                                      >
                                        <span>{each.label}</span>
                                        <RadioGroupItem
                                          value={each.value}
                                          id={each.value}
                                        />
                                      </div>
                                    ))}
                                  </RadioGroup>

                                  <div className="flex justify-end mt-[24px]">
                                    <Button>Apply</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger>
                                <MemoFilter />
                              </DialogTrigger>
                              <DialogContent
                                className="max-w-lg"
                                _style={2}
                                position={"br"}
                              >
                                <DialogHeader className="text-lg font-semibold text-gray-800">
                                  Filter Bookings
                                </DialogHeader>

                                <div className="flex flex-col gap-[24px]">
                                  <RadioGroup
                                    defaultValue="All"
                                    className="flex flex-col gap-4 max-h-[30rem] overflow-auto"
                                  >
                                    {[
                                      { label: "All", value: "All" },
                                      // { label: "User", value: "User" },
                                    ].map((each, i) => (
                                      <div
                                        key={i + "location"}
                                        className="flex gap-2 pr-6 text-neutral-600 justify-between items-center"
                                      >
                                        <span>{each.label}</span>
                                        <RadioGroupItem
                                          value={each.value}
                                          id={each.value}
                                        />
                                      </div>
                                    ))}
                                  </RadioGroup>

                                  <Select
                                  // onValueChange={field.onChange}
                                  // defaultValue={field.value}
                                  >
                                    {/* <FormControl> */}
                                    <SelectTrigger>
                                      <SelectValue placeholder="Dubrovnik" />
                                    </SelectTrigger>
                                    {/* </FormControl> */}
                                    <SelectContent>
                                      <SelectItem value="Dubrovnik">
                                        Dubrovnik
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {/* <FormMessage /> */}
                                  {/* </FormItem> */}

                                  <div className="flex flex-col gap-[16px] /mb-[40px]">
                                    <p className="text-[20px] font-[600] text-[#151413] ">
                                      Status
                                    </p>

                                    <RadioGroup
                                      defaultValue="Upcoming"
                                      className="flex flex-col gap-4 max-h-[30rem] overflow-auto"
                                    >
                                      {[
                                        {
                                          label: "Upcoming",
                                          value: "Upcoming",
                                        },
                                        {
                                          label: "Completed",
                                          value: "Completed",
                                        },
                                        {
                                          label: "Cancelled",
                                          value: "Cancelled",
                                        },
                                      ].map((each, i) => (
                                        <div
                                          key={i + "location"}
                                          className="flex gap-2 pr-6 text-neutral-600 justify-between items-center"
                                        >
                                          <span>{each.label}</span>
                                          <RadioGroupItem
                                            value={each.value}
                                            id={each.value}
                                          />
                                        </div>
                                      ))}
                                    </RadioGroup>

                                    <div className="flex justify-end mt-[16px]">
                                      <Button>Apply</Button>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <Tabs
                          defaultValue="confirmed"
                          onValueChange={(status) =>
                            setBookingsFilters((_) => ({ ..._, status }))
                          }
                        >
                          <TabsList
                            _style={2}
                            className="min-w-full gap-0.5 justify-center"
                          >
                            {[
                              {
                                label: "Upcoming",
                                value: "confirmed",
                              },
                              {
                                label: "Pending",
                                value: "pending",
                              },
                              {
                                label: "Completed",
                                value: "completed",
                              },
                              {
                                label: "Cancelled",
                                value: "canceled",
                              },
                              {
                                label: "Rejected",
                                value: "rejected",
                              },
                            ].map((each) => (
                              <TabsTrigger
                                _style={2}
                                key={each.value}
                                value={each.value}
                                className="capitalize flex-1"
                              >
                                {each.label}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </Tabs>

                        <div className="flex flex-col gap-6">
                          {handler.gettingUser &&
                            Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <BookingCardSkeleton
                                  key={"bookingskeleton" + i}
                                />
                              ))}
                          {bookings.map((booking) => (
                            <BookingCard
                              booking={booking}
                              key={booking.id + booking.date_time}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {handler.selectedTab === "listings" && (
                      <div className="text-gray-700">
                        <p className="text-lg  font-semibold text-[#0A0B0A] mb-[24px]">
                          Listings
                        </p>

                        <div className="flex items-center gap-[11px]">
                          <SearchInput placeholder="Search listings " />
                          <div className="flex gap-[20px] items-center">
                            <Dialog>
                              <DialogTrigger>
                                <MemoSortBooking />
                              </DialogTrigger>
                              <DialogContent
                                className="max-w-lg"
                                _style={2}
                                position={"br"}
                              >
                                <DialogHeader className="text-lg font-semibold text-gray-800">
                                  Sort by
                                </DialogHeader>

                                <div className="flex flex-col gap-[16px] /mb-[40px]">
                                  <RadioGroup
                                    defaultValue="NEW_TO_OLD"
                                    className="flex flex-col gap-4 max-h-[30rem] overflow-auto"
                                  >
                                    {[
                                      {
                                        value: "NEW_TO_OLD",
                                        label: "Newest to oldest",
                                      },
                                      {
                                        value: "OLD_TO_NEW",
                                        label: "Oldest to newest",
                                      },
                                    ].map((each, i) => (
                                      <div
                                        key={i + "location"}
                                        className="flex gap-2 pr-6 text-neutral-600 justify-between items-center"
                                      >
                                        <span>{each.label}</span>
                                        <RadioGroupItem
                                          value={each.value}
                                          id={each.value}
                                        />
                                      </div>
                                    ))}
                                  </RadioGroup>

                                  <div className="flex justify-end mt-[24px]">
                                    <Button>Apply</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger>
                                <MemoFilter />
                              </DialogTrigger>
                              <DialogContent
                                className="max-w-lg"
                                _style={2}
                                position={"br"}
                              >
                                <DialogHeader className="text-lg font-semibold text-gray-800">
                                  Filter Listings
                                </DialogHeader>

                                <div className="flex flex-col gap-[24px]">
                                  <RadioGroup
                                    defaultValue="All"
                                    className="flex flex-col gap-4 max-h-[30rem] overflow-auto"
                                  >
                                    {[
                                      { label: "All", value: "All" },
                                      // { label: "User", value: "User" },
                                    ].map((each, i) => (
                                      <div
                                        key={i + "location"}
                                        className="flex gap-2 pr-6 text-neutral-600 justify-between items-center"
                                      >
                                        <span>{each.label}</span>
                                        <RadioGroupItem
                                          value={each.value}
                                          id={each.value}
                                        />
                                      </div>
                                    ))}
                                  </RadioGroup>

                                  <Select
                                  // onValueChange={field.onChange}
                                  // defaultValue={field.value}
                                  >
                                    {/* <FormControl> */}
                                    <SelectTrigger>
                                      <SelectValue placeholder="Dubrovnik" />
                                    </SelectTrigger>
                                    {/* </FormControl> */}
                                    <SelectContent>
                                      <SelectItem value="Dubrovnik">
                                        Dubrovnik
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {/* <FormMessage /> */}
                                  {/* </FormItem> */}

                                  <div className="flex flex-col gap-[16px] /mb-[40px]">
                                    <p className="text-[20px] font-[600] text-[#151413] ">
                                      Status
                                    </p>

                                    <RadioGroup
                                      defaultValue="Upcoming"
                                      className="flex flex-col gap-4 max-h-[30rem] overflow-auto"
                                    >
                                      {[
                                        {
                                          label: "Upcoming",
                                          value: "Upcoming",
                                        },
                                        {
                                          label: "Completed",
                                          value: "Completed",
                                        },
                                        {
                                          label: "Cancelled",
                                          value: "Cancelled",
                                        },
                                      ].map((each, i) => (
                                        <div
                                          key={i + "location"}
                                          className="flex gap-2 pr-6 text-neutral-600 justify-between items-center"
                                        >
                                          <span>{each.label}</span>
                                          <RadioGroupItem
                                            value={each.value}
                                            id={each.value}
                                          />
                                        </div>
                                      ))}
                                    </RadioGroup>

                                    <div className="flex justify-end mt-[16px]">
                                      <Button>Apply</Button>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mt-[24px]">
                          {handler.gettingUser &&
                            new Array(4)
                              .fill(null)
                              .map((_, i) => (
                                <ListCardSkeleton key={i + "skeleton"} />
                              ))}

                          {!handler.gettingUser &&
                            handler.userDetails?.listings.map((each, i) => {
                              return (
                                <button
                                  onClick={() => {
                                    handler.setCurrentListing(each)
                                    handler.setListingDialogIsOpen(true)
                                  }}
                                  key={`listing${i}`}
                                >
                                  <ListCard listing={each} />
                                </button>
                              )
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* <DialogFooter className=""></DialogFooter> */}

            <ListingDialog
              setListing={handler.setCurrentListing}
              onOpenChange={handler.setListingDialogIsOpen}
              listing={handler.currentListing}
              open={handler.listingDialogIsOpen}
            />

            <ConfirmStatusChangeAlert handler={handler} />
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}

const VerificationDetails = ({
  user,
  close,
  handler,
}: {
  user: UserData
  close: () => void
  handler: ReturnType<typeof useUserDialog>
}) => {
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById("user-dialog-content")
      if (container) {
        // Subtract 5rem (80px) from container width
        setContainerWidth(container.clientWidth - 80)
      }
    }

    updateWidth() // Initial width

    // Update width on window resize
    window.addEventListener("resize", updateWidth)

    return () => {
      window.removeEventListener("resize", updateWidth)
    }
  }, [])

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <button type="button" onClick={close} className="text-neutral-800">
            <ChevronLeft />
          </button>

          <p className="text-primary-1000 text-2xl font-semibold">
            Verification Details
          </p>
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium">OIB</span>
          <span className="text-neutral-600">{user.oib ?? "--"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">VAT NO</span>
          <span className="text-neutral-600">{user.vat ?? "--"}</span>
        </div>
        {user.selfie && (
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{user.fullname}'s Selfie</span>
            </div>
            <div className="flex flex-col gap-3 mt-2">
              <div className="shadow max-w-[15rem] rounded-md overflow-hidden relative group">
                <img className="w-full " src={user.selfie} alt="Selfie" />
              </div>
            </div>
          </div>
        )}

        <DocumentViewer
          open
          document={user.document}
          title={
            user.document_type
              ? `${user.fullname}'s ${
                  documentSatusMap[user.document_type].label
                }`
              : `${user.fullname}'s Document`
          }
          containerWidth={containerWidth}
        />

        <DocumentViewer
          document={user.business_reg}
          title={`Business Registration`}
          containerWidth={containerWidth}
        />

        <DocumentViewer
          document={user.auth_letter}
          title={`Authorization Letter`}
          containerWidth={containerWidth}
        />

        {/* <FileTile name="Business Registration" />
        <FileTile name="Authorization Letter" /> */}

        {user.document_status == "pending" && (
          <div className="flex items-center gap-2 mt-4">
            <Button
              onClick={() => handler.setConfirmRejectionIsOpen(true)}
              className="flex-1 min-h-10 font-normal border-primary text-primary"
              variant={"outline"}
            >
              Deny Verification
            </Button>
            <Button
              onClick={() => handler.setConfirmApprovalIsOpen(true)}
              className="flex-1 min-h-10 font-normal"
            >
              Approve
            </Button>
          </div>
        )}
      </div>

      <ConfirmApprovalAlert handler={handler} />
      <ConfirmRejectionAlert handler={handler} />
    </>
  )
}

const MemoDialog = React.memo(UserDialog)
export default MemoDialog

const DocumentViewer = ({
  document,
  title,
  open = false,
  containerWidth,
}: {
  document: string | null
  title: string
  open?: boolean
  containerWidth: number
}) => {
  const [isOpen, setIsOpen] = useState(open)

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="font-medium flex gap-2 items-center">
          {title}
          {document && (
            <button
              type="button"
              className="text-primary-900"
              onClick={() => setIsOpen(!isOpen)}
            >
              <ChevronDown
                className={cn(
                  "size-4 transition duration-300 ease-in-out",
                  isOpen && "-scale-y-100"
                )}
              />
            </button>
          )}
        </span>

        {document ? (
          <a
            href={document}
            target="_blank"
            className="flex items-center gap-2 text-primary-900"
          >
            View <ExternalLinkIcon className="size-4" />
          </a>
        ) : (
          <span className="text-neutral-500 text-sm">No document</span>
        )}
      </div>
      {document && (
        <div
          className={cn("mb-2 flex-col gap-3 mt-2", isOpen ? "flex" : "hidden")}
        >
          <div className="shadow rounded-md border relative group overflow-hidden">
            {document?.toLowerCase().endsWith(".pdf") ? (
              <div className="w-full flex flex-col items-center justify-center min-h-80">
                <Document
                  className="min-h-full rounded-md flex items-center justify-center"
                  file={document}
                  loading={"Loading Document..."}
                >
                  <Page
                    pageIndex={0}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    width={containerWidth}
                  />
                </Document>
              </div>
            ) : (
              <img
                className="w-full min-h-80 rounded-md"
                src={document}
                alt="Document"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// const FileTile = ({ name }: { name: string }) => {
//   return (
//     <div className="flex flex-col gap-2 border-b py-3">
//       <h3 className="font-medium text-neutral-900">{name}</h3>
//       <div className="flex items-center gap-3">
//         <MemoPDF className="size-10" />
//         <div className="flex flex-col gap-1">
//           <h3 className="font-medium text-neutral-900">{name}</h3>
//           <p className="text-sm text-neutral-500">
//             11 Sep, 2023 | 12:24pm • 13MB
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

const ConfirmApprovalAlert = ({
  handler,
}: {
  handler: ReturnType<typeof useUserDialog>
}) => {
  return (
    <AlertD.AlertDialog
      open={handler.confirmApprovalIsOpen}
      onOpenChange={handler.setConfirmApprovalIsOpen}
    >
      <AlertD.AlertDialogContent>
        <AlertD.AlertDialogHeader className="flex flex-col items-center gap-[16px]">
          <AlertD.AlertDialogTitle
            title={"Approve Documents?"}
            icon={
              <span className="text-primary size-5 min-w-5 flex items-center justify-center">
                ?
              </span>
            }
          />
        </AlertD.AlertDialogHeader>
        <AlertD.AlertDialogDescription>
          {handler.user?.fullname} will be able to list properties after
          approval
        </AlertD.AlertDialogDescription>
        <AlertD.AlertDialogFooter>
          <Button
            onClick={handler.approveDocument}
            isLoading={handler.isUpdatingDocStatus}
            className="w-full h-11 font-normal"
          >
            Approve
          </Button>
        </AlertD.AlertDialogFooter>
      </AlertD.AlertDialogContent>
    </AlertD.AlertDialog>
  )
}

const ConfirmRejectionAlert: React.FC<{
  handler: ReturnType<typeof useUserDialog>
}> = ({
  handler: {
    setConfirmRejectionIsOpen,
    confirmRejectionIsOpen,
    rejectionForm: form,
    rejectDocument,
    user,
    isUpdatingDocStatus: isUpdatingStatus,
  },
}) => {
  return (
    <AlertD.AlertDialog
      open={confirmRejectionIsOpen}
      onOpenChange={setConfirmRejectionIsOpen}
    >
      <AlertD.AlertDialogContent>
        <AlertD.AlertDialogHeader className="flex flex-col items-center gap-[16px]">
          <AlertD.AlertDialogTitle
            variant="destructive"
            title="Reject verification"
            icon={
              <ClipboardXIcon className="text-destructive stroke-[1.5] size-5" />
            }
          />
        </AlertD.AlertDialogHeader>
        <AlertD.AlertDialogDescription className="max-w-xs px-0">
          Let {user?.first_name} know why his verification is being denied and
          list ways to help
        </AlertD.AlertDialogDescription>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(rejectDocument)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tell {user?.first_name} more</FormLabel>
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
                  isLoading={isUpdatingStatus}
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
