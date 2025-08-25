import { X } from "lucide-react"
import { Button } from "./ui/button"

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { UsersFilterProps } from "@/services/user.service"
import { useState } from "react"
import { useGetRolesQuery } from "@/services/app.service"

const UserFilter: React.FC<UsersFilterProps> = (props) => {
  const [filters, setFilters] = useState(props.filters)
  const { data: roles } = useGetRolesQuery("")

  return (
    <DialogContent className="w-[85vw] max-w-md ">
      <DialogHeader>
        <DialogTitle className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-lg sm:text-2xl whitespace-nowrap text-base-black flex items-center gap-3">
            <DialogClose>
              <X />
            </DialogClose>
            Filter Options
          </div>
          <button
            onClick={() => setFilters({})}
            className="font-medium sm:text-lg whitespace-nowrap text-primary"
          >
            Reset filter
          </button>
        </DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div className="flex  overflow-auto flex-col gap-6 mt-2">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <h3 className="font-medium text-lg text-neutral-900">
              Sort by ratings
            </h3>
            <RadioGroup
              defaultValue="1_2_listings"
              className="flex flex-col gap-4 max-h-[30rem] overflow-auto"
            >
              {[
                { label: "1 ～ 2 Listings", value: "1_2_listings" },
                { label: "2 ～ 3 Listings", value: "2_3_listings" },
                { label: "3 ～ 4 Listings", value: "3_4_listings" },
                { label: "4 ～ 5 Listings", value: "4_5_listings" },
              ].map((each, i) => (
                <div
                  key={i + "location"}
                  className="flex gap-2 pr-6 text-neutral-600 justify-between items-center"
                >
                  <span>{each.label}</span>
                  <RadioGroupItem value={each.value} id={each.value} />
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="font-medium text-lg text-neutral-900">
              Sort by role
            </h3>
            <RadioGroup
              onValueChange={(value) => {
                setFilters((f) => ({
                  ...f,
                  user_role: roles
                    ?.filter((each) => !each.is_admin)
                    .find((each) => each.id == value),
                }))
              }}
              // disabled={field.disabled}
              // value={field.value as string}
              defaultValue={filters.user_role?.id}
              className="flex flex-col gap-4 max-h-[30rem] overflow-auto"
            >
              {roles?.map((each) => (
                <div
                  key={"role" + each.id}
                  className="flex gap-2 pr-6 text-neutral-600 justify-between items-center"
                >
                  <span>{each.label}</span>
                  <RadioGroupItem value={each.id} />
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            onClick={() => {
              props.setFilters(filters)
              props.setOpen(false)
            }}
            className="px-10 font-normal"
            size={"lg"}
          >
            Apply filter
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

export default UserFilter
