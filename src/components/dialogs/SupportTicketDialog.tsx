import { pluralize } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { TicketDialogProps } from "@/types/ticket.type"
import {
  Calendar,
  ChevronDown,
  Download,
  Eye,
  File,
  ListCheck,
  Loader2,
} from "lucide-react"
import { useState } from "react"
import MemoPersonSupport from "../icons/PersonSupport"
import MemoSupportMessage from "../icons/SupportMessage"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useCreateConversationMutation } from "@/services/chat.service"
import { toast } from "sonner"
import WarnDialog from "../widgets/WarnDialog"
import { format } from "date-fns"

const SupportTicketDialog = (props: TicketDialogProps) => {
  const ticket = props.ticket
  const [createConversation, { isLoading: isCreatingConversation }] =
    useCreateConversationMutation()
  const [confirmCreateConversationIsOpen, setConfirmCreateConversationIsOpen] =
    useState(false)
  // const handler = useSupportTicketDialog(props)

  const handleCreateConversation = async () => {
    setConfirmCreateConversationIsOpen(false)
    const { error } = await createConversation({ receiver: 3 })

    if (!error) {
      toast.success("Success", {
        description: "Conversation Created",
      })
    } else if ("message" in error) {
      toast.error("Error.", {
        position: "bottom-left",
        description: error?.message,
      })
    }
  }

  return (
    <Dialog
      open={props.open}
      onOpenChange={(open) => {
        if (!open && !isCreatingConversation) {
          props.close()
        }
      }}
    >
      <DialogContent className="sm:max-w-xl p-0" _style={2}>
        <DialogHeader className={cn("top-0 bg-white z-10", "sticky")}>
          <DialogTitle className="bg-primary/5 py-5 px-6 border-primary border-b justify-between flex items-center gap-5">
            <div className="flex items-center gap-2 w-full">
              <MemoPersonSupport className="size-8" />
              <div className="flex flex-col">
                <div className="text-base font-bold text-neutral-900">
                  Misrepresented Property
                </div>
                <div className="flex flex-wrap font-normal items-center gap-2 text-neutral-600 text-xs">
                  <span> {ticket?._id} </span>
                  <UserLine
                    user={ticket?.complainant}
                    className="whitespace-nowrap"
                  />
                  <span className="flex items-center gap-1">
                    <ListCheck className="size-3" />
                    {ticket?.created_at &&
                      format(new Date(ticket?.created_at), "hh:mm a")}
                  </span>
                </div>
              </div>

              {isCreatingConversation ? (
                <Loader2 className="ml-auto animate-spin" />
              ) : (
                <button
                  onClick={() => setConfirmCreateConversationIsOpen(true)}
                  className="ml-auto"
                >
                  <MemoSupportMessage className=" size-5" />
                </button>
              )}
            </div>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="px-5 pb-5">
          <Tabs defaultValue="reported-issue" className="grid">
            <TabsList
              className="capitalize max-w-[unset] min-w-full mb-3"
              _style={2}
            >
              {[
                { label: "Reported Issue", value: "reported-issue" },
                { label: "Submitted Evidence", value: "evidences" },
                { label: "Service Provider Info", value: "service-provider" },
                { label: "Handle Issue", value: "handle-issue" },
              ].map(({ value, label }) => (
                <TabsTrigger
                  className="flex-1"
                  key={label}
                  value={value}
                  _style={2}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="reported-issue">
              <ReportedIssue ticket={ticket} />
            </TabsContent>
            <TabsContent value="evidences">
              <Evidences ticket={ticket} />
            </TabsContent>
            <TabsContent value="service-provider">
              <ServiceProviderInfo ticket={ticket} />
            </TabsContent>
            <TabsContent value="handle-issue">
              <HandleIssue ticket={ticket} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      <WarnDialog
        onConfirm={handleCreateConversation}
        variant="primary"
        icon={<MemoSupportMessage className="size-5 text-primary" />}
        open={confirmCreateConversationIsOpen}
        setOpen={setConfirmCreateConversationIsOpen}
        title="Do you want to initiate chat?"
        desc="This will create a conversation with the user. You can then proceed to
        handle the issue in the chat."
      />
    </Dialog>
  )
}

export default SupportTicketDialog

const HandleIssue: React.FC<{
  ticket: TicketDialogProps["ticket"]
}> = ({ ticket }) => {
  const [action, setAction] = useState<string | undefined>()

  return (
    <div className="flex flex-col gap-4">
      <ReportedIssue ticket={ticket} withToggle />

      <div className="flex flex-col gap-1 text-sm">
        <span className="font-medium ">Handle Issue</span>
        <p className="text-xs text-neutral-700">
          Each issue has specific actions that can be taken. Endeavour to verify
          before taking an action.
        </p>
      </div>

      <RadioGroup className="text-neutral-600" onValueChange={setAction}>
        {[
          { value: "warning", label: "Issue Warning (For first offenders)" },
          {
            value: "restrict",
            label: "Restrict account Temporarily (For repeated offence)",
          },
          {
            value: "suspend",
            label: "Suspend account (Excessive violation)",
          },
          {
            value: "blacklist",
            label: "Black list user (For repeated offence)",
          },
          {
            value: "request-image-update",
            label: "Request update images from service provider",
          },
          {
            value: "escalate-to-admin",
            label: "Escalate to admin intervention",
          },
        ].map((each) => (
          <div
            key={each.value}
            className="flex items-center justify-between gap-3"
          >
            <Label
              className={cn(
                "text-xs transition w-full",
                each.value == action && "text-neutral-900"
              )}
              htmlFor={each.value}
            >
              {each.label}
            </Label>
            <RadioGroupItem value={each.value} id={each.value} />
          </div>
        ))}
      </RadioGroup>

      <Button disabled={!action}>Confirm</Button>
    </div>
  )
}

const ServiceProviderInfo: React.FC<{
  ticket: TicketDialogProps["ticket"]
}> = ({ ticket }) => {
  return (
    <div className="flex flex-col gap-2 text-neutral-800">
      <UserLine user={ticket?.complainant} className="font-medium" />
      <div className="flex items-center gap-1 text-xs text-destructive">
        <span>Previous {pluralize(2, "warning")}</span>
        <span className="rounded-full size-5 flex items-center justify-center border">
          2
        </span>
      </div>
      <div className="rounded-md p-2 border divide-y flex flex-col gap-2">
        <div className="flex justify-between gap-3 pb-2 items-center">
          <div className="flex flex-wrap items-center">
            <Badge>No Show</Badge>
            <Badge className="bg-transparent border-none ">
              <Calendar /> {new Date().toDateString()}
            </Badge>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-xs font-medium text-neutral-600">KL1234</span>
            <UserLine
              user={ticket?.complainant}
              className="font-medium justify-end text-end"
            />
          </div>
        </div>
        {[1, 2, 3].map((each) => (
          <div
            key={"warning" + each}
            className="flex justify-between items-center gap-3 pb-2 last:pb-0"
          >
            <div className="flex flex-wrap items-center">
              <Badge>Misrepresented Property</Badge>
              <Badge className="bg-transparent border-none ">
                <Calendar /> {new Date().toDateString()}
              </Badge>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="text-xs text-neutral-600">KL1234</span>
              <UserLine
                user={ticket?.complainant}
                className="font-medium justify-end text-end"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Evidences: React.FC<{ ticket: TicketDialogProps["ticket"] }> = ({
  ticket,
}) => {
  const [currentEvidence, setCurrentEvidence] = useState<string | undefined>()
  console.log(ticket)
  return (
    <>
      <div className="flex flex-col gap-3 fade">
        {[{ id: "12" }, { id: "123" }, { id: "45" }].map((each) => (
          <div className="flex flex-col gap-2" key={"evidence" + each.id}>
            <div
              className={cn(
                "border rounded-md items-center px-3 py-2 flex justify-between gap-2 text-neutral-700 border-dashed",
                currentEvidence == each.id && "border-primary"
              )}
            >
              <div className="items-center gap-2 flex">
                <File className="size-5 text-neutral-600" />
                <div className="flex flex-col">
                  <h3 className="font-medium text-sm">Evidence {each.id}</h3>
                  <span className="text-xs text-neutral-500">12MB</span>
                </div>
              </div>
              <div className="items-center gap-2 flex">
                <button
                  onClick={() =>
                    setCurrentEvidence(
                      currentEvidence == each.id ? undefined : each.id
                    )
                  }
                >
                  <Eye className="size-4 mt-0.5" />
                </button>
                <button>
                  <Download className="size-4" />
                </button>
              </div>
            </div>
            {currentEvidence == each.id && (
              <div className="rounded-md border fade overflow-hidden h-80">
                <img
                  className="object-cover w-full h-full"
                  src="https://service.klikoproperty.com/media/listingResources/frames-for-your-heart-2d4lAQAlbDA-unsplash.jpg"
                  alt=""
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

const ReportedIssue: React.FC<{
  ticket: TicketDialogProps["ticket"]
  withToggle?: boolean
}> = ({ ticket, withToggle }) => {
  const [responseIsOpened, setResponseIsOpened] = useState(false)
  const [chatIsOpened, setChatIsOpened] = useState(withToggle ? false : true)

  return (
    <>
      <div className="flex justify-between gap-2 flex-wrap fade">
        <div className="flex flex-col">
          <h3 className="text-neutral-600 text-xs font-semibold">Issue Type</h3>
          <h3 className="text-neutral-800 text-sm font-medium">
            {ticket?.support_type.name}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col sm:items-end sm:text-end">
            <h3 className="text-neutral-600 text-xs font-semibold">
              Date Submitted
            </h3>
            <h3 className="text-neutral-800 text-xs font-medium">
              {ticket?.created_at &&
                new Date(ticket?.created_at).toDateString()}
            </h3>
          </div>
          {withToggle && (
            <button onClick={() => setChatIsOpened(!chatIsOpened)}>
              <ChevronDown
                className={cn(
                  "size-4 transition duration-300",
                  chatIsOpened && "-scale-y-100"
                )}
              />
            </button>
          )}
        </div>
      </div>

      {chatIsOpened && (
        <div className="mt-4 flex flex-col gap-3 fade">
          <div className="flex items-center gap-1 text-xs">
            <UserLine user={ticket?.complainant} className="font-medium" />
            <span className="text-neutral-800 font-semibold">
              reports that;
            </span>
          </div>

          <div
            className={cn(
              "border-1 text-xs bg-neutral-50 text-neutral-700 leading-6 rounded-md p-2 transition duration-300",
              responseIsOpened && "border-dashed border-primary"
            )}
          >
            This property listed by{" "}
            <Avatar className="size-4 inline-flex mx-1">
              <AvatarImage
                src={ticket?.complainant.passport}
                alt="Profile Image"
              />
              <AvatarFallback>{ticket?.complainant.initial}</AvatarFallback>
            </Avatar>{" "}
            <span className="text-neutral-800 font-semibold">
              {ticket?.complainant.name}
            </span>{" "}
            was completely different from what I was shown during the tour. I
            feel deceived having gone the stress of going tro view the property.
          </div>

          <Collapsible
            open={responseIsOpened}
            onOpenChange={setResponseIsOpened}
          >
            <div className="flex justify-end mb-3 ">
              <CollapsibleTrigger
                className={cn(
                  "border text-xs flex items-center px-2 py-1 rounded",
                  responseIsOpened && "text-primary"
                )}
              >
                View service provider’s response
                <ChevronDown
                  className={cn(
                    "size-4 transition duration-300",
                    responseIsOpened && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div
                className={cn(
                  "border-1 fade text-xs bg-neutral-50 text-neutral-700 leading-6 rounded-md p-2 transition duration-300",
                  responseIsOpened && "border-dashed border-primary"
                )}
              >
                This property shown to{" "}
                <Avatar className="size-4 inline-flex mx-1">
                  <AvatarImage
                    src={ticket?.complainant.passport}
                    alt="Profile Image"
                  />
                  <AvatarFallback>LY</AvatarFallback>
                </Avatar>{" "}
                <span className="text-neutral-800 font-semibold">
                  Lamine Yamal
                </span>{" "}
                was completely the same to the listing made
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </>
  )
}

const UserLine = ({
  user,
  className,
}: {
  className?: string
  user?: { passport?: string; name: string; initial: string }
}) => {
  return (
    <div className={cn("flex items-center gap-1 text-xs", className)}>
      <Avatar className="size-4">
        <AvatarImage src={user?.passport} alt="Profile Image" />
        <AvatarFallback>{user?.initial}</AvatarFallback>
      </Avatar>
      <span className="text-neutral-600">{user?.name}</span>
    </div>
  )
}
