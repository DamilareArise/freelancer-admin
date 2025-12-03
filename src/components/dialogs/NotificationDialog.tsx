import {
  NotificationForm,
  useNotificationDialog,
} from "@/hooks/use-notification"
import { cn } from "@/lib/utils"
import { NotificationDialogProps } from "@/types/notification.type"
import { Button } from "../ui/button"
import * as Sel from "../ui/select"
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
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { ControllerRenderProps } from "react-hook-form"
import DateInput from "../widgets/DateInput"

const NotificationDialog = (props: NotificationDialogProps) => {
  const notification = props.notification
  const handler = useNotificationDialog(props)
  const { trigger_type, recurring_start } = handler.watch

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
                  {notification ? "Update" : "Create"} Notification
                </div>
                <Button
                  // disabled={!handler.form.formState.isValid}
                  isLoading={handler.isSaving}
                  className="rounded-full"
                >
                  Save
                </Button>
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="space-y-6 px-5 pt-3 pb-6">
              {JSON.stringify(handler.form.formState.errors)}
              <FormField
                control={handler.form.control}
                name="types"
                render={({ field }) => <NotificationTypeField field={field} />}
              />
              <FormField
                control={handler.form.control}
                name="recipients"
                render={({ field }) => <RecipientField field={field} />}
              />
              <FormField
                control={handler.form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Category
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={handler.form.control}
                name="header"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Header
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Header" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={handler.form.control}
                name="body"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Body
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-32"
                        placeholder="Body"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4">
                <FormField
                  control={handler.form.control}
                  name="trigger_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>Timing</FormLabel>
                      <Sel.Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <Sel.SelectTrigger>
                            <Sel.SelectValue placeholder="Select Timing" />
                          </Sel.SelectTrigger>
                        </FormControl>
                        <Sel.SelectContent>
                          {[
                            { label: "Send Immediately", value: "immediately" },
                            { label: "Recurring", value: "recurring" },
                            { label: "Custom Date & Time", value: "custom" },
                          ].map(({ value, label }) => (
                            <Sel.SelectItem value={value} key={value}>
                              {label}
                            </Sel.SelectItem>
                          ))}
                        </Sel.SelectContent>
                      </Sel.Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {trigger_type == "recurring" && (
                  <FormField
                    control={handler.form.control}
                    name="recurring_frequency"
                    render={({ field }) => (
                      <FormItem className="flex flex-col flex-1">
                        <FormLabel>Frequency</FormLabel>
                        <Sel.Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <Sel.SelectTrigger>
                              <Sel.SelectValue placeholder="Select Frequency" />
                            </Sel.SelectTrigger>
                          </FormControl>
                          <Sel.SelectContent>
                            {[
                              { label: "Daily", value: "daily" },
                              { label: "Weekly", value: "weekly" },
                              { label: "Monthly", value: "monthly" },
                            ].map(({ value, label }) => (
                              <Sel.SelectItem value={value} key={value}>
                                {label}
                              </Sel.SelectItem>
                            ))}
                          </Sel.SelectContent>
                        </Sel.Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {trigger_type != "immediately" && (
                <div className="flex flex-wrap items-center gap-4">
                  {trigger_type == "custom" && (
                    <FormField
                      control={handler.form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex-1 flex flex-col">
                          <FormLabel className="font-medium text-neutral-800">
                            Date
                          </FormLabel>
                          <FormControl>
                            <DateInput
                              buttonClass="h-11"
                              min={new Date(new Date().toDateString())}
                              date={field.value}
                              setDate={(date) => {
                                field.onChange(date)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {trigger_type != "custom" && (
                    <FormField
                      control={handler.form.control}
                      name="recurring_start"
                      render={({ field }) => (
                        <FormItem className="flex-1 flex flex-col">
                          <FormLabel className="font-medium text-neutral-800">
                            Start Date
                          </FormLabel>
                          <FormControl>
                            <DateInput
                              buttonClass="h-11"
                              min={new Date(new Date().toDateString())}
                              date={field.value}
                              setDate={(date) => {
                                field.onChange(date)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {trigger_type == "recurring" && (
                    <FormField
                      control={handler.form.control}
                      name="recurring_end"
                      render={({ field }) => (
                        <FormItem className="flex-1 flex flex-col">
                          <FormLabel className="font-medium text-neutral-800">
                            End Date
                          </FormLabel>
                          <FormControl>
                            <DateInput
                              buttonClass="h-11"
                              min={
                                new Date(
                                  recurring_start?.toDateString() ||
                                    new Date().toDateString()
                                )
                              }
                              date={field.value}
                              setDate={(date) => {
                                field.onChange(date)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={handler.form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem className="flex-1 flex flex-col">
                        <FormLabel className="font-medium text-neutral-800">
                          Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="time"
                            className="accent-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NotificationDialog

const NotificationTypeField = ({
  field,
}: {
  field: ControllerRenderProps<NotificationForm, "types">
}) => {
  return (
    <FormItem className=" flex flex-col gap-4">
      <FormLabel className="font-medium text-neutral-800">
        Notification Type
      </FormLabel>
      <FormControl>
        <div className="flex flex-row flex-wrap gap-4 items-center whitespace-nowrap">
          {[
            { title: "Email", value: "email" },
            { title: "In App", value: "in_app" },
            { title: "Push Notification", value: "push" },
            { title: "In-App Banner", value: "in_app_banner" },
          ].map(({ title, value }) => (
            <Label
              key={value}
              htmlFor={value}
              className="text-gray-700 text-[.8rem] flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={field.value.includes(value)}
                onCheckedChange={(checked) => {
                  const newTypes = [...field.value]
                  if (checked) {
                    newTypes.push(value)
                  } else {
                    const index = newTypes.indexOf(value)
                    if (index > -1) {
                      newTypes.splice(index, 1)
                    }
                  }
                  field.onChange(newTypes)
                }}
                id={value}
                className="scale-90"
              />
              {title}
            </Label>
          ))}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

const RecipientField = ({
  field,
}: {
  field: ControllerRenderProps<NotificationForm, "recipients">
}) => {
  return (
    <FormItem className=" flex flex-col gap-4">
      <FormLabel className="font-medium text-neutral-800">Recipients</FormLabel>
      <FormControl>
        <div className="flex flex-row flex-wrap gap-4 items-center whitespace-nowrap">
          {[
            { title: "User", value: "user" },
            { title: "Service Providers", value: "service_provider" },
          ].map(({ title, value }) => (
            <Label
              key={value}
              htmlFor={value}
              className="text-gray-700 text-[.8rem] flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={field.value.includes(value)}
                onCheckedChange={(checked) => {
                  const newTypes = [...field.value]
                  if (checked) {
                    newTypes.push(value)
                  } else {
                    const index = newTypes.indexOf(value)
                    if (index > -1) {
                      newTypes.splice(index, 1)
                    }
                  }
                  field.onChange(newTypes)
                }}
                id={value}
                className="scale-90"
              />
              {title}
            </Label>
          ))}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}
