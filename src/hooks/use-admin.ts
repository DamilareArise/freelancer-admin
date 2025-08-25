import { useAddAdminMutation, useUpdateAdminMutation } from "@/services/admin.service"
import { useGetRolesQuery } from "@/services/app.service"
import { AdminDialogProps } from "@/types/admin.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AnyObject } from "yup"
import { z } from "zod"

const formSchema = z.object({
  first_name: z.string().nonempty("First Name is required"),
  last_name: z.string().nonempty("Last Name is required"),
  email: z.string().nonempty("Email is required").email(),
  phone: z.string().nonempty("Phone Number is required"),
  roles: z.array(z.string().nonempty()).min(1, "Admin must be assigned to at least one role"),
})

const defaultForm: z.infer<typeof formSchema> = {
  first_name: "", last_name: "", email: "",
  roles: [], phone: ""
}

export const useAdminDialog = ({ open, admin, close }: AdminDialogProps) => {
  const [addAdmin, { isLoading: isCreatingAdmin }] = useAddAdminMutation()
  const [updateAdmin, { isLoading: isUpdatingAdmin }] = useUpdateAdminMutation();
  const { data: roles, isLoading: isFetchingRoles } = useGetRolesQuery("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultForm
  })

  useEffect(() => {
    if (!open) {
      form.reset(defaultForm)
    } else if (open && admin) {
      form.setValue("first_name", admin.first_name, { shouldValidate: true });
      form.setValue("last_name", admin.last_name, { shouldValidate: true });
      form.setValue("email", admin.email, { shouldValidate: true });
      form.setValue("phone", admin.phone, { shouldValidate: true });
      form.setValue("roles", admin.user_roles.map(each => each.id), { shouldValidate: true });
    }
  }, [open, admin, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data, error }: AnyObject = await (admin ? updateAdmin({
      ...values,
      id: admin.id,
    }) : addAdmin({
      ...values,
    }))

    if (data) {
      toast.success("Success", {
        description: "Admin Added Successfully",
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
    isSaving: isCreatingAdmin || isUpdatingAdmin,
    roles, isFetchingRoles
  }
}
