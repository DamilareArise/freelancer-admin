import { statusMap } from "@/lib/constants"
import { Ticket } from "@/types/ticket.type"
import {
  ChevronDown,
  CircleDotDashed,
  Ellipsis,
  Flag,
  LogOut,
  Trash2,
  View,
} from "lucide-react"
import { useState } from "react"
import SupportTicketDialog from "./dialogs/SupportTicketDialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import CheckCircle from "./widgets/CheckCircle"
import StatusPill from "./widgets/StatusPill"
import { Skeleton } from "./ui/skeleton"

const TicketsTable = ({
  tickets,
  selecting,
  isLoading,
  selections,
  setSelections,
}: {
  tickets: Ticket[]
  selecting?: boolean
  isLoading?: boolean
  selections?: number[]
  setSelections?: (sel: number[]) => void
}) => {
  const [detailsDialogIsOpen, setDetailsDialogIsOpen] = useState(false)
  const [ticket, setTicket] = useState<Ticket | undefined>()

  return (
    <>
      <div className="overflow-auto border-t border-x rounded-2xl text-neutral-800 font-medium">
        <table className="w-full">
          <thead>
            <tr className="thead-row">
              {selecting && (
                <th>
                  <CheckCircle
                    onClick={() => {
                      if (setSelections) {
                        setSelections(
                          selections?.[0]
                            ? []
                            : tickets.map((_each, i) => i + 1)
                        )
                      }
                    }}
                    className="w-full"
                    checked={selections && selections.length == tickets.length}
                  />
                </th>
              )}
              <th>TicketID</th>
              <th>Complainant</th>
              <th>Type</th>
              {/* <th>Complainee</th> */}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading
              ? tickets.map((each, i) => (
                  <tr className="tbody-row" key={i + "paymentAll"}>
                    {selecting && (
                      <th>
                        <CheckCircle
                          onClick={() => {
                            if (setSelections && selections) {
                              if (selections?.includes(i + 1)) {
                                setSelections(
                                  selections?.filter((e) => e != i + 1) ?? []
                                )
                              } else {
                                setSelections([...selections, i + 1])
                              }
                            }
                          }}
                          className="w-full"
                          checked={selections?.includes(i + 1)}
                        />
                      </th>
                    )}

                    <td>{each._id}</td>
                    <td className="flex gap-2 items-center">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={each.complainant.passport}
                          alt="Profile Image"
                        />
                        <AvatarFallback>
                          {each.complainant.initial}
                        </AvatarFallback>
                      </Avatar>
                      <span>{each.complainant.name}</span>
                    </td>
                    <td>{each.support_type.name}</td>
                    {/* <td>
                      <span className="flex gap-2 items-center">
                        <Avatar className="size-10">
                          <AvatarImage
                            src={each.complainant.passport}
                            alt="Profile Image"
                          />
                          <AvatarFallback>
                            {each.complainant.initial}
                          </AvatarFallback>
                        </Avatar>
                        <span>{each.complainant.name}</span>
                      </span>
                    </td> */}

                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-full">
                          <StatusPill
                            status={each.status}
                            label={
                              <span className="flex gap-1 items-center capitalize">
                                {each.status} <ChevronDown className="size-4" />
                              </span>
                            }
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {["resolved", "opened", "pending", "escalated"].map(
                            (each) => {
                              const Status =
                                statusMap[each as keyof typeof statusMap]

                              return (
                                <DropdownMenuItem
                                  key={"ticketStatus" + each}
                                  className="capitalize"
                                  style={{ color: Status.color }}
                                >
                                  <Status.icon className="size-3" /> {each}
                                </DropdownMenuItem>
                              )
                            }
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>

                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex size-8 items-center">
                          <Ellipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setTicket(each)
                              setDetailsDialogIsOpen(true)
                            }}
                          >
                            <View /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CircleDotDashed /> Resolve
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <LogOut /> Escalate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Flag /> Flag Complains
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              : new Array(8).fill(null).map((_, i) => (
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
          </tbody>
        </table>
      </div>

      <SupportTicketDialog
        close={() => {
          setDetailsDialogIsOpen(false)
          setTicket(undefined)
        }}
        open={detailsDialogIsOpen}
        ticket={ticket}
      />
    </>
  )
}

export default TicketsTable
