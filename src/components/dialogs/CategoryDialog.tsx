import { useCategoryDialog } from "@/hooks/use-category"
import { categoryIcons, fieldTypes } from "@/lib/constants"
import { keyValue } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import {
  CategoryDialogProps,
  CreateCategoryFeatures,
} from "@/types/category.type"
import { DndContext } from "@dnd-kit/core"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { RadioGroup } from "@radix-ui/react-radio-group"
import { Grip, X } from "lucide-react"
import { useEffect } from "react"
import MemoPlusCircleFilled from "../icons/PlusCircleFilled"
import * as Acc from "../ui/accordion"
import { Button } from "../ui/button"
import {
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
import { RadioGroupItem } from "../ui/radio-group"
import * as Sel from "../ui/select"
import { Separator } from "../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

const CategoryDialog = (props: CategoryDialogProps) => {
  const category = props.category
  const handler = useCategoryDialog(props)

  return (
    <DialogContent
      // onOpenAutoFocus={(e) => e.}
      className="sm:max-w-lg p-0"
      _style={2}
    >
      <Form {...handler.form}>
        <form onSubmit={handler.form.handleSubmit(handler.onSubmit)}>
          <DialogHeader className={cn("top-0 bg-white z-10", "sticky")}>
            <DialogTitle className="bg-primary/10 py-5 px-6 border-primary border-b justify-between flex items-center gap-5">
              <div className="text-lg font-bold text-base-black">
                {category && !props.copying ? "Update" : "Add"} Category
              </div>
              <Button
                disabled={!handler.form.formState.isValid}
                isLoading={handler.isSaving}
                className="rounded-full"
              >
                Update
              </Button>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-5 pt-3">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={handler.form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={handler.form.control}
                name="name_hr"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Name (In Croatia)</FormLabel>
                    <FormControl>
                      <Input placeholder="Category Name (Croatia)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <FormField
              control={handler.form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mb-1">Category Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex flex-row gap-6"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormItem className="flex-row items-center gap-2">
                        <FormControl>
                          <RadioGroupItem value="regular" />
                        </FormControl>
                        <FormLabel className="font-normal text-neutral-700 text-sm">
                          Regular
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex-row items-center gap-2">
                        <FormControl>
                          <RadioGroupItem value="earnings" />
                        </FormControl>
                        <FormLabel className="font-normal text-neutral-700 text-sm">
                          Earnings
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="flex gap-4">
              {/* {handler.form.watch("type") === "earnings" && (
                <FormField
                  control={handler.form.control}
                  name="charging_unit"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>Charging Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. hour, day, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )} */}

              <FormField
                control={handler.form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Choose Icon</FormLabel>
                    <Sel.Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <Sel.SelectTrigger>
                          <Sel.SelectValue placeholder="Select Icon" />
                        </Sel.SelectTrigger>
                      </FormControl>
                      <Sel.SelectContent>
                        {keyValue(categoryIcons).map(
                          ({ value: each, key }, iconIndex) => (
                            <Sel.SelectItem
                              className="focus:bg-slate-100"
                              value={key}
                              key={iconIndex + "icon"}
                            >
                              <img
                                className="size-8"
                                src={each.url}
                                alt="Icon"
                              />
                            </Sel.SelectItem>
                          )
                        )}
                      </Sel.SelectContent>
                    </Sel.Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Tabs defaultValue="pricing">
              <TabsList className="mx-auto">
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="subcategories">Sub Categories</TabsTrigger>
              </TabsList>

              <TabsContent
                value="pricing"
                className="flex flex-col gap-4 py-2 -mx-2"
              >
                <div className="pb-4">
                  <Acc.Accordion
                    value={"pricing"}
                    type="single"
                    className="flex flex-col gap-4"
                  >
                    <Acc.AccordionItem
                      value="pricing"
                      className="rounded-lg overflow-hidden border-[#F2F2F2] border "
                    >
                      <div className="text-neutral-700 text-sm font-medium bg-[#F2F2F2] p-4 items-center w-full flex justify-between">
                        Pricing
                        <Button
                          className="rounded-full"
                          size={"sm"}
                          type="button"
                          onClick={handler.addPricing}
                        >
                          <MemoPlusCircleFilled /> Add Monthly Quota
                        </Button>
                      </div>
                      <Acc.AccordionContent className="py-2 flex flex-col gap-3">
                        {/* max-h-[calc(100vh_-_30rem)] overflow-auto */}
                        {handler.categoryPricing
                          .filter((each) => each.action !== "delete")
                          .map((each) => (
                            <div
                              key={each.id}
                              id={each.id}
                              className="px-4 py-2 grid grid-cols-2 gap-3"
                            >
                              <FormItem className="flex flex-col col-span-full">
                                <div className="flex justify-between gap-4">
                                  <FormLabel>Monthly Quota</FormLabel>
                                  <button
                                    onClick={() => handler.removePricing(each)}
                                    type="button"
                                    className="text-xs text-destructive pl-2"
                                  >
                                    Remove
                                  </button>
                                </div>
                                <Sel.Select
                                  value={String(each.duration)}
                                  onValueChange={(value) => {
                                    handler.handlePricingChange({
                                      key: "duration",
                                      fieldId: each.id,
                                      value,
                                    })
                                  }}
                                >
                                  <FormControl>
                                    <Sel.SelectTrigger>
                                      <Sel.SelectValue placeholder="Select a Quota" />
                                    </Sel.SelectTrigger>
                                  </FormControl>
                                  <Sel.SelectContent>
                                    {new Array(36)
                                      .fill(0)
                                      .map((_each, monthIndex) => {
                                        const inUse =
                                          handler.categoryPricing.some(
                                            (pricing) =>
                                              pricing.duration ===
                                                monthIndex + 1 &&
                                              pricing.id !== each.id &&
                                              pricing.action !== "delete"
                                          )
                                        return (
                                          <Sel.SelectItem
                                            disabled={inUse}
                                            value={String(monthIndex + 1)}
                                            key={monthIndex + 1 + "unit"}
                                          >
                                            {monthIndex + 1} Month
                                            {monthIndex + 1 > 1 && "s"}
                                            {inUse && (
                                              <span className="text-destructive text-xs ml-2">
                                                (Already in use)
                                              </span>
                                            )}
                                          </Sel.SelectItem>
                                        )
                                      })}
                                  </Sel.SelectContent>
                                </Sel.Select>
                                <FormMessage />
                              </FormItem>

                              <FormItem className="flex flex-col">
                                <FormLabel className="text-neutral-600">
                                  Price
                                </FormLabel>
                                <FormControl>
                                  <CurrencyInput
                                    value={each.price}
                                    onValueChange={({ floatValue }) =>
                                      handler.handlePricingChange({
                                        key: "price",
                                        value: floatValue,
                                        fieldId: each.id,
                                      })
                                    }
                                    placeholder="Price"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>

                              <FormItem className="flex flex-col">
                                <FormLabel className="text-neutral-600">
                                  Discount
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    value={each.discount}
                                    onChange={(event) =>
                                      handler.handlePricingChange({
                                        key: "discount",
                                        value: event.target.value,
                                        fieldId: each.id,
                                      })
                                    }
                                    placeholder="Discount"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>

                              <div className="col-span-full px-4 mt-4">
                                <Separator className="bg-neutral-200" />
                              </div>
                            </div>
                          ))}
                      </Acc.AccordionContent>
                    </Acc.AccordionItem>
                  </Acc.Accordion>
                </div>
              </TabsContent>

              <TabsContent
                value="features"
                className="flex flex-col gap-4 py-2"
              >
                <div className="flex items-center sticky top-[5.5rem] justify-end">
                  <Button
                    className="rounded-full"
                    size={"sm"}
                    type="button"
                    onClick={handler.addField}
                  >
                    <MemoPlusCircleFilled /> Add a feature
                  </Button>
                </div>
                <div className="pb-4">
                  <Acc.Accordion
                    value={handler.activeField}
                    onValueChange={(value) => handler.setActiveField(value)}
                    type="single"
                    className="flex flex-col gap-4"
                    collapsible
                  >
                    <DndContext onDragEnd={handler.handleDragEnd}>
                      <SortableContext
                        items={handler.featuresField.map((each) => each.rank)}
                      >
                        {handler.featuresField
                          .filter((each) => each.action !== "delete")
                          .map((each) => (
                            <SortableField
                              key={each.id}
                              handler={handler}
                              field={each}
                            />
                          ))}
                      </SortableContext>
                    </DndContext>
                  </Acc.Accordion>
                </div>
              </TabsContent>

              <TabsContent
                value="subcategories"
                className="flex flex-col gap-4 py-2"
              >
                <div className="pb-4">
                  <Acc.Accordion
                    value={"subcategories"}
                    type="single"
                    className="flex flex-col gap-4"
                  >
                    <Acc.AccordionItem
                      value="subcategories"
                      className="rounded-lg overflow-hidden border-[#F2F2F2] border "
                    >
                      <div className="text-neutral-700 text-sm font-medium bg-[#F2F2F2] p-4 items-center w-full flex justify-between">
                        Sub Categories
                        <Button
                          className="rounded-full"
                          size={"sm"}
                          type="button"
                          onClick={handler.addSubCategory}
                        >
                          <MemoPlusCircleFilled /> Add Sub Category
                        </Button>
                      </div>
                      <Acc.AccordionContent className="py-2 ">
                        {/* max-h-[calc(100vh_-_30rem)] overflow-auto */}
                        {handler.subcategories
                          .filter((each) => each.action !== "delete")
                          .map((each) => (
                            <div
                              key={each.id}
                              id={each.id}
                              className="px-4 py-2 grid grid-cols-2 gap-3"
                            >
                              <FormItem className="flex flex-col col-span-full">
                                <FormControl>
                                  <div className="relative">
                                    <button
                                      onClick={() => {
                                        handler.removeSubCategory(each)
                                      }}
                                      className="absolute h-full flex items-center right-4"
                                    >
                                      <X className="size-4 text-destructive" />
                                    </button>
                                    <div className="grid-cols-2 grid gap-4">
                                      <Input
                                        value={each.name_en}
                                        onChange={(event) =>
                                          handler.handleSubCatChange({
                                            key: "name_en",
                                            value: event.target.value,
                                            fieldId: each.id,
                                          })
                                        }
                                        placeholder="Name in English"
                                      />
                                      <Input
                                        value={each.name_hr}
                                        onChange={(event) =>
                                          handler.handleSubCatChange({
                                            key: "name_hr",
                                            value: event.target.value,
                                            fieldId: each.id,
                                          })
                                        }
                                        placeholder="Name in Croatia"
                                      />
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>

                              {/* 
                            <div className="col-span-full px-4 mt-1 ">
                              <Separator className="bg-neutral-200" />
                            </div> */}
                            </div>
                          ))}
                      </Acc.AccordionContent>
                    </Acc.AccordionItem>
                  </Acc.Accordion>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}

export default CategoryDialog

const SortableField = ({
  handler,
  field: each,
}: {
  handler: ReturnType<typeof useCategoryDialog>
  field: CreateCategoryFeatures
}) => {
  const {
    // attributes,
    listeners,
    setNodeRef,
    // setActivatorNodeRef,
    transform,
    // items,
    isDragging,
    transition,
  } = useSortable({ id: each.rank })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  useEffect(() => {
    if (isDragging) {
      handler.setActiveField("undefined")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  return (
    <Acc.AccordionItem
      ref={setNodeRef}
      // {...attributes}
      style={style}
      id={each.id}
      className="rounded-lg overflow-hidden border-[#F2F2F2] border "
      value={each.id}
    >
      <Acc.AccordionTrigger
        // {...arguments}
        className="hover:text-neutral-700 text-sm font-medium bg-[#F2F2F2] h-12 px-4 text-neutral-500"
      >
        <span className="flex items-center truncate gap-2 w-full">
          <Grip
            {...listeners}
            // ref={setActivatorNodeRef}
            className={cn(
              "size-4",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
          />
          {each.label_en} | {each.label_hr}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handler.removeField(each)
            }}
            className="ml-auto p-2"
            type="button"
          >
            <X className="size-4 text-destructive/90" />
          </button>
        </span>
      </Acc.AccordionTrigger>
      <Acc.AccordionContent className="p-4 bg-white flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl>
              <Input
                value={each.label_en}
                onChange={(event) =>
                  handler.handleFeatureFieldChange({
                    key: "label_en",
                    value: event.target.value,
                    fieldId: each.id,
                  })
                }
                placeholder="Label"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel>Label in Croatia</FormLabel>
            <FormControl>
              <Input
                value={each.label_hr}
                onChange={(event) =>
                  handler.handleFeatureFieldChange({
                    key: "label_hr",
                    value: event.target.value,
                    fieldId: each.id,
                  })
                }
                placeholder="Label In Croatia"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <FormItem>
          <FormLabel>Requirement</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) =>
                handler.handleFeatureFieldChange({
                  key: "required",
                  value: !!Number(value),
                  fieldId: each.id,
                })
              }
              defaultValue={"1"}
              className="flex flex-col gap-2"
            >
              <FormItem className="flex-row items-center space-x-3">
                <FormControl>
                  <RadioGroupItem size="sm" value="1" />
                </FormControl>
                <FormLabel className="font-normal text-neutral-500 text-xs">
                  Required
                </FormLabel>
              </FormItem>
              <FormItem className="flex-row items-center space-x-3">
                <FormControl>
                  <RadioGroupItem size="sm" value="0" />
                </FormControl>
                <FormLabel className="font-normal text-neutral-500 text-xs">
                  Not Required
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Type</FormLabel>
          <Sel.Select
            defaultValue="text"
            value={each.type}
            onValueChange={(value) => {
              handler.handleFeatureFieldChange({
                key: "type",
                value,
                fieldId: each.id,
              })
            }}
          >
            <FormControl>
              <Sel.SelectTrigger>
                <Sel.SelectValue placeholder="Select a type" />
              </Sel.SelectTrigger>
            </FormControl>
            <Sel.SelectContent>
              {fieldTypes.map((each, typeIndex) => (
                <Sel.SelectItem value={each.value} key={typeIndex + "type"}>
                  {each.label} ({each.value})
                </Sel.SelectItem>
              ))}
            </Sel.SelectContent>
          </Sel.Select>
          <FormMessage />
          {["select", "checkbox", "radio"].includes(each.type) && (
            <div className="flex gap-2 flex-col">
              <span className="text-sm flex items-center justify-between gap-3 text-neutral-500">
                Options
                <Button
                  onClick={() =>
                    handler.handleFeatureFieldChange({
                      key: "options",
                      value: [...(each.options ?? []), ""],
                      fieldId: each.id,
                    })
                  }
                  type="button"
                  className="px-0 size-6 min-h-6 rounded-full"
                >
                  <MemoPlusCircleFilled />
                </Button>
              </span>
              {each.options?.map((opt, optionIndex: number) => (
                <Input
                  value={opt}
                  onChange={(event) => {
                    handler.handleFeatureFieldChange({
                      key: "options",
                      value:
                        each.options?.map((_opti, j) =>
                          j == optionIndex ? event.target.value : _opti
                        ) ?? [],
                      fieldId: each.id,
                    })
                  }}
                  key={"fieldSelectOption" + each.id + optionIndex}
                  className="h-9 text-sm shadow-none text-neutral-500 focus-visible:ring-primary"
                />
              ))}
            </div>
          )}
        </FormItem>

        {["text", "textarea"].includes(each.type) && (
          <FormItem className="flex flex-col">
            <FormLabel>Unit</FormLabel>
            <FormControl>
              <Input
                value={each.unit}
                onChange={(event) =>
                  handler.handleFeatureFieldChange({
                    key: "unit",
                    value: event.target.value,
                    fieldId: each.id,
                  })
                }
                placeholder="sqm"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      </Acc.AccordionContent>
    </Acc.AccordionItem>
  )
}
