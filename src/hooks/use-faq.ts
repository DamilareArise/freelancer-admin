import { useAddFaqMutation, useUpdateFaqMutation } from "@/services/faq.service"
import { FAQDialogProps } from "@/types/faq.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AnyObject } from "yup"
import { z } from "zod"

const formSchema = z.object({
  question: z.string().nonempty("Question is required"),
  answer: z.string().nonempty("Answer is required"),
})

const defaultForm: z.infer<typeof formSchema> = {
  question: "", answer: "",
}

export const useFAQDialog = ({ open, faq, close }: FAQDialogProps) => {
  const [addFAQ, { isLoading: isCreatingFAQ }] = useAddFaqMutation()
  const [updateFAQ, { isLoading: isUpdatingFAQ }] = useUpdateFaqMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultForm
  })

  useEffect(() => {
    if (!open) {
      form.reset(defaultForm)
    } else if (open && faq) {
      form.setValue("question", faq.question, { shouldValidate: true });
      form.setValue("answer", faq.answer, { shouldValidate: true });
    }
  }, [open, faq, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data, error }: AnyObject = await (faq ? updateFAQ({
      ...values,
      id: faq.id,
    }) : addFAQ({
      ...values,
    }))

    if (data) {
      toast.success("Success", {
        description: "FAQ Added Successfully",
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
    isSaving: isCreatingFAQ || isUpdatingFAQ,
  }
}
