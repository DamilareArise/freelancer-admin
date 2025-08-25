import CategoryChart from "@/components/charts/CategoryChart"
import RouteHead from "@/components/widgets/RouteHead"

const ListingReport = () => {
  return (
    <div className="flex flex-col gap-5 @container">
      <div className="flex justify-between gap-3 flex-wrap items-center">
        <RouteHead className="text-base md:text-xl" title="Listing Report" />
      </div>

      <div className="flex flex-col gap-6 @min-xl:grid grid-cols-3">
        <div className="col-span-full">
          <CategoryChart />
        </div>
      </div>
    </div>
  )
}

export default ListingReport
