import { useFAQDialog } from "@/hooks/use-faq"
import { cn } from "@/lib/utils"
import { FAQDialogProps } from "@/types/faq.type"
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
import { Textarea } from "../ui/textarea"

const FAQDialog = (props: FAQDialogProps) => {
  const faq = props.faq
  const handler = useFAQDialog(props)

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
                  {faq ? "Update" : "Add"} FAQ
                </div>
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-5 pt-3 pb-6">
              <FormField
                control={handler.form.control}
                name="question_en"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Question (English)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Question" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={handler.form.control}
                name="question_hr"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Question (Croatian)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Pitanje" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <hr className="my-6" />
              <FormField
                control={handler.form.control}
                name="answer_en"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Answer (English)
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Answer here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={handler.form.control}
                name="answer_hr"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Answer (Croatian)
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Odgovorite ovdje..." {...field} />
                    </FormControl>
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

export default FAQDialog
