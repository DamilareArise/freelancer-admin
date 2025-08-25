import { useSecurity } from "@/hooks/use-security"
import * as Form from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const Security = () => {
  const { ...handler } = useSecurity()

  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-medium">Update Password</h3>

      <div>
        <Form.Form {...handler.form}>
          <form
            className="gap-8 flex-col max-w-[30rem] grid grid-cols-3"
            onSubmit={handler.form.handleSubmit(handler.onSubmit)}
          >
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
                      <Form.FormControl>
                        <div className="relative">
                          <each.icon className="absolute top-0 bottom-0 my-auto left-4" />
                          <Input
                            type={each.type}
                            className="text-neutral-500 focus:text-neutral-800 pl-10"
                            placeholder={placeholder}
                            {...field}
                          />
                        </div>
                      </Form.FormControl>
                      {name == "new_password" && (
                        <ul
                          className={cn(
                            "list-disc flex flex-col gap-2 text-neutral-700 text-xs pl-4",
                            handler.form.getFieldState("new_password")
                              .isTouched && "text-red-700"
                          )}
                        >
                          <li
                            className={cn(
                              /.*[A-Z]/.test(field.value) &&
                                handler.form.getFieldState("new_password")
                                  .isTouched &&
                                "text-primary"
                            )}
                          >
                            At least one uppercase letter
                          </li>
                          <li
                            className={cn(
                              /.*[a-z]/.test(field.value) &&
                                handler.form.getFieldState("new_password")
                                  .isTouched &&
                                "text-primary"
                            )}
                          >
                            At least one lower letter
                          </li>
                          <li
                            className={cn(
                              /.*\d/.test(field.value) &&
                                handler.form.getFieldState("new_password")
                                  .isTouched &&
                                "text-primary"
                            )}
                          >
                            At least one digit
                          </li>
                          <li
                            className={cn(
                              /.*[!\\|@#$%+=^&*().]/.test(field.value) &&
                                "text-primary"
                            )}
                          >
                            At least one special character
                          </li>
                          <li
                            className={cn(
                              field.value?.length >= 8 && "text-primary"
                            )}
                          >
                            At least eight characters
                          </li>
                        </ul>
                      )}
                      {name != "new_password" && <Form.FormMessage />}
                    </Form.FormItem>
                  )}
                />
              )

              return field
            })}

            <div className="col-span-full">
              <Button
                isLoading={handler.isLoading}
                size={"lg"}
                className="w-full"
              >
                Update
              </Button>
            </div>
          </form>
        </Form.Form>
      </div>
    </div>
  )
}

export default Security
