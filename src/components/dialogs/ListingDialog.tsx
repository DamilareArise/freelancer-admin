import { ListFormType, useListingDialog } from "@/hooks/use-listing"
import { cn } from "@/lib/utils"
import { rejectionReasons } from "@/services/listing.service"
import { Listing } from "@/types/listing.type"
import {
  AlertTriangle,
  ChevronLeft,
  ClipboardXIcon,
  Minus,
  Plus,
} from "lucide-react"
import { ControllerRenderProps } from "react-hook-form"
import ListingDetails from "../ListingDetails"
import { Alert, AlertDescription } from "../ui/alert"
import * as AlertD from "../ui/alert-dialog"
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import * as Sel from "../ui/select"
import { Textarea } from "../ui/textarea"
import { currency, pluralize } from "@/lib/helpers"
const ListingDialog = ({
  open,
  listing,
  editing,
  setListing,
  onOpenChange,
}: {
  open: boolean
  editing?: boolean
  onOpenChange: (open: boolean) => void
  listing: Listing | null
  setListing: (listing: Listing) => void
}) => {
  const handler = useListingDialog({
    open,
    setListing,
    close: () => {
      onOpenChange(false)
    },
    listing,
  })

  return (
    <>
      {listing && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent
            id="listingdialog"
            className={cn("sm:max-w-lg p-5", handler.editing && "rounded-none")}
            _style={2}
          >
            {handler.editing || editing ? (
              <ModifyListing
                noBack={editing}
                listing={listing}
                close={() => {
                  handler.setEditing(false)
                  document
                    .getElementById("listingdialog")
                    ?.scrollTo({ top: 1000, behavior: "smooth" })
                }}
                handler={handler}
              />
            ) : (
              <>
                <ListingDetails listing={listing} />
                {listing.status == "pending" && (
                  <>
                    <Button
                      onClick={() => {
                        handler.setEditing(true)
                        document
                          .getElementById("listingdialog")
                          ?.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                      variant={"outline"}
                      className="border-primary text-primary min-h-10"
                    >
                      Modify listing
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        className="font-normal"
                        size={"lg"}
                        onClick={() => handler.setConfirmApprovalIsOpen(true)}
                      >
                        Approve Listing
                      </Button>
                      <Button
                        onClick={() => handler.setConfirmRejectionIsOpen(true)}
                        className="font-normal"
                        variant={"destructive"}
                        size={"lg"}
                      >
                        Reject Listing
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </DialogContent>

          <ConfirmApprovalAlert handler={handler} />
          <ConfirmBulkRejectionAlert handler={handler} />
          <DialogDescription />
        </Dialog>
      )}
    </>
  )
}

export default ListingDialog

const ModifyListing = ({
  handler,
  close,
  listing,
  noBack = false,
}: {
  noBack?: boolean
  listing: Listing
  close: () => void
  handler: ReturnType<typeof useListingDialog>
}) => {
  return (
    // <DialogContent className="sm:max-w-lg p-5 rounded-none" _style={2}>
    <Form {...handler.form}>
      <form
        onSubmit={handler.form.handleSubmit(handler.onSubmit)}
        className="flex overflow-auto flex-col gap-7"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {!noBack && (
              <button
                type="button"
                onClick={close}
                className="text-neutral-800"
              >
                <ChevronLeft />
              </button>
            )}
            <p className="text-primary-1000 text-2xl font-semibold">
              Modify Listing
            </p>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 rounded-lg border border-[#E3E3E3] p-3">
          <div>
            <h3 className="mb-3 text-xl font-semibold">Property Description</h3>
            <p className="text-sm text-neutral-700">
              Use this area to highlight features not addressed in the questions
              or shown in the photos, such as parquet flooring, heating type,
              garden, etc.
            </p>
          </div>

          <Alert variant="warning">
            <AlertTriangle className="text-neutral-800" />
            <AlertDescription>
              Lisitings with racist, homophobic and/or discriminatory comments
              will be removed
            </AlertDescription>
          </Alert>

          <FormField
            control={handler.form.control}
            name="description_en"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Description (English)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    className="resize-none min-h-28"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={handler.form.control}
            name="description_hr"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Description (Croatia)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    className="resize-none min-h-28"
                    {...field}
                  />
                </FormControl>
                <ul className="text-neutral-600 text-sm list-disc pl-5">
                  <li>This will be read more often</li>
                  <li>You can add other languages</li>
                  <li>
                    Using lowercase letters makes reading easier, so please
                    avoid all caps.
                  </li>
                </ul>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <div className="flex flex-col gap-6 rounded-lg border border-[#E3E3E3] p-3">
          <div>
            <h3 className="text-xl font-semibold">Renting Type</h3>
          </div>
          <div className="border rounded-lg p-4 flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-3 text-neutral-300">
              <Checkbox /> Residential (main residence)
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <Checkbox /> Short-term, (for limited periods e.g, terms,
              temporary)
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <Checkbox /> Holiday, (for tourist satys)
            </div>
          </div>
        </div> */}

        <div className="flex flex-col gap-6 rounded-lg border border-[#E3E3E3] p-3">
          <div>
            <h3 className="text-xl font-semibold">
              Features of the {handler.category?.name}
            </h3>
          </div>
          {handler.category?.category_features.map(
            ({ label, id, unit, type }) => (
              <FormField
                key={id + type}
                disabled
                control={handler.form.control}
                name={String(id)}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="capitalize">{label}</FormLabel>
                    <FormControl>
                      {
                        {
                          checkbox: (
                            <CheckboxField
                              field={field}
                              options={
                                handler?.category?.category_features.find(
                                  (each) => each.id == id
                                )?.options ?? []
                              }
                            />
                          ),
                          radio: (
                            <RadioGroup
                              onValueChange={(value) => {
                                handler.form.setValue(String(id), value)
                              }}
                              disabled={field.disabled}
                              value={field.value as string}
                              className={cn(
                                "border p-3.5 flex flex-col gap-3 rounded-lg",
                                field.disabled && "opacity-50"
                              )}
                            >
                              {handler?.category?.category_features
                                .find((each) => each.id == id)
                                ?.options?.map((option, index) => (
                                  <div
                                    key={index + "radiooption" + label}
                                    className="flex items-center gap-3 text-sm text-neutral-800"
                                  >
                                    <RadioGroupItem value={option} /> {option}
                                  </div>
                                ))}
                            </RadioGroup>
                          ),
                          number: (
                            <div
                              className={cn(
                                "flex border rounded-md h-12 w-36",
                                field.disabled && "opacity-50"
                              )}
                            >
                              <button
                                disabled={
                                  (Number(field.value) - 1 >= 0
                                    ? true
                                    : false) || field.disabled
                                }
                                type="button"
                                onClick={() => {
                                  handler.form.setValue(
                                    String(id),
                                    Number(field.value ?? 0) - 1
                                  )
                                }}
                                className="bg-gray-50 flex-1 h-full rounded-l-md w-full flex items-center justify-center disabled:opacity-50"
                              >
                                <Minus className="text-neutral-800 size-5" />
                              </button>
                              <input
                                type="text"
                                {...field}
                                className="w-full flex-1 text-center border-x text-lg"
                              />
                              <button
                                type="button"
                                disabled={field.disabled}
                                onClick={() => {
                                  handler.form.setValue(
                                    String(id),
                                    Number(field.value ?? 0) + 1
                                  )
                                }}
                                className={cn(
                                  "bg-gray-50 flex-1 h-full rounded-r-md w-full flex items-center justify-center",
                                  field.disabled && "pointer-events-none"
                                )}
                              >
                                <Plus className="text-neutral-800 size-5" />
                              </button>
                            </div>
                          ),
                          select: (
                            <SelectField
                              field={field}
                              options={
                                handler?.category?.category_features.find(
                                  (each) => each.id == id
                                )?.options ?? []
                              }
                            />
                          ),
                          text: (
                            <div className="relative">
                              {unit && (
                                <span
                                  className={cn(
                                    "absolute h-full text-sm flex items-center right-4 pointer-events-none",
                                    field.disabled && "opacity-50"
                                  )}
                                >
                                  {unit}
                                </span>
                              )}
                              <Input
                                autoComplete="off"
                                className={cn(unit && "pr-14")}
                                placeholder={label ?? ""}
                                {...field}
                              />
                            </div>
                          ),
                          textarea: (
                            <Textarea
                              placeholder={label ?? ""}
                              className="resize-none min-h-28"
                              {...field}
                            />
                          ),
                        }[type]
                      }
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          )}
        </div>

        {/* <h3 className="text-primary text-2xl font-semibold">Price</h3> */}

        <div className="flex flex-col gap-6 rounded-lg border border-[#E3E3E3] p-3">
          <div>
            <h3 className="text-xl mb-1 font-semibold">Price</h3>
            <p className="text-sm text-neutral-700">
              In this section, you'll determine the appropriate price for your
              property.
            </p>
          </div>

          <FormField
            control={handler.form.control}
            name="price"
            disabled
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span
                      className={cn(
                        "absolute h-full text-sm flex items-center right-4 pointer-events-none",
                        field.disabled && "opacity-50"
                      )}
                    >
                      {currency.word == "naira"
                        ? currency.word
                        : pluralize(field.value, currency.word)}
                      /{listing.price_unit}
                    </span>

                    <CurrencyInput
                      disabled={field.disabled}
                      value={field.value}
                      onValueChange={({ floatValue }) =>
                        handler.form.setValue("price", floatValue)
                      }
                      placeholder="Price"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button isLoading={handler.isSaving} type="submit">
          Apply Changes
        </Button>
      </form>
    </Form>
    // </DialogContent>
  )
}

const SelectField = ({
  options,
  field,
}: {
  options: string[]
  field: ControllerRenderProps<ListFormType, string>
}) => {
  return (
    <Sel.Select
      disabled={field.disabled}
      onValueChange={field.onChange}
      defaultValue={field.value as string}
    >
      <Sel.SelectTrigger>
        <Sel.SelectValue placeholder="Select" />
      </Sel.SelectTrigger>
      <Sel.SelectContent>
        {options.map((option, index) => (
          <Sel.SelectItem value={option} key={index + "selectoption" + option}>
            {option}
          </Sel.SelectItem>
        ))}
      </Sel.SelectContent>
    </Sel.Select>
  )
}

const CheckboxField = ({
  options,
  field,
}: {
  options: string[]
  field: ControllerRenderProps<ListFormType, string>
}) => {
  return (
    <div className="border p-3.5 flex flex-col gap-3 rounded-lg">
      {options.map((option, index) => (
        <div
          key={index + "checkboxoption" + option}
          className={cn(
            "flex gap-3 text-sm text-neutral-800",
            field.disabled && "opacity-50"
          )}
        >
          <Checkbox
            checked={(field.value as string[])?.includes(option)}
            disabled={field.disabled}
            onCheckedChange={(checked) => {
              // if (field.disabled) return field.value
              return checked
                ? field.onChange([
                    ...(field.value ? (field.value as string[]) : []),
                    option,
                  ])
                : field.onChange(
                    (field.value
                      ? (field.value as unknown as string[])
                      : []
                    ).filter((value) => value !== option)
                  )
            }}
          />
          {option}
        </div>
      ))}
    </div>
  )
}

const ConfirmApprovalAlert = ({
  handler,
}: {
  handler: ReturnType<typeof useListingDialog>
}) => {
  return (
    <AlertD.AlertDialog
      open={handler.confirmApprovalIsOpen}
      onOpenChange={handler.setConfirmApprovalIsOpen}
    >
      <AlertD.AlertDialogContent>
        <AlertD.AlertDialogHeader className="flex flex-col items-center gap-[16px]">
          <AlertD.AlertDialogTitle
            title={"Approve Listing?"}
            icon={
              <span className="text-primary size-5 min-w-5 flex items-center justify-center">
                ?
              </span>
            }
          />
        </AlertD.AlertDialogHeader>
        <AlertD.AlertDialogDescription>
          The service provider listing will go live on{" "}
          <span className="font-medium">Freelancer</span>. Please ensure the
          listing details is in line with our guidelines and meet our listing
          criteria
        </AlertD.AlertDialogDescription>
        <AlertD.AlertDialogFooter>
          <Button
            onClick={handler.approveListing}
            isLoading={handler.isUpdatingStatus}
            className="w-full h-11 font-normal"
          >
            Approve Listing
          </Button>
        </AlertD.AlertDialogFooter>
      </AlertD.AlertDialogContent>
    </AlertD.AlertDialog>
  )
}

const ConfirmBulkRejectionAlert = ({
  handler: {
    setConfirmRejectionIsOpen,
    confirmRejectionIsOpen,
    rejectionForm: form,
    rejectListing,
    isUpdatingStatus,
  },
}: {
  handler: ReturnType<typeof useListingDialog>
}) => {
  return (
    <AlertD.AlertDialog
      open={confirmRejectionIsOpen}
      onOpenChange={setConfirmRejectionIsOpen}
    >
      <AlertD.AlertDialogContent>
        <AlertD.AlertDialogHeader className="flex flex-col items-center gap-[16px]">
          <AlertD.AlertDialogTitle
            variant="destructive"
            title="Confirm Rejection"
            icon={
              <ClipboardXIcon className="text-destructive stroke-[1.5] size-5" />
            }
          />
        </AlertD.AlertDialogHeader>
        <AlertD.AlertDialogDescription className="text-start max-w-full px-0">
          Why do you want to reject this listing?, Give a reason(s) below to
          help the user when resubmitting
        </AlertD.AlertDialogDescription>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(rejectListing)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <FormItem>
                  {rejectionReasons.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-center space-x-2 space-y-1"
                          >
                            <FormControl>
                              <Checkbox
                                className="shadow-none"
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        item,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-muted-foreground">
                              {item}
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

            <FormField
              control={form.control}
              name="other"
              disabled={!form.getValues("items")?.includes("others")}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Reason"
                      className="resize-none min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertD.AlertDialogFooter>
              <div className="flex flex-col w-full gap-3 mt-2">
                <Button
                  isLoading={isUpdatingStatus}
                  variant={"destructive"}
                  className="h-11 text-white font-normal"
                >
                  Confirm Rejection
                </Button>
              </div>
            </AlertD.AlertDialogFooter>
          </form>
        </Form>
      </AlertD.AlertDialogContent>
    </AlertD.AlertDialog>
  )
}
