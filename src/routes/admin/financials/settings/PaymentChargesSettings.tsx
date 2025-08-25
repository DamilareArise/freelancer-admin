import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit2 } from "lucide-react"
import { currency } from "@/lib/helpers"
import {
  PaymentCharge,
  useGetChargesQuery,
  useUpdateChargeMutation,
} from "@/services/payment.service"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  charge_percent: z.coerce.number().min(0, "Must be positive"),
  charge_fixed: z.coerce.number().min(0, "Must be positive"),
})

const PaymentChargesSettings = () => {
  const { data, isLoading } = useGetChargesQuery(null)
  const [editing, setEditing] = useState<PaymentCharge | null>(null)
  const [charges, setCharges] = useState<PaymentCharge[]>([])

  useEffect(() => {
    if (data) setCharges(data)
  }, [data])

  const handleSave = (data: z.infer<typeof formSchema>) => {
    setCharges((prev) =>
      prev.map((c) => (c.for_key === editing?.for_key ? { ...c, ...data } : c))
    )
    setEditing(null)
  }

  return (
    <div className="py-6">
      <div className="flex flex-col sm:grid grid-cols-auto [--col-w:20rem] gap-6">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border p-4 flex flex-col items-start bg-white gap-4"
            >
              <Skeleton className="h-3 rounded w-32" />
              <Skeleton className="h-7 rounded w-44" />
              <Skeleton className="h-9 rounded w-20" />
            </div>
          ))}

        {!isLoading &&
          charges.map((charge) => (
            <div
              key={charge.for_key}
              className="rounded-lg border p-4 flex flex-col items-start bg-white"
            >
              <div className="font-medium text-sm mb-2">{charge.for_label}</div>
              <div className="text-2xl font-bold mb-4">
                {charge.charge_percent}% + {currency.symbol}
                {charge.charge_fixed}
              </div>
              <Button
                variant="outline"
                onClick={() => setEditing(charge)}
                className="mt-auto"
              >
                <Edit2 />
                Edit
              </Button>
            </div>
          ))}
      </div>
      <EditChargeDialog
        open={!!editing}
        charge={editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />
    </div>
  )
}

export default PaymentChargesSettings

function EditChargeDialog({
  open,
  charge,
  onClose,
  onSave,
}: {
  open: boolean
  charge: PaymentCharge | null
  onClose: () => void
  onSave: (data: z.infer<typeof formSchema>) => void
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      charge_percent: charge?.charge_percent ?? 0,
      charge_fixed: charge?.charge_fixed ?? 0,
    },
    values: charge
      ? {
          charge_fixed: charge.charge_fixed,
          charge_percent: charge.charge_percent,
        }
      : undefined,
  })
  const [saveCharge, { isLoading }] = useUpdateChargeMutation()

  if (!charge) return null

  const handleSaveCharge = async (values: z.infer<typeof formSchema>) => {
    const { error } = await saveCharge({
      id: charge.id,
      ...values,
    })

    if (error) {
      toast.error("Error", {
        description:
          "message" in error ? error?.message : "Couldn't update charge",
      })
    } else {
      toast.success("Updated!", { description: "Charge updated successfully" })
      onSave(values)
    }
  }

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="max-w-[85vw] sm:max-w-md h-fit">
        <DialogHeader>
          <DialogTitle className="text-start mb-2 text-primary-1000">
            Edit {charge.for_label} Charge
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSaveCharge)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="charge_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentage (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="charge_fixed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fixed Amount ({currency.symbol})</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                disabled={isLoading}
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
