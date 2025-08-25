import { useSuperAdDialog } from "@/hooks/use-superAd"
import { cn } from "@/lib/utils"
import { superAdsFeatures } from "@/services/superAd.service"
import { SuperAdDialogProps } from "@/types/ad.type"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
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
import { CurrencyInput, Input } from "../ui/input"
import MultipleSelector from "../ui/multiple-selector"
import { Skeleton } from "../ui/skeleton"

const SuperAdDialog = (props: SuperAdDialogProps) => {
  const cat = props.superAd
  const handler = useSuperAdDialog(props)

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
                  {cat?.title}
                </div>
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-5 pt-3 pb-6">
              <FormField
                control={handler.form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={handler.form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Price
                    </FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={Number(field.value)}
                        onValueChange={({ floatValue }) => {
                          handler.form.setValue("price", floatValue)
                        }}
                        placeholder="Price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={handler.form.control}
                name="features"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Features
                    </FormLabel>

                    <MultipleSelector
                      value={field.value.map((each) => ({
                        label: each,
                        value: each,
                      }))}
                      defaultOptions={superAdsFeatures}
                      onChange={(options) => {
                        handler.form.setValue(
                          "features",
                          options.map((each) => each.value)
                        )
                      }}
                      placeholder="Select or Add a Feature"
                      creatable
                      emptyIndicator={
                        <p className="text-center text-xs py-2 text-gray-600 dark:text-gray-400">
                          No Features
                        </p>
                      }
                    />

                    {/* <MultiSelect
                      options={field.value.map((each) => ({
                        value: each,
                        label: each,
                      }))}
                      onValueChange={field.onChange}
                      defaultValue={field.value.map((_) => String(_))}
                      placeholder="Select Features"
                      variant="inverted"
                      maxCount={3}
                    /> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={handler.form.control}
                name="locations"
                render={() => (
                  <FormItem className="gap-2 flex flex-col">
                    <FormLabel className="font-medium text-neutral-800">
                      Locations
                    </FormLabel>
                    {handler.isFetchingLocations && (
                      <div className="flex flex-col gap-4">
                        <Skeleton className="h-2.5 w-32" />
                        <Skeleton className="h-2.5 w-40" />
                        <Skeleton className="h-2.5 w-44" />
                        <Skeleton className="h-2.5 w-32" />
                        <Skeleton className="h-2.5 w-28" />
                        <Skeleton className="h-2.5 w-28" />
                        <Skeleton className="h-2.5 w-40" />
                        <Skeleton className="h-2.5 w-44" />
                      </div>
                    )}

                    {handler.locations?.map((item) => (
                      <FormField
                        key={item.id}
                        control={handler.form.control}
                        name="locations"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-center gap-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  className="shadow-none"
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-muted-foreground font-normal">
                                {item.name}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
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

export default SuperAdDialog
