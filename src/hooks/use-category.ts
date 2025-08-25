
import { useSetupCategoryMutation, useUpdateCategoryMutation } from "@/services/category.service";
import { CategoryDialogProps, CreateCategoryFeatures, CreateCategoryPricing, CreateSubCategories } from "@/types/category.type";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AnyObject } from "yup";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().nonempty("Category Name is required"),
  type: z.enum(["regular", "earnings"], { required_error: "Type is required" }),
  charging_unit: z.string().optional(),
  icon: z.string().optional(),
})
//   .refine(
//   (data) => data.type !== "earnings" || !!data.charging_unit,
//   {
//     message: "Charging unit is required when type is earnings",
//     path: ["charging_unit"],
//   }
// )

const defaultField: CreateCategoryFeatures = {
  label: "Field 1",
  id: "field1",
  rank: 1,
  action: "new",
  required: true,
  unit: "",
  type: "text",
  options: ["", ""],
}

const defaultPricing: CreateCategoryPricing[] = [
  { id: "pricing1", action: "new", duration: 1, price: 0, discount: 0 },
  { id: "pricing2", action: "new", duration: 6, price: 0, discount: 5 },
  { id: "pricing3", action: "new", duration: 12, price: 0, discount: 10 },
]

const defaultSubcategories: CreateSubCategories[] = [
  { name: "", id: "subcategory1", action: "new" },
  { name: "", id: "subcategory2", action: "new" }
]


