import { useAddNotificationMutation, useUpdateNotificationMutation } from "@/services/notification.service"
import { useGetRolesQuery } from "@/services/app.service"
import { NotificationDialogProps } from "@/types/notification.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AnyObject } from "yup"
import { z } from "zod"

const formSchema = z.object({
  header: z.string().nonempty("First Name is required"),
  category: z.string().nonempty("Last Name is required"),
  body: z.string().nonempty("Body is required"),
  types: z.array(z.string()).min(1, "Select at least one notification type"),
  recipients: z.array(z.string()).min(1, "Select at least one Recipient"),
  // trigger_type can only be immediate, recurring, custom
  trigger_type: z.enum(["immediately", "recurring", "custom"]),
  recurring_frequency: z.enum(["daily", "weekly", "monthly"]).optional(),
  date: z.date().optional(),
  recurring_start: z.date().optional(),
  recurring_end: z.date().optional(),
  recurring_interval: z.number().optional(),
  time: z.string().optional(),
  day: z.string().optional(),
})

export type NotificationForm = z.infer<typeof formSchema>;

const defaultForm: NotificationForm = {
  header: "", category: "",
  body: "", types: [],
  recipients: [], trigger_type: "recurring",
  recurring_frequency: "monthly"
}

export const useNotificationDialog = ({ open, notification, close }: NotificationDialogProps) => {
  const [addNotification, { isLoading: isCreatingNotification }] = useAddNotificationMutation()
  const [updateNotification, { isLoading: isUpdatingNotification }] = useUpdateNotificationMutation();
  const { data: roles, isLoading: isFetchingRoles } = useGetRolesQuery("");

  const form = useForm<NotificationForm>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultForm
  })

  const watch = form.watch();

  useEffect(() => {
    if (!open) {
      form.reset(defaultForm)
    } else if (open && notification) {
      form.setValue("header", notification.header, { shouldValidate: true });
      form.setValue("category", notification.category, { shouldValidate: true });
      form.setValue("body", notification.body, { shouldValidate: true });
      form.setValue("types", notification.types, { shouldValidate: true });
      form.setValue("recipients", notification.recipients, { shouldValidate: true });
      form.setValue("trigger_type", notification.trigger_type, { shouldValidate: true });
      form.setValue("recurring_start", notification.recurring_start ? new Date(notification.recurring_start) : undefined, { shouldValidate: true });
      form.setValue("recurring_frequency", notification.recurring_frequency || undefined, { shouldValidate: true });
      form.setValue("recurring_start", notification.recurring_start ? new Date(notification.recurring_start) : undefined, { shouldValidate: true });
      form.setValue("recurring_end", notification.recurring_end ? new Date(notification.recurring_end) : undefined, { shouldValidate: true });
      form.setValue("recurring_interval", notification.recurring_interval || undefined, { shouldValidate: true });
      form.setValue("date", notification.date ? new Date(notification.date) : undefined, { shouldValidate: true });
      form.setValue(
        "time",
        notification.time ? new Date(notification.time).toTimeString() : notification.recurring_start
          ? new Date(notification.recurring_start).toLocaleTimeString() : undefined,
        { shouldValidate: true }
      );
    }
  }, [open, notification, form])

  // useEffect(() => {
  //   if (watch.recurring_frequency === 'monthly') {
  //     form.setValue('day', '1', { shouldValidate: true });
  //     form.setValue('time', undefined, { shouldValidate: true });
  //   } else if (watch.recurring_frequency === 'weekly') {
  //     form.setValue('day', 'Monday', { shouldValidate: true });
  //     form.setValue('time', undefined, { shouldValidate: true });
  //   } else if (watch.recurring_frequency === 'daily') {
  //     form.setValue('day', undefined, { shouldValidate: true });
  //     form.setValue('time', '09:00', { shouldValidate: true });
  //   }
  // }, [form, watch.recurring_frequency])

  const onSubmit = async (values: NotificationForm) => {
    if (watch.trigger_type == 'immediately') {
      values.recurring_frequency = undefined;
      values.time = undefined;
      values.recurring_start = undefined;
      values.recurring_end = undefined;
      values.recurring_interval = undefined;
      values.date = undefined;
    }

    if (watch.trigger_type == 'custom') {
      values.recurring_frequency = 'daily';
      values.recurring_end = undefined;
      values.recurring_start = undefined
      values.recurring_interval = 0;
    }

    if (watch.trigger_type == 'recurring') {
      // add values.time to values.reccuring_start and values.recurring_end date;
      values.recurring_start = values.recurring_start ? new Date(
        new Date(values.recurring_start).setHours(
          parseInt(values.time?.split(":")[0] || "0"),
          parseInt(values.time?.split(":")[1] || "0"),
          0,
          0
        )
      ) : undefined;
      values.recurring_end = values.recurring_end ? new Date(
        new Date(values.recurring_end).setHours(
          parseInt(values.time?.split(":")[0] || "0"),
          parseInt(values.time?.split(":")[1] || "0"),
          0,
          0
        )
      ) : undefined;
      values.date = undefined;
      values.time = undefined;
      // values.recurring_interval = {
      //   daily: 86400,
      //   weekly: 604800,
      //   monthly: 2592000
      // }[values.recurring_frequency];
    }


    const { data, error }: AnyObject = await (notification ? updateNotification({
      ...values,
      id: notification.id,
    }) : addNotification({
      ...values,
      date: values?.date ? new Date(values.date).toISOString().split('T')[0] : undefined,
    }))

    if (data) {
      toast.success("Success", {
        description: "Notification Added Successfully",
      })
      close()
      form.reset()
    } else {
      toast.error("Error.", {
        position: "bottom-left",
        description: error?.message,
      })
    }
  }

  return {
    onSubmit, form, watch,
    isSaving: isCreatingNotification || isUpdatingNotification,
    roles, isFetchingRoles
  }
}
