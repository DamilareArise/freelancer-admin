import { listingSummaryCards } from "@/lib/constants"
import { keyValue } from "@/lib/helpers"
import { useGetListingSummaryQuery } from "@/services/listing.service"
import { useEffect, useState } from "react"
import AttentionBox from "./AttentionBox"
import InfoCard, { InfoCardSkeleton } from "./InfoCard"

const ListingSummary = () => {
  const { data, isLoading } = useGetListingSummaryQuery(null)
  const [summaryCards, setSummaryCards] = useState(
    keyValue(listingSummaryCards)
  )

  useEffect(() => {
    if (!data) return
    const summary = listingSummaryCards
    summary.active_listings.value = data.approved
    summary.expired_listings.value = data.expired
    summary.free_listings.value = data.free_listings
    summary.total_listings.value = data.total
    summary.rejected_listings.value = data.rejected
    summary.pending_listings.value = data.pending
    summary.total_revenue.value = data.total_revenue
    setSummaryCards(keyValue(summary))
  }, [data])

  return (
    <div>
      <AttentionBox />
      <div className="flex gap-2 flex-wrap mt-5">
        {summaryCards.map(({ value, key }) => (
          <div key={key} className="flex-1 min-w-[15rem] sm:min-w-[17rem]">
            {isLoading ? <InfoCardSkeleton /> : <InfoCard {...value} />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListingSummary
