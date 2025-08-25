import { pluralize } from "@/lib/helpers"
import { useGetListingSummaryQuery } from "@/services/listing.service"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

const AttentionBox = () => {
  const { data } = useGetListingSummaryQuery(null)
  if (!data?.pending) return null

  return (
    <div className="flex flex-col gap-6 py-4 px-3 rounded-xl bg-primary-1000 text-white">
      <div className="flex items-center gap-2">
        <div className="size-4 rounded-full overflow-hidden relative p-1">
          <div className="absolute inset-0 bg-[#81563b66] animate-ping"></div>
          <div className="h-full w-full rounded-full bg-[#ff6100]"></div>
        </div>
        <span className="text-xs">Attention needed</span>
      </div>

      <div className="flex flex-col sm:flex-row  justify-between gap-6">
        <div className="flex flex-col">
          <h3 className="font-medium text-xl">
            You have <span className="text-[#00ffaa]">{data.pending}</span>{" "}
            pending {pluralize(data.pending, "listing")} waiting for your review
          </h3>
          <p className="text-xs">
            Approve or deny them to keep things ruunning smoothly
          </p>
        </div>

        <Link
          to={"/admin/listings/management#listings"}
          className="text-primary-600 whitespace-nowrap font-semibold flex items-center gap-1"
        >
          See Listing
          <span>
            <ChevronRight className="size-5" />
          </span>
        </Link>
      </div>
    </div>
  )
}

export default AttentionBox
