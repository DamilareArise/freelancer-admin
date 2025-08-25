import FAQDialog from "@/components/dialogs/FAQDialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import RouteHead from "@/components/widgets/RouteHead"
import SearchInput from "@/components/widgets/SearchInput"
import { filter } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import {
  useDeleteFaqMutation,
  useGetFaqsQuery,
  useUpdateFaqMutation,
} from "@/services/faq.service"
import { FAQ } from "@/types/faq.type"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Edit, Ellipsis, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { SupportBreadcrumb } from "./Index"

const FAQs = () => {
  const [fAQDialogIsOpen, setFAQDialogIsOpen] = useState(false)
  const [currentFAQ, setCurrentFAQ] = useState<FAQ | undefined>()
  const limit = 10
  const [updateFAQ] = useUpdateFaqMutation()
  // const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const { data: rawFAQs, isLoading } = useGetFaqsQuery("")
  const [faqs, setFAQs] = useState<FAQ[]>([])
  useEffect(() => {
    setFAQs(filter(rawFAQs ?? [], searchText, ["answer", "question"]))
  }, [searchText, rawFAQs])

  // const { changePage, currentItems, itemOffset } = usePagination({
  //   limit,
  //   items: fAQs ?? [],
  // })

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = faqs.findIndex((each) => each.rank == active.id)
    const newIndex = faqs.findIndex((each) => each.rank == over.id)
    // const oldIndex = items.indexOf(active.id.toString())
    // const newIndex = items.indexOf(over.id.toString())
    const newOrder = arrayMove(faqs, oldIndex, newIndex) // Reorder items

    setFAQs(newOrder.map((each, i) => ({ ...each, rank: i + 1 }))) // Update local state
    // setItems(newOrder) // Update local state
    // handler.updateFeatureOrder(newOrder) // Pass updated order to handler

    toast.loading("Updating...", {
      id: "updateFAQPosition",
      description: `Updating FAQ position`,
    })

    const { data, error } = await updateFAQ({
      faqs: [
        { id: newOrder[newIndex].id, rank: newOrder[newIndex].rank },
        { id: newOrder[oldIndex].id, rank: newOrder[oldIndex].rank },
      ],
    })

    toast.dismiss("updateFAQPosition")

    if (data) {
      toast.success("Success", {
        description: "FAQ Added Successfully",
      })
    } else if (error && "message" in error) {
      toast.error("Error.", {
        position: "bottom-left",
        description: error?.message,
      })
    }
  }

  return (
    <div className="flex fade flex-col gap-6 mb-6">
      <SupportBreadcrumb page="FAQs" />
      <RouteHead title="FAQs" />

      <div className="flex items-center justify-between gap-4">
        <SearchInput onSearch={setSearchText} />
        <Button
          className="h-10 font-normal"
          onClick={() => setFAQDialogIsOpen(true)}
        >
          <span className="size-5 border-white rounded-md border flex items-center justify-center">
            <Plus />
          </span>
          Add FAQ
        </Button>
      </div>
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr className="thead-row">
              {/* <th></th> */}
              <th>S/N</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              new Array(limit).fill(null).map((_, i) => (
                <tr className="tbody-row" key={i + "skeleton"}>
                  <td>
                    <Skeleton className="h-3 w-48" />
                  </td>
                  <td>
                    <Skeleton className="h-3 w-40" />
                  </td>
                  <td>
                    <Skeleton className="h-3 w-32" />
                  </td>
                  <td>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </td>
                </tr>
              ))}

            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext items={faqs.map((each) => each.rank)}>
                {faqs.map((each, index) => (
                  <SortableRow
                    setFAQDialogIsOpen={setFAQDialogIsOpen}
                    setCurrentFAQ={setCurrentFAQ}
                    faq={each}
                    index={index}
                    key={"question" + each.id}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
      </div>

      {/* <Pagination
        count={rawFAQs?.length ?? 0}
        limit={limit}
        // page={page}
        pageChange={changePage}
      /> */}

      <FAQDialog
        close={() => {
          setCurrentFAQ(undefined)
          setFAQDialogIsOpen(false)
        }}
        open={fAQDialogIsOpen}
        faq={currentFAQ}
      />
    </div>
  )
}

export default FAQs

const SortableRow = ({
  faq: each,
  index,
  setCurrentFAQ,
  setFAQDialogIsOpen,
}: {
  faq: FAQ
  index: number
  setCurrentFAQ: (val: FAQ) => void
  setFAQDialogIsOpen: (val: boolean) => void
}) => {
  const {
    // attributes,
    // listeners,
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

  const [delFAQ, { isLoading: isDeleting }] = useDeleteFaqMutation()

  const deleteFAQ = async (fAQ: FAQ) => {
    toast.loading("Loading...", {
      id: "deletingFAQToast",
      description: `Deleting FAQ - ${each?.question}`,
    })

    const { data, error } = await delFAQ(fAQ.id)
    toast.dismiss("deletingFAQToast")

    if (data) {
      toast.success("Success", {
        description: "FAQ deleted successfully",
      })
    } else if (error && "message" in error) {
      toast.error("Oops", {
        description: error.message,
      })
    }
  }

  return (
    <tr
      className={cn(
        "tbody-row min-h-20 ",
        isDragging ? "bg-white shadow-md z-10" : "-z-10"
      )}
      ref={setNodeRef}
      // {...attributes}
      style={style}
    >
      {/* <td style={{ paddingRight: 0 }}>
        <button
          {...listeners}
          // ref={setActivatorNodeRef}
          className={cn(
            "size-4 mt-1",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
        >
          <Grip className="size-4 text-neutral-600" />
        </button>
      </td> */}
      <td>{index + 1}</td>
      <td className="min-w-32">
        <span className="line-clamp-2">{each.question}</span>
      </td>
      <td className="min-w-40">
        <span className="line-clamp-2">{each.answer}</span>
      </td>
      <td>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex size-8 items-center">
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={isDeleting}
              onClick={() => deleteFAQ(each)}
              className="text-destructive"
            >
              <Trash2 /> Remove FAQ
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isDeleting}
              onClick={() => {
                setCurrentFAQ(each)
                setFAQDialogIsOpen(true)
              }}
            >
              <Edit /> Edit FAQ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}
