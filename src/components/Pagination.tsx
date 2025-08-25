import { ChevronLeft, ChevronRight } from "lucide-react"
import ReactPaginate from "react-paginate"

const Pagination = ({
  pageChange,
  count,
  limit,
}: {
  pageChange: (page: number) => void
  limit: number
  count: number
}) => {
  const totalPages = Math.ceil(count / limit)
  // const [page, setCurrentPage] = useState(pp || 1)

  return limit < count ? (
    <div className="flex justify-center">
      <ReactPaginate
        className="flex gap-3 items-center my-4"
        breakLabel="..."
        nextLabel={
          <span
            // disabled={page >= totalPages}
            className="w-24 bg-primary text-white text-sm flex items-center justify-center h-9 gap-1 rounded-md disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="size-4" />
          </span>
        }
        onPageChange={(e) => {
          pageChange(e.selected)
        }}
        // pageRangeDisplayed={5}
        pageCount={totalPages}
        activeLinkClassName="bg-primary text-white"
        disabledLinkClassName="opacity-50 cursor-not-allowed pointer-events-none"
        pageLinkClassName="border border-primary text-neutral-800 block h-9 min-w-9 flex justify-center items-center px-3 rounded-md text-sm"
        previousLabel={
          <span
            // disabled={page <= 1}
            className="w-24 bg-primary text-white text-sm flex items-center justify-center h-9 gap-1 rounded-md disabled:cursor-not-allowed"
            // className="w-24 gap-1 rounded-md disabled:cursor-not-allowed"
          >
            <ChevronLeft className="size-4" /> Previous
          </span>
        }
        renderOnZeroPageCount={null}
      />
    </div>
  ) : null
}

export default Pagination
