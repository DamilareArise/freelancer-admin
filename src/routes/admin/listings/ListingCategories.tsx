import CategoryDialog from "@/components/dialogs/CategoryDialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import PricingCard, {
  PricingCardSkeleton,
} from "@/components/widgets/PricingCard"
import SearchInput from "@/components/widgets/SearchInput"
import { categoryIcons } from "@/lib/constants"
import { filter } from "@/lib/helpers"
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/services/category.service"
import { Category } from "@/types/category.type"
import { Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import * as AlertD from "@/components/ui/alert-dialog"

const ListingCategories = () => {
  const [categoryDialogIsOpen, setCategoryDialogIsOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [copying, setCopying] = useState<boolean>(false)
  const { data: rawCategories, isLoading } = useGetCategoriesQuery("")
  const [searchText, setSearchText] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => {
    setCategories(filter(rawCategories, searchText, ["name"]))
  }, [searchText, rawCategories])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Dialog
          open={categoryDialogIsOpen}
          onOpenChange={(open) => {
            setCategoryDialogIsOpen(open)
            setCurrentCategory(null)
          }}
        >
          <SearchInput
            onSearch={setSearchText}
            placeholder="Search Categories by name"
          />
          <DialogTrigger asChild>
            <Button className="rounded-full size-12 sm:size-[initial] sm:rounded-md">
              <Plus className="size-5" />{" "}
              <span className="hidden sm:inline">Add Category</span>
            </Button>
          </DialogTrigger>
          <CategoryDialog
            category={currentCategory}
            copying={copying}
            close={() => {
              setCategoryDialogIsOpen(false)
              setCopying(false)
            }}
            open={categoryDialogIsOpen}
          />
        </Dialog>
      </div>

      <div className="grid-cols-auto sm:[--col-w:22rem] gap-5">
        {isLoading &&
          new Array(6)
            .fill(0)
            .map((_each, i) => <PricingCardSkeleton key={"Skeleton" + i} />)}

        {categories?.map((category) => (
          <CategoryCard
            key={category.id + category.name}
            onEdit={() => {
              setCurrentCategory(category)
              setCategoryDialogIsOpen(true)
            }}
            onCopy={() => {
              setCurrentCategory(category)
              setCategoryDialogIsOpen(true)
              setCopying(true)
            }}
            category={category}
          />
        ))}
      </div>
    </div>
  )
}

export default ListingCategories

export const CategoryCard = ({
  category,
  onEdit,
  onCopy,
}: {
  category: Category
  onEdit: () => void
  onCopy: () => void
}) => {
  const [delCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)

  const deleteCategory = async () => {
    const { error } = await delCategory(category.id)

    if (!error) {
      toast.success("Success", {
        description: "Category deleted successfully",
      })
      setDeleteIsOpen(false)
    } else if (error && "message" in error) {
      toast.error("Oops", { description: error.message })
    }
  }

  return (
    <>
      <PricingCard
        key={"category" + category.id}
        heading={category.name}
        listHeading={"Features Fields"}
        title={category.name}
        onDelete={() => setDeleteIsOpen(true)}
        deleting={isDeleting}
        onEdit={onEdit}
        onCopy={onCopy}
        icon={
          category.icon &&
          categoryIcons[category.icon]?.url && (
            <img
              className="size-4"
              src={categoryIcons[category.icon].url}
              alt="Category Icon"
            />
          )
        }
        list={category.category_features.map(
          (each) =>
            `${each.label} (${each.type}, ${
              each.required ? "Required" : "Optional"
            })`
        )}
        price={
          category.category_pricing[0]?.price
            ? Number(category.category_pricing[0]?.price)
            : 0
        }
        priceDesc={
          category.category_pricing[0] &&
          `for ${category.category_pricing[0]?.duration} month${
            category.category_pricing[0]?.duration > 1 ? "s" : ""
          }`
        }
      />

      <AlertD.AlertDialog open={deleteIsOpen} onOpenChange={setDeleteIsOpen}>
        <AlertD.AlertDialogContent>
          <AlertD.AlertDialogHeader className="flex flex-col items-center gap-[16px]">
            <AlertD.AlertDialogTitle
              title="Delete Category"
              variant="destructive"
              icon={<Trash2 className="text-destructive size-5" />}
            />
          </AlertD.AlertDialogHeader>
          <AlertD.AlertDialogDescription>
            You are about to delete {category.name} category. Please note that
            this action is not reversible
          </AlertD.AlertDialogDescription>
          <AlertD.AlertDialogFooter>
            <div className="flex flex-col w-full gap-3">
              <Button
                onClick={deleteCategory}
                isLoading={isDeleting}
                variant={"destructive"}
                className="h-11 font-normal"
              >
                Delete
              </Button>
              <AlertD.AlertDialogCancel
                disabled={isDeleting}
                className="w-full h-11 font-normal border-primary text-primary"
              >
                Cancel
              </AlertD.AlertDialogCancel>
            </div>
          </AlertD.AlertDialogFooter>
        </AlertD.AlertDialogContent>
      </AlertD.AlertDialog>
    </>
  )
}
