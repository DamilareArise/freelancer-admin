import { useGetAppLocationsQuery } from "@/services/app.service"
import { useUpdateSuperAdMutation } from "@/services/superAd.service"
import { SuperAdDialogProps } from "@/types/ad.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
  price: z.number().min(0),
  title: z.string().nonempty(),
  features: z.array(z.string().min(1)).min(1, "SuperAd must be assigned to at least one role"),
  locations: z.array(z.string().min(1)).min(1, "A location is required"),
})

const defaultForm: z.infer<typeof formSchema> = {
  price: 0, features: [],
  locations: [], title: ""
}

export const useSuperAdDialog = ({ open, superAd, close }: SuperAdDialogProps) => {
  const [updateSuperAd, { isLoading: isUpdatingSuperAd }] = useUpdateSuperAdMutation();
  const { data: locations, isLoading: isFetchingLocations } = useGetAppLocationsQuery("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultForm
  })

  useEffect(() => {
    if (!open) {
      form.reset(defaultForm)
    } else if (open && superAd) {
      form.setValue("title", superAd.title, { shouldValidate: true });
      form.setValue("price", Number(superAd.price), { shouldValidate: true });
      form.setValue("features", superAd.features, { shouldValidate: true });
      form.setValue("locations", superAd.locations?.map(each => each.id), { shouldValidate: true });
    }
  }, [open, superAd, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data, error } = await updateSuperAd({
      ...values,
      id: superAd?.id,
    })

    if (data) {
      toast.success("Success", {
        description: "Super Ad Category Updated Successfully",
      })
      close()
      form.reset()
    } else if (error && "message" in error) {
      toast.error("Error.", {
        position: "bottom-left",
        description: error?.message,
      })
    }
  }

  return {
    onSubmit, form,
    isSaving: isUpdatingSuperAd,
    locations, isFetchingLocations
  }
}
