import * as Cmd from "@/components/ui/command"
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks"
import { adminNavLinks } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { selectApp, setNavIsOpen } from "@/slices/app.slice"
import { ChevronRight } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SideMenuIcon from "../icons/Menu"
import MemoMessage from "../icons/Message"
import MemoNotification from "../icons/Notification"
import MemoSettings from "../icons/Settings"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import SearchInput from "./SearchInput"

const Header = () => {
  const dispatch = useAppDispatch()
  const { profile } = useAppSelector(selectApp)
  // console.log(profile?.passport)

  return (
    <div className="flex sticky bg-white z-10 top-0 justify-between items-center gap-3 md:gap-5 overflow-hidden py-5">
      <button
        type="button"
        title="Menu Toggle"
        className="lg:hidden p-3 -m-3"
        onClick={() => dispatch(setNavIsOpen(true))}
      >
        <SideMenuIcon />
      </button>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Avatar className="size-12">
          <AvatarImage
            src={profile?.passport}
            className="object-cover"
            alt="Profile Image"
          />
          <AvatarFallback>{profile?.initial}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col -space-y-1">
          <h3 className="text-neutral-800 text-xl font-semibold">
            Welcome, {profile?.first_name}
          </h3>
          <p className="text-neutral-500">Your latest insights</p>
        </div>
      </div>

      <div className="flex w-full justify-end gap-4">
        <SearchBox />
        <button className="border rounded-full border-[#e3e3e3] items-center flex justify-center size-12 min-w-12">
          <MemoNotification />
        </button>
      </div>
    </div>
  )
}

export default Header

export function SearchBox() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full xl:w-[27rem] cursor-pointer"
      >
        <SearchInput
          suffix={
            <kbd className="hidden sm:flex pointer-events-none text-neutral-600 select-none items-center gap-1 px-1.5 font-mono text-sm font-medium">
              <span className="text-lg mt-0.5">⌘</span>J
            </kbd>
          }
          containerClass="w-12 sm:w-full"
          className="cursor-pointer"
        />
      </button>

      <Cmd.CommandDialog open={open} onOpenChange={setOpen}>
        <Cmd.CommandInput placeholder="Search for link to a page..." />
        <Cmd.CommandList>
          <Cmd.CommandEmpty>No results found.</Cmd.CommandEmpty>
          <Cmd.CommandGroup heading="Search Result">
            {[
              ...adminNavLinks,
              {
                key: "message",
                label: "Message",
                icon: MemoMessage,
                path: "/admin/messages",
              },
              {
                key: "settings",
                label: "Settings",
                icon: MemoSettings,
                path: "/admin/settings",
              },
            ].map((each) => (
              <SearchItem {...each} key={each.key} setOpen={setOpen} />
            ))}
          </Cmd.CommandGroup>
        </Cmd.CommandList>
      </Cmd.CommandDialog>
    </>
  )
}

interface RouteLink {
  label: string
  sub?: RouteLink[]
  path: string
  parent?: RouteLink
  icon?: React.FC
}

const SearchItem: React.FC<
  RouteLink & { setOpen: (open: boolean) => void }
> = ({ setOpen, ...each }) => {
  const navigate = useNavigate()

  return (
    <>
      {!each.sub && (
        <Cmd.CommandItem
          onSelect={() => {
            navigate(each.path)
            setOpen(false)
          }}
        >
          <SearchItemLabel
            icon={each.icon}
            label={each.label}
            parent={each.parent}
          />
        </Cmd.CommandItem>
      )}

      {each.sub &&
        each.sub.map((eachChild) => (
          <SearchItem
            parent={each}
            setOpen={setOpen}
            {...eachChild}
            key={eachChild.path + each.path}
          />
        ))}
    </>
  )
}

interface SearchItemLabelI {
  label: RouteLink["label"]
  icon?: RouteLink["icon"]
  parent?: SearchItemLabelI
}

const SearchItemLabel = ({ label, parent, icon: Icon }: SearchItemLabelI) => {
  return (
    <>
      {Icon ? <Icon /> : parent?.icon ? <parent.icon /> : ""}

      {parent && (
        <>
          <SearchItemLabel
            label={parent.label}
            parent={parent.parent}
            icon={Icon}
          />
          <ChevronRight />
        </>
      )}

      <span className={cn(parent && "text-neutral-600", "truncate")}>
        {label}
      </span>
    </>
  )
}
