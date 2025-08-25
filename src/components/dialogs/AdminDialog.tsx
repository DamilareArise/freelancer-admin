import { useAdminDialog } from "@/hooks/use-admin"
import { cn } from "@/lib/utils"
import { AdminDialogProps } from "@/types/admin.type"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { MultiSelect } from "../ui/multi-select"

const AdminDialog = (props: AdminDialogProps) => {
  const admin = props.admin
  const handler = useAdminDialog(props)

  return (
    <Dialog
      open={props.open}
      onOpenChange={(open) => {
        if (!open) {
          props.close()
        }
      }}
    >
      <DialogContent className="sm:max-w-lg p-0" _style={2}>
        <Form {...handler.form}>
          <form onSubmit={handler.form.handleSubmit(handler.onSubmit)}>
            <DialogHeader className={cn("top-0 bg-white z-10", "sticky")}>
              <DialogTitle className="bg-primary/10 py-5 px-6 border-primary border-b justify-between flex items-center gap-5">
                <div className="text-lg font-bold text-base-black">
                  {admin ? "Update" : "Add"} Admin
                </div>
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-5 pt-3 pb-6">
              <FormField
                control={handler.form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={handler.form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={handler.form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={handler.form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={handler.form.control}
                name="roles"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Roles
                    </FormLabel>
                    <MultiSelect
                      options={
                        handler.roles
                          ? handler.roles.map((each) => ({
                              value: each.id,
                              title: each.description,
                              label: each.label,
                            }))
                          : []
                      }
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Select Roles"
                      variant="inverted"
                      // animation={2}
                      maxCount={3}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button isLoading={handler.isSaving} className="w-full">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AdminDialog
