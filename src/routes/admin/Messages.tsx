import Conversations from "@/components/Conversations"
import MemoEmptyChat from "@/components/patterns/EmptyChat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/widgets/Header"
import { useAppSelector } from "@/hooks/redux.hooks"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import {
  ConversationFilter,
  useGetChatsQuery,
  useGetConversationsQuery,
  useSendChatMutation,
} from "@/services/chat.service"
import { selectApp, setNewMessage } from "@/slices/app.slice"
import { Conversation } from "@/types/chat.type"
import { format } from "date-fns"
import {
  ChevronDown,
  Loader2,
  Menu,
  Phone,
  Search,
  Send,
  User,
  Video,
  X,
} from "lucide-react"
import "quill/dist/quill.snow.css"
import type React from "react"
import { useId, useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"

export default function SupportMessaging() {
  const [showProfile, setShowProfile] = useState(false)
  const [message, setMessage] = useState("")
  const dispatch = useDispatch()
  const [currentConversation, setCurrentConversation] = useState<
    Conversation | undefined
  >()
  const [activeTab, setActiveTab] =
    useState<ConversationFilter["role"]>("service_provider")
  const isMobile = useMediaQuery("(max-width: 768px)")
  const chatContainerId = useId()
  const [showConversations, setShowConversations] = useState(true)
  const { profile, newMessages } = useAppSelector(selectApp)
  const { data: conversations, isFetching: fetchingConversations } =
    useGetConversationsQuery(
      {
        role: activeTab,
        adminId: profile?.id ?? 0,
      },
      { skip: !profile }
    )
  const { data: chats, isFetching: loadingChats } = useGetChatsQuery(
    {
      conversation: currentConversation?.id ?? 0,
    },
    { skip: !currentConversation }
  )

  const [sendChat, { isLoading: sendingChat }] = useSendChatMutation()

  const scrollToBottom = () => {
    setTimeout(() => {
      const chatDiv = document.getElementById(chatContainerId)
      if (!chatDiv) return
      chatDiv.scrollTop = chatDiv.scrollHeight
    }, 300)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentConversation) return

    if (message.trim()) {
      const { error } = await sendChat({
        message,
        conversation: currentConversation?.id,
        adminId: profile?.id ?? 0,
        role: activeTab,
      })

      if (error) {
        toast.error("Error", {
          description:
            "message" in error ? error?.message : "Couldn't send chat",
        })
      } else {
        setMessage("")
        setTimeout(() => {
          scrollToBottom()
        }, 300)
      }
    }
  }

  //   const toggleProfile = () => {
  //     setShowProfile(!showProfile)
  //   }

  const handleUserClick = (conversation?: Conversation) => {
    setCurrentConversation(conversation)
    setShowConversations(false)
    scrollToBottom()

    if (!currentConversation) return
    dispatch(setNewMessage({ id: currentConversation.id, message }))
    if (!conversation || !newMessages) {
      setMessage("")
    } else {
      setMessage(newMessages[conversation.id])
    }
  }

  const handleUserNameClick = () => {
    setShowProfile(true)
  }

  //   const { quill, quillRef } = useQuill({ placeholder: "Type message here" })

  //   const editor = useRef(null)
  //   const [content, setContent] = useState("")

  //   const config = useMemo(
  //     () => ({
  //       readonly: false, // all options from https://xdsoft.net/jodit/docs/,
  //       placeholder: "Start typings...",
  //     }),
  //     []
  //   )

  return (
    <div className="pb-6 @container">
      <Header />

      <div className="flex mt-2 h-[calc(100dvh_-_7.5rem)] border rounded-lg w-full overflow-hidden bg-white relative">
        {/* Conversation List Sidebar */}
        <Conversations
          fetchingConversations={fetchingConversations}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          conversations={conversations ?? []}
          selectConversation={handleUserClick}
          setShowConversations={setShowConversations}
          showConversations={showConversations}
          currentConversation={currentConversation}
        />

        {/* Chat Area */}
        <div className="flex flex-1 flex-col">
          {!currentConversation && (
            <div className="flex flex-col gap-4 w-full items-center max-w-xs text-center p-4 m-auto">
              <MemoEmptyChat className="w-full opacity-50" />
              <p className="text-gray-600 text-sm">
                Select a conversation to start chatting.
              </p>
            </div>
          )}

          {currentConversation && (
            <>
              {/* Chat Header */}

              <div className="flex h-16 min-h-16 items-center gap-2 border border-primary bg-primary px-4 text-white">
                <Button
                  variant="ghost"
                  size="icon"
                  className="@4xl:hidden"
                  onClick={() => setShowConversations(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>

                <button
                  disabled
                  className="flex items-center text-neutral-800 rounded-full bg-white/80 p-1"
                  onClick={handleUserNameClick}
                >
                  <Avatar className="size-8 min-w-8">
                    <AvatarImage
                      src={currentConversation?.user.passport}
                      alt={currentConversation?.user.name}
                    />
                    <AvatarFallback>
                      {currentConversation?.user.initial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium px-3">
                    {currentConversation?.user.name.split(" ")[0]}
                  </span>
                </button>

                <div className="ml-auto flex items-center gap-2">
                  {/* <Button variant="ghost" size="icon" className="text-white">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white">
                <Phone className="h-5 w-5 rotate-135" />
              </Button> */}
                </div>
              </div>

              {/* Messages */}
              <ScrollArea
                viewPortId={chatContainerId}
                className="h-full max-h-[calc(100dvh-16.5rem)] p-4"
              >
                {!loadingChats &&
                  chats &&
                  chats.map((chat, i) => (
                    <div key={"chat" + chat.id} className="mb-6">
                      {(!chats[i - 1] ||
                        format(chats[i - 1].created_at, "yyyy-MM-dd") !=
                          format(chat.created_at, "yyyy-MM-dd")) && (
                        <div className="mb-4 text-center">
                          <span className="text-sm text-muted-foreground">
                            {format(chat.created_at, "yyyy-MM-dd") ==
                            format(new Date(), "yyyy-MM-dd")
                              ? "Today"
                              : format(chat.created_at, "MMMM dd, yyyy")}
                          </span>
                        </div>
                      )}

                      <div
                        className={cn(
                          "mb-4 flex",
                          chat.sender.id == profile?.id ? "justify-start" : ""
                        )}
                      >
                        <div className="flex max-w-[80%] gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={chat.sender.passport}
                              alt={chat.sender.name}
                            />
                            <AvatarFallback>
                              {chat.sender.initial}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <div className="mb-1 flex items-center gap-2">
                              <span className="font-medium">
                                {chat.sender.id == profile?.id
                                  ? "You"
                                  : chat.sender.name.split(" ")[0]}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format(chat.created_at, "hh:mm a")}
                              </span>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-3">
                              {chat.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {loadingChats && (
                  <div className="space-y-6">
                    {[...Array(15)].map((_, i) => (
                      <div key={i} className="flex gap-4 max-w-[80%] mb-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-2 w-10" />
                          </div>
                          <Skeleton
                            className="h-8 rounded-lg"
                            style={{
                              width: `${Math.floor(
                                Math.random() * (75 - 30 + 1) + 30
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              {/* <JoditEditor
            className="[--jd-color-panel:#ffffff]"
            ref={editor}
            value={content}
            config={{
              ...config,
              //   buttons: ["bold", "italic", "source"],
              buttons:
                "bold,italic,underline,ul,ol,fontsize,lineHeight,file,image,cut,copy,paste,link,indent,outdent,left,undo,redo",
              buttonsMD:
                "bold,italic,underline,ul,ol,fontsize,lineHeight,file,image,cut,copy,paste,link,indent,outdent,left,undo,redo",
              buttonsXS:
                "bold,italic,underline,ul,ol,fontsize,lineHeight,file,image,cut,copy,paste,link,indent,outdent,left,undo,redo",
              //   buttons:
              //     "bold,italic,underline,ul,ol,fontsize,lineHeight,file,image,cut,copy,paste,link,indent,outdent,left,undo,redo",
            }}
            tabIndex={1} // tabIndex of textarea
            // onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
            onChange={debounce((newContent) => {
              console.log(newContent)
            }, 300)}
          /> */}

              {/* <div style={{ height: 300 }}>
            <div ref={quillRef} />
          </div> */}

              <form onSubmit={handleSendMessage} className="border-t p-4">
                <div className="flex items-center h-12 rounded-lg gap-2 border focus-within:border-neutral-500 transition-all">
                  <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-full outline-none px-4"
                  />
                  <Button
                    type="submit"
                    className="text-primary mr-2"
                    size="icon"
                    variant={"ghost"}
                  >
                    {sendingChat ? (
                      <Loader2 className={cn("animate-spin")} />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Profile Sidebar */}
        {showProfile && (
          <div
            className={`${
              isMobile ? "absolute inset-0 z-50 bg-white" : "relative"
            } w-80 border-l`}
          >
            {currentConversation && (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b p-4">
                  <h2 className="text-lg font-semibold">Profile</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowProfile(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex flex-col items-center justify-center p-6">
                  <Avatar className="mb-4 h-20 w-20">
                    <AvatarImage
                      src={currentConversation.user.passport}
                      alt={currentConversation.user.name}
                    />
                    <AvatarFallback>
                      {currentConversation.user.initial}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">
                    {currentConversation.user.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Active
                    {/* {currentConversation.lastActive} */}
                  </p>
                  <div className="mt-6 flex w-full justify-between">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="mt-2 flex w-full justify-between">
                    <span className="text-xs text-center block w-16">
                      Profile
                    </span>
                    <span className="text-xs text-center block w-16">
                      Audio
                    </span>
                    <span className="text-xs text-center block w-16">
                      Video
                    </span>
                    <span className="text-xs text-center block w-16">
                      Search
                    </span>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="px-4">
                    <div className="mb-4">
                      <Button
                        variant="ghost"
                        className="flex w-full justify-between px-2 py-6"
                        onClick={() => {}}
                      >
                        <span className="font-medium">
                          All Listed properties
                        </span>
                        <ChevronDown className="h-5 w-5" />
                      </Button>
                      <Separator />
                    </div>

                    <div className="mb-4">
                      <Button
                        variant="ghost"
                        className="flex w-full justify-between px-2 py-6"
                        onClick={() => {}}
                      >
                        <span className="font-medium">
                          Media, files and links
                        </span>
                        <ChevronDown className="h-5 w-5" />
                      </Button>
                      <Separator />
                    </div>

                    <div className="mb-4">
                      <Button
                        disabled={sendingChat}
                        variant="ghost"
                        className="flex w-full justify-between px-2 py-6"
                        onClick={() => {}}
                      >
                        <span className="font-medium">Privacy & support</span>
                        <ChevronDown className="h-5 w-5" />
                      </Button>
                      <Separator />
                    </div>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
