import { X } from "lucide-react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import { Conversation } from "@/types/chat.type"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ConversationFilter } from "@/services/chat.service"
import MemoAvatarIllus from "./patterns/Avatar"
import { Skeleton } from "./ui/skeleton"
import { format } from "date-fns"
import { useAppSelector } from "@/hooks/redux.hooks"
import { selectApp } from "@/slices/app.slice"

const Conversations: React.FC<{
  showConversations: boolean
  fetchingConversations: boolean
  currentConversation?: Conversation
  conversations: Conversation[]
  selectConversation: (c?: Conversation) => void
  setShowConversations: (show: boolean) => void
  setActiveTab: (f: ConversationFilter["role"]) => void
  activeTab: ConversationFilter["role"]
}> = ({
  setShowConversations,
  showConversations,
  currentConversation,
  conversations,
  selectConversation,
  setActiveTab,
  activeTab,
  fetchingConversations,
}) => {
  const { profile } = useAppSelector(selectApp)

  return (
    <div
      className={cn(
        showConversations ? "left-0" : "-left-full",
        `w-full sm:max-w-xs sm:border-r bg-white absolute @4xl:static inset-y-0 z-30 transition-all duration-500`
      )}
    >
      <div className="flex h-16 min-h-16 items-center justify-between border-b px-4">
        <h1 className="text-lg font-semibold">Messages</h1>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <svg
              className="size-3"
              width="14"
              height="13"
              viewBox="0 0 14 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 10.5H8V12.5H6V10.5ZM4 9H10V7H4V9ZM2 5.5H12V3.5H2V5.5ZM0 0V2H14V0H0Z"
                fill="#222222"
              />
            </svg>
          </Button>

          {currentConversation && (
            <Button
              className="@4xl:hidden"
              variant="ghost"
              size="icon"
              onClick={() => setShowConversations(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid w-full grid-cols-2 rounded-none bg-muted/20 p-4 pb-2">
        {[
          { value: "service_provider", label: " Service Providers" },
          { value: "user", label: "Users" },
        ].map((each) => (
          <button
            onClick={() =>
              setActiveTab(each.value as ConversationFilter["role"])
            }
            key={each.value}
            value={each.value}
            className={cn(
              activeTab == each.value && "bg-muted",
              "rounded-full font-semibold text-xs py-2"
            )}
          >
            {each.label}
          </button>
        ))}
      </div>
      <ScrollArea className="h-[calc(100dvh-112px)]">
        {!fetchingConversations && !conversations.length && (
          <div className="flex flex-col w-full items-center gap-3 text-center justify-center min-h-[calc(100dvh-20rem)]">
            <MemoAvatarIllus className="w-full max-w-[3rem] opacity-50" />
            <p className="text-sm text-gray-500">No Conversation yet.</p>
          </div>
        )}

        {!fetchingConversations &&
          conversations.map((conversation) => (
            <div
              key={conversation.user.id}
              className={cn(
                "flex cursor-pointer w-full sm:max-w-xs items-center gap-3 border-b p-4 hover:bg-muted/50",
                currentConversation?.user.id == conversation.user.id &&
                  "bg-muted/50"
              )}
              onClick={() => selectConversation(conversation)}
            >
              <Avatar>
                <AvatarImage
                  src={conversation.user.passport}
                  alt={conversation.user.name}
                />
                <AvatarFallback>{conversation.user.initial}</AvatarFallback>
              </Avatar>
              <div className="w-full overflow-hidden">
                <div className="font-medium flex justify-between items-center gap-2">
                  <div className="truncate">{conversation.user.name}</div>
                  {conversation.last_message && (
                    <span className="text-muted-foreground text-[.7rem]">
                      {format(conversation.last_message.created_at, "hh:mm a")}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="truncate text-sm text-muted-foreground">
                    {conversation.last_message?.message ?? (
                      <i className="text-xs">Click to start chatting</i>
                    )}
                  </div>
                  {!conversation.last_message?.is_read &&
                    conversation.last_message?.sender != profile?.id && (
                      <div className="size-2 min-w-2 rounded-full bg-primary"></div>
                    )}
                </div>
              </div>
            </div>
          ))}

        {fetchingConversations &&
          Array(10)
            .fill(null)
            .map((_, i) => (
              <div
                className="flex max-w-xs items-center gap-3 border-b p-4"
                key={"conversation" + i}
              >
                <Skeleton className="rounded-full min-w-9 size-9" />
                <div className="w-full flex flex-col gap-3">
                  <Skeleton
                    className={cn("h-3")}
                    style={{
                      width: `${
                        Math.floor(Math.random() * (95 - 50 + 1)) + 50
                      }%`,
                    }}
                  />
                  <Skeleton
                    className={cn("h-2")}
                    style={{
                      width: `${
                        Math.floor(Math.random() * (95 - 50 + 1)) + 50
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
      </ScrollArea>
    </div>
  )
}

export default Conversations