export const useCategoryDialog = ({ open, category, close, copying }: CategoryDialogProps) => {

  const [addCategory, { isLoading: isCreatingCategory }] = useSetupCategoryMutation()
  const [updateCategory, { isLoading: isUpdatingCategory }] = useUpdateCategoryMutation()
  const [categoryPricing, setCategoryPricing] = useState(defaultPricing)
  const [subcategories, setSubcategories] = useState(defaultSubcategories)
  // const [activePricing, setActivePricing] = useState(defaultPricing[0].id)
  const [featuresField, setFeaturesField] = useState([defaultField])
  const [activeField, setActiveField] = useState(featuresField[0].id)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", icon: "", type: "regular"
    }
  })

  useEffect(() => {
    if (!open) {
      form.reset(
        // { name: category?.name }
      )
      form.setValue("name", category?.name || "");
      setFeaturesField([defaultField])
      setCategoryPricing(defaultPricing)
      setSubcategories(defaultSubcategories)
      close();
    } else if (open && category) {
      form.setValue("name", copying ? `${category.name} Copy` : category.name, { shouldValidate: true });
      form.setValue("icon", category.icon || undefined, { shouldValidate: true });
      form.setValue("type", category.type || undefined, { shouldValidate: true });
      form.setValue("charging_unit", category.charging_unit || undefined, { shouldValidate: true });

      setSubcategories(
        category.subcategories[0] ? category.subcategories.map((each, i) => ({
          ...each,
          saveId: each.id,
          id: `subcategory${i}`,
          action: "update"
        })) : defaultSubcategories
      )

      setCategoryPricing(
        category.category_pricing[0] ? category.category_pricing.map((each, i) => ({
          ...each,
          saveId: each.id,
          id: `pricing${i}`,
          action: "update",
        })) : defaultPricing
      )

      const fields: CreateCategoryFeatures[] = category.category_features[0] ? category.category_features.map((each, i) => ({
        label: each.label,
        id: `field${i}`,
        action: "update",
        rank: i + 1,
        saveId: each.id,
        required: each.required,
        type: each.type,
        options: each.options,
        unit: each.unit,
      })) : [defaultField]
      setFeaturesField(fields);
      setActiveField(fields[0].id);

    }
  }, [open, category, copying, form, close])

  const handleFeatureFieldChange = ({
    key,
    fieldId,
    value,
  }: {
    fieldId: string
    value: string | number | string[] | object[] | boolean
    key: keyof typeof defaultField
  }) => {
    setFeaturesField((_) =>
      _.map((_f) => (_f.id == fieldId ? { ..._f, [key]: value } : _f))
    )
  }

  const addField = () => {
    const id = `field${featuresField.length + 1}`
    setFeaturesField([
      ...featuresField,
      {
        ...defaultField,
        label: `Field ${featuresField.length + 1}`,
        id, rank: featuresField.length + 1
      },
    ])
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
      setActiveField(id)
    }, 300)
  }

  const handlePricingChange = ({
    key,
    fieldId,
    value,
  }: {
    fieldId: string
    value: string | number | string[] | object[]
    key: keyof (typeof defaultPricing)[0]
  }) => {
    setCategoryPricing((_) =>
      _.map((_f) => (_f.id == fieldId ? { ..._f, [key]: value } : _f))
    )
  }

  const addPricing = () => {
    const id = `pricing${categoryPricing.length + 1}`
    setCategoryPricing((pricings) => [
      {
        discount: 0,
        action: "new",
        duration: null,
        price: 0,
        id,
      },
      ...pricings,
    ])
  }


  const handleSubCatChange = ({
    // key,
    fieldId,
    value,
  }: {
    fieldId: string
    value: string
    // value: string | number | string[] | object[]
    // key: keyof (typeof defaultPricing)[0]
  }) => {
    setSubcategories((_) =>
      _.map((cat) => (cat.id == fieldId ? { ...cat, name: value } : cat))
      // _.map((cat) => (cat.id == fieldId ? { ...cat, [key]: value } : _f))
    )
  }

  const addSubCategory = () => {
    const id = `subcategory${subcategories.length + 1}`
    setSubcategories((subs) => [{ name: "", id, action: "new" }, ...subs]);
  }


  const removeSubCategory = (sub: CreateSubCategories) => {
    // const id = `subcategory${subcategories.length + 1}`
    // setSubcategories((subs) => subs.map);
    if (sub.saveId) {
      setSubcategories(su => su.map(each => each.id == sub.id ? ({ ...each, action: "delete" }) : each))
    } else {
      setSubcategories(su => su.filter(each => each.id != sub.id));
    }

  }

  const removeField = (sub: CreateCategoryFeatures) => {
    // const id = `subcategory${subcategories.length + 1}`
    // setSubcategories((subs) => subs.map);
    if (sub.saveId) {
      setFeaturesField(su => su.map(each => each.id == sub.id ? ({ ...each, action: "delete" }) : each))
    } else {
      setFeaturesField(su => su.filter(each => each.id != sub.id));
    }

  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // const subcats: CreateSubCategories[] = subcategories;
    const { data, error }: AnyObject = await ((category && !copying) ? updateCategory({
      ...values,
      id: category.id,
      subcategories: subcategories
        .map(each => ({
          ...each,
          name: each.name || "To Be Deleteed",
          action: each.name ? each.action : "delete",
          id: each.saveId as unknown as string,
        }))
        .filter(each => each.action == "delete" ? each.saveId : true),
      category_pricing: categoryPricing.map(each => ({
        ...each,
        id: each.saveId as unknown as string,
      })),
      category_features: featuresField.map((each) => ({
        ...each,
        id: each.saveId as unknown as string,
        required: !!Number(each.required),
        options: each.options?.filter((option) => option),
      })),

    }) : addCategory({
      ...values,
      category_pricing: categoryPricing.map(each => ({
        discount: each.discount,
        duration: each.duration,
        price: each.price
      })),
      subcategories: subcategories.filter(each => each.name).map(each => ({
        name: each.name
      })),
      category_features: featuresField.map((each) => ({
        label: each.label,
        options: each.options?.filter((option) => option),
        rank: each.rank,
        required: !!Number(each.required),
        type: each.type,
        unit: each.unit,
      })),
    }))

    if (data) {
      toast.success("Success", {
        description: `Category ${category ? "Updated" : "Added"} Successfully`,
      })
      close()
      form.reset()
      setFeaturesField([defaultField])
      setSubcategories(defaultSubcategories);
      setCategoryPricing(defaultPricing)
    } else {
      toast.error("Error", {
        position: "bottom-left",
        description: error?.message,
      })
    }
  }



  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = featuresField.findIndex(each => each.rank == active.id);
    const newIndex = featuresField.findIndex(each => each.rank == over.id);
    // const oldIndex = items.indexOf(active.id.toString())
    // const newIndex = items.indexOf(over.id.toString())
    const newOrder = arrayMove(featuresField, oldIndex, newIndex) // Reorder items

    setFeaturesField(newOrder.map((each, i) => ({ ...each, rank: i + 1 }))) // Update local state
    // setItems(newOrder) // Update local state
    // handler.updateFeatureOrder(newOrder) // Pass updated order to handler
  }


  return {
    onSubmit, activeField, handleFeatureFieldChange, form, handleSubCatChange,
    handlePricingChange, addField, addPricing, isSaving: isCreatingCategory || isUpdatingCategory,
    categoryPricing, featuresField, setActiveField, addSubCategory, subcategories,
    removeSubCategory, handleDragEnd, removeField
  }
}
