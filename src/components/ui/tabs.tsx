import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List> {
  _style?: 1 | 2 | 3
}
function TabsList({ className, _style = 1, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "w-full flex max-w-fit items-center p-1 overflow-auto",
        {
          1: "gap-1 px-0",
          2: "rounded-md bg-base-white gap-2.5 px-1",
          3: "bg-muted text-muted-foreground inline-flex h-9 rounded-lg px-1",
        }[_style],
        className
      )}
      {...props}
    />
  )
}

interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsPrimitive.Trigger> {
  link?: boolean
  count?: number
  isActive?: boolean
  _style?: 1 | 2 | 3
}

function TabsTrigger({
  className,
  _style = 1,
  count,
  isActive,
  link = false,
  children,
  ...props
}: TabsTriggerProps) {
  const renderContent = (isActive?: boolean) => (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "group focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex items-center justify-center gap-2 whitespace-nowrap transition duration-300 focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

        {
          1: "text-neutral-300 border-primary whitespace-nowrap hover:bg-gray-50 font-medium py-2 px-3 rounded-t-md",
          2: "px-3 py-2 rounded-md text-xs flex items-center gap-2.5 text-neutral-500",
          3: "text-sm font-medium rounded-md",
        }[_style],

        // active styles for trigger (if not link)
        {
          1:
            !link &&
            "data-[state=active]:border-b data-[state=active]:text-primary data-[state=active]:bg-gray-50 data-[state=active]:font-semibold",
          2:
            !link &&
            "data-[state=active]:text-primary-foreground data-[state=active]:bg-primary",
          3: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        }[_style],

        // active styles for trigger (if link)
        isActive &&
          {
            1: "text-primary bg-gray-50 border-b font-semibold",
            2: "text-primary-foreground bg-primary",
            3: "bg-background text-foreground shadow-sm",
          }[_style],
        className
      )}
      {...props}
    >
      {children}

      {!!count && (
        <span
          className={cn(
            "min-w-4",
            {
              1: "",
              2: "text-white bg-primary text-[.5rem] px-1 py-0.5 rounded-[6.25rem]",
              3: "",
            }[_style],

            {
              1: !link && "",
              2:
                !link &&
                " group-data-[state=active]:text-primary group-data-[state=active]:bg-white",
              3: "",
            }[_style],

            isActive &&
              {
                1: "",
                2: "bg-white text-primary",
                3: "",
              }[_style]
          )}
        >
          {count}
        </span>
      )}
    </TabsPrimitive.Trigger>
  )

  return link ? (
    <NavLink to={props.value}>
      {({ isActive }) => renderContent(isActive)}
    </NavLink>
  ) : (
    renderContent(isActive)
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

const CustomTab = ({
  tabs,
  defaultValue,
  link,
  _style = 1,
  children,
  className,
}: {
  tabs: {
    onClick?: () => void
    count?: number
    label: string
    value: string
    active?: boolean
  }[]
  children?: React.JSX.Element
  defaultValue?: string
  className?: string
  link?: boolean
  count?: number
  _style?: 1 | 2 | 3
}) => {
  return (
    <Tabs className={className}>
      <TabsList defaultValue={defaultValue} _style={_style} className="px-0">
        {tabs.map(({ label, value, onClick, count, active }) => (
          <TabsTrigger
            onClick={onClick}
            _style={_style}
            className="capitalize"
            key={label}
            value={value}
            isActive={active}
            count={count}
            link={link}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, CustomTab }
