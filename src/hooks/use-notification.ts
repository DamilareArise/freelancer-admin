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
  timing: z.string().nonempty(),
  date: z.date().optional(),
  time: z.string().optional(),
  day: z.string().optional(),
})

export type NotificationForm = z.infer<typeof formSchema>;

const defaultForm: NotificationForm = {
  header: "", category: "", body: "", types: [],
  recipients: [], timing: ""
}

export const useNotificationDialog = ({ open, notification, close }: NotificationDialogProps) => {
  const [addNotification, { isLoading: isCreatingNotification }] = useAddNotificationMutation()
  const [updateNotification, { isLoading: isUpdatingNotification }] = useUpdateNotificationMutation();
  const { data: roles, isLoading: isFetchingRoles } = useGetRolesQuery("");

  const form = useForm<NotificationForm>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultForm
  })

  useEffect(() => {
    if (!open) {
      form.reset(defaultForm)
    } else if (open && notification) {
      form.setValue("header", notification.header, { shouldValidate: true });
      form.setValue("category", notification.category, { shouldValidate: true });
      form.setValue("body", notification.body, { shouldValidate: true });
      form.setValue("types", notification.types, { shouldValidate: true });
      form.setValue("recipients", notification.recipents, { shouldValidate: true });
    }
  }, [open, notification, form])

  const onSubmit = async (values: NotificationForm) => {
    const { data, error }: AnyObject = await (notification ? updateNotification({
      ...values,
      id: notification.id,
    }) : addNotification({
      ...values,
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
    onSubmit, form,
    isSaving: isCreatingNotification || isUpdatingNotification,
    roles, isFetchingRoles
  }
}
