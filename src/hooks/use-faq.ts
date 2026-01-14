import { useAddFaqMutation, useUpdateFaqMutation } from "@/services/faq.service"
import { FAQDialogProps } from "@/types/faq.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AnyObject } from "yup"
import { z } from "zod"

const formSchema = z.object({
  question_en: z.string().nonempty("Question is required"),
  question_hr: z.string().nonempty("Question is required"),
  answer_en: z.string().nonempty("Answer is required"),
  answer_hr: z.string().nonempty("Answer is required"),
})

const defaultForm: z.infer<typeof formSchema> = {
  question_en: "", question_hr: "",
  answer_en: "", answer_hr: "",
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
      form.setValue("question_en", faq.question_en, { shouldValidate: true });
      form.setValue("question_hr", faq.question_hr, { shouldValidate: true });
      form.setValue("answer_en", faq.answer_en, { shouldValidate: true });
      form.setValue("answer_hr", faq.answer_hr, { shouldValidate: true });
    }
  }, [open, faq, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data, error }: AnyObject = await (faq ? updateFAQ({
      ...values,
      question: values.question_en,
      answer: values.answer_en,
      id: faq.id,
    }) : addFAQ({
      question: values.question_en,
      answer: values.answer_en,
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
