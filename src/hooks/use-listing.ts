import { useGetCategoryQuery } from "@/services/category.service"
import { rejectionForm, RejectionFormType, useUpdateListingMutation, useUpdateListStatusMutation } from "@/services/listing.service"
import { openAlertDialog } from "@/slices/app.slice"
import { FeatureFieldType } from "@/types/category.type"
import { Listing, ListingDialogProps, ListingFeature } from "@/types/listing.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { skipToken } from "@reduxjs/toolkit/query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AnyObject } from "yup"
import { z } from "zod"
import { useAppDispatch } from "./redux.hooks"

const defaultSchema = {
  description_en: z.string()
    .nonempty("Desciption in English is required")
    .max(500, {
      message: "Description must not be longer than 500 characters.",
    }),
  description_hr: z.string()
    .max(500, {
      message: "Description must not be longer than 500 characters.",
    }),
  price: z.number()
    .min(0, {
      message: "Price can't be less than zero.",
    }),
}
const formSchema = z.object(defaultSchema)

export type ListFormType = z.infer<typeof formSchema> & Record<string, ListingFeature['value']>;

const defaultForm: ListFormType = {
  description_en: "", description_hr: "", price: 0
}

export const useListingDialog = ({ open, setListing, listing, close }: ListingDialogProps) => {
  const dispatch = useAppDispatch()
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateListStatusMutation()
  const [confirmApprovalIsOpen, setConfirmApprovalIsOpen] = useState(false);
  const [confirmRejectionIsOpen, setConfirmRejectionIsOpen] = useState(false);
  const [updateListing, { isLoading: isUpdatingListing }] = useUpdateListingMutation();
  const { data: category, isLoading: isFetchingCategory } = useGetCategoryQuery(listing?.category ?? skipToken);
  const [schema, setSchema] = useState(formSchema);
  const form = useForm<ListFormType>({
    resolver: zodResolver(schema),
    defaultValues: defaultForm
  })

  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!open) {
      form.reset(defaultForm)
      setEditing(false)
    } else if (open && listing) {
      form.setValue("description_en", listing.property?.description_en, { shouldValidate: true });
      form.setValue("price", Number(listing.price), { shouldValidate: true });
      form.setValue("description_hr", listing.property?.description_hr ?? "", { shouldValidate: true });
      listing.features?.forEach(({ feature_field, type, value }) => {
        if (type == "number") {
          form.setValue(String(feature_field), value ? Number(value) : 0, { shouldValidate: true });
        } else {
          form.setValue(String(feature_field), value, { shouldValidate: true });
        }
      });

      const dynamicSchema: Record<string, z.ZodSchema> = {};
      const fieldTypeSchemas: Record<FeatureFieldType, z.ZodSchema[]> = {
        select: [z.string().optional(), z.string({ required_error: "You must select one." })],
        text: [z.string().optional(), z.string({ required_error: "This Field is required." }).nonempty("This Field is required")],
        number: [z.number().optional(), z.number().min(1, { message: "Value can't be less than 1" })],
        checkbox: [z.array(z.string().nonempty()).min(0), z.array(z.string().nonempty()).min(1, "You must select at least one")],
        radio: [z.string().optional(), z.string().nonempty("You must pick one")],
        textarea: [z.string().optional(), z.string().nonempty("This field is required")],
      }
      category?.category_features.forEach(feature => {
        const [optional, required] = fieldTypeSchemas[feature.type]
        dynamicSchema[String(feature.id)] = feature.required ? required : optional;
      })
      setSchema(z.object({ ...defaultSchema, ...dynamicSchema }))
    }
  }, [open, listing, form, category?.category_features])


  const _rejectionForm = useForm<RejectionFormType>({
    resolver: zodResolver(rejectionForm),
  })

  const onSubmit = async (values: ListFormType) => {
    if (!listing) return;
    const request: Listing = {
      ...listing,
      // price: String(values.price),
      property: {
        ...listing.property,
        description_en: values.description_en,
        description_hr: values.description_hr,
      },
      // features: listing.features.map(each => ({
      //   ...each,
      //   value: values[each.feature_field]
      // }))
    }

    const { data, error }: AnyObject = await updateListing(request)

    if (data) {
      toast.success("Success", {
        position: "bottom-left",
        description: "Listing Updated Successfully",
      })
      // close()
      setEditing(false);
      setListing(data);
      document
        .getElementById("listingdialog")
        ?.scrollTo({ top: 1000, behavior: "smooth" })
      // form.reset()
    } else {
      toast.error("Error.", {
        position: "bottom-left",
        description: error?.message,
      })
    }
  }


  const rejectListing = async (values: RejectionFormType) => {
    const { data, error } = await updateStatus({
      listing_ids: [listing?.id],
      action: "reject",
      rejection_reasons: values.items.map((each) =>
        each == "Other" ? values.other : each
      ),
    })

    if (data) {
      setConfirmRejectionIsOpen(false);
      close()
      dispatch(
        openAlertDialog({
          desc: `This listing has been successfully rejected. The listing owner has been notified.`,
          title: "Listing Rejected",
        })
      )
    } else if (error && "message" in error) {
      toast.error("Oops", {
        position: "bottom-center",
        description: error.message,
      })
    }
  }

  useEffect(() => {
    if (!confirmRejectionIsOpen) {
      _rejectionForm.reset({})
    }
  }, [confirmRejectionIsOpen, _rejectionForm])


  const approveListing = async () => {
    const { data, error } = await updateStatus({
      listing_ids: [listing?.id],
      action: "approve",
    })

    if (data) {
      setConfirmApprovalIsOpen(false);
      close()
      dispatch(
        openAlertDialog({
          desc: `This listing has been successfully approved. The listing owner has been notified.`,
          title: "Listing Approved",
        })
      )
    } else if (error && "message" in error) {
      toast.error("Oops", {
        position: "bottom-center",
        description: error.message,
      })
    }
  }

  return {
    onSubmit, form, category, isFetchingCategory,
    isSaving: isUpdatingListing,
    editing, setEditing, rejectListing,
    confirmApprovalIsOpen, setConfirmApprovalIsOpen,
    isUpdatingStatus, approveListing, confirmRejectionIsOpen,
    setConfirmRejectionIsOpen, rejectionForm: _rejectionForm
  }
}
