import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import * as Form from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useProfile } from "@/hooks/use-profile"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useRef } from "react"

const Profile = () => {
  const dp = useRef<HTMLInputElement>(null)
  const { profile, ...handler } = useProfile()

  return (
    <div>
      <Form.Form {...handler.form}>
        <form
          className="gap-8 flex-col max-w-[34rem] grid grid-cols-3"
          onSubmit={handler.form.handleSubmit(handler.onSubmit)}
        >
          <div className="flex items-center gap-3 col-span-full">
            <input
              ref={dp}
              type="file"
              accept="image/*"
              onChange={handler.handleImageChange}
              className="hidden"
            />
            <button
              className="rounded-full"
              type="button"
              onClick={() => dp.current?.click()}
            >
              <Avatar className="size-16">
                <AvatarImage
                  className="object-cover"
                  src={(handler.passportPreview as string) || profile?.passport}
                  alt="Profile Image"
                />
                <AvatarFallback>{profile?.initial}</AvatarFallback>
              </Avatar>
            </button>
            <div className="flex flex-col gap-1">
              <h3 className="text-[#242424] text-sm font-semibold">
                {profile?.fullname}
              </h3>
              <p className="text-xs text-[#475569]">
                {profile?.is_superuser && "Super"} Admin
              </p>
            </div>
          </div>

          {handler.fields.map(({ name, placeholder, label, ...each }, i) => {
            const field = (
              <Form.FormField
                control={handler.form.control}
                name={name}
                key={"field" + i}
                render={({ field }) => (
                  <Form.FormItem
                    className={cn(
                      "flex flex-col col-span-full",
                      each.className
                    )}
                  >
                    <Form.FormLabel className="font-medium text-sm text-[#242424]">
                      {label}
                    </Form.FormLabel>

                    {name == "code" ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Form.FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between font-normal h-11 text-neutral-500 focus:text-neutral-800"
                                // !field.value && "text-neutral-500"
                              )}
                            >
                              <span className="truncate">
                                {field.value
                                  ? handler?.countries?.find(
                                      (country) => country.value === field.value
                                    )?.label
                                  : "Select Country"}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </Form.FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="max-w-40 p-0">
                          <Command>
                            <>
                              <CommandInput placeholder="Search Country..." />
                              <CommandList>
                                <CommandEmpty>No Country Found.</CommandEmpty>
                                <CommandGroup>
                                  {handler.countries?.map((country) => (
                                    <CommandItem
                                      value={country.value}
                                      key={country.label}
                                      onSelect={() => {
                                        handler.form.setValue(
                                          "code",
                                          country.value
                                        )
                                      }}
                                    >
                                      {country.label}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          country.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Form.FormControl>
                        <div className="relative">
                          <each.icon className="absolute top-0 bottom-0 my-auto left-4" />
                          <Input
                            className="text-neutral-500 focus:text-neutral-800 pl-10"
                            placeholder={placeholder}
                            {...field}
                          />
                        </div>
                      </Form.FormControl>
                    )}
                    <Form.FormMessage />
                  </Form.FormItem>
                )}
              />
            )

            return field
            // return name == "phone" ? (
            //   <div key={"field" + i}>{field}</div>
            // ) : (
            //   <div key={"field" + i}>{field}</div>
            // )
          })}

          <div className="col-span-full">
            <Button isLoading={handler.isLoading} size={"lg"} className="w-fit">
              Update
            </Button>
          </div>
        </form>
      </Form.Form>
    </div>
  )
}

export default Profile
